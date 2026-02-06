const zod = require('zod');
const validate = require('../src/middleware/validator');

describe('validator middleware', () => {
  test('calls next with parsed data on success', () => {
    const schema = zod.object({
      body: zod.object({ name: zod.string() }),
    });

    const middleware = validate(schema, 'body');

    const req = { body: { name: 'Alice' }, params: {}, query: {} };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.body).toEqual({ name: 'Alice' });
    expect(next).toHaveBeenCalledWith();
  });

  test('forwards Zod errors to next on failure', () => {
    const schema = zod.object({
      body: zod.object({ name: zod.string().min(2) }),
    });

    const middleware = validate(schema, 'body');

    const req = { body: { name: 'A' }, params: {}, query: {} };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(zod.ZodError);
  });
});
