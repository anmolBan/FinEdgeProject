const { ZodError } = require('zod');
const errorHandler = require('../src/middleware/errorHandler');

describe('errorHandler middleware', () => {
  function createMockRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  const req = { originalUrl: '/test', method: 'GET' };

  test('handles explicit statusCode errors', () => {
    const err = new Error('Bad request');
    err.statusCode = 400;
    err.details = { field: 'value' };

    const res = createMockRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Bad request',
        details: { field: 'value' },
      })
    );
  });

  test('handles Zod validation errors', () => {
    const zErr = new ZodError([]);
    zErr.errors = [
      {
        code: 'too_small',
        minimum: 2,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Too short',
        path: ['body', 'name'],
      },
    ];

    const res = createMockRes();
    const next = jest.fn();

    errorHandler(zErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        errorType: 'ZodValidationError',
      })
    );
  });

  test('fallback returns 500 for generic errors', () => {
    const err = new Error('Something went wrong');

    const res = createMockRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        errorType: 'InternalServerError',
      })
    );
  });
});
