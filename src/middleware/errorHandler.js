const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  console.error('Error:', err); // keep full error in server logs

  const isProd = process.env.NODE_ENV === 'production';

  // Base shape for all error responses
  const baseResponse = {
    success: false,
    message: err.message || 'Internal server error',
    errorType: err.name || 'Error',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  // Explicit statusCode set on error (from controllers/middleware)
  if (err.statusCode) {
    const status = err.statusCode;
    const body = {
      ...baseResponse,
      statusCode: status,
      details: err.details,
    };

    if (!isProd && err.stack) {
      body.stack = err.stack;
    }

    return res.status(status).json(body);
  }

  // Zod validation errors (request validation)
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    const body = {
      ...baseResponse,
      statusCode: 400,
      message: 'Validation error',
      errorType: 'ZodValidationError',
      fieldErrors,
    };

    if (!isProd && err.stack) {
      body.stack = err.stack;
    }

    return res.status(400).json(body);
  }

  // Mongoose validation errors (schema validation in MongoDB)
  if (err.name === 'ValidationError') {
    const fieldErrors = Object.values(err.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
      kind: e.kind,
    }));

    const body = {
      ...baseResponse,
      statusCode: 400,
      message: 'Database validation error',
      errorType: 'MongooseValidationError',
      fieldErrors,
    };

    if (!isProd && err.stack) {
      body.stack = err.stack;
    }

    return res.status(400).json(body);
  }

  // Mongo duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    const body = {
      ...baseResponse,
      statusCode: 409,
      message: 'Duplicate key error',
      errorType: 'DuplicateKeyError',
      duplicateFields: err.keyValue,
    };

    if (!isProd && err.stack) {
      body.stack = err.stack;
    }

    return res.status(409).json(body);
  }

  // JWT / auth-related errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const body = {
      ...baseResponse,
      statusCode: 401,
      message: err.message || 'Invalid or expired token',
      errorType: 'AuthError',
    };

    if (!isProd && err.stack) {
      body.stack = err.stack;
    }

    return res.status(401).json(body);
  }

  // Fallback for unexpected errors
  const body = {
    ...baseResponse,
    statusCode: 500,
    message: 'Internal server error',
    errorType: 'InternalServerError',
  };

  if (!isProd && err.stack) {
    body.stack = err.stack;
  }

  res.status(500).json(body);
}

module.exports = errorHandler;
