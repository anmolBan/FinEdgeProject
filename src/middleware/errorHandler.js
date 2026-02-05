const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);

  // Explicit statusCode set on error
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, details: err.details });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ message: 'Validation error', details: err.errors });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: 'Duplicate key error', details: err.keyValue });
  }

  // Fallback
  res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;
