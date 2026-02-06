const { createUserController, signinUserController } = require('../src/controllers/userController');

jest.mock('../src/services/userServices', () => ({
  createUser: jest.fn(),
  signinUser: jest.fn(),
}));

const { createUser, signinUser } = require('../src/services/userServices');

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('UserController', () => {
  test('createUserController calls service on valid body', async () => {
    const req = { body: { name: 'Test', email: 'test@example.com', password: 'password123' } };
    const res = createMockRes();
    const next = jest.fn();

    createUser.mockResolvedValue({ id: '1' });

    await createUserController(req, res, next);

    expect(createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    expect(next).not.toHaveBeenCalled();
  });

  test('createUserController forwards validation errors to next', async () => {
    const req = { body: { name: '', email: 'bad-email', password: 'short' } };
    const res = createMockRes();
    const next = jest.fn();

    await createUserController(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });

  test('signinUserController calls service on valid body', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = createMockRes();
    const next = jest.fn();

    signinUser.mockResolvedValue({ token: 'fake-token' });

    await signinUserController(req, res, next);

    expect(signinUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'fake-token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('signinUserController forwards validation errors to next', async () => {
    const req = { body: { email: 'bad-email', password: 'short' } };
    const res = createMockRes();
    const next = jest.fn();

    await signinUserController(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });
});
