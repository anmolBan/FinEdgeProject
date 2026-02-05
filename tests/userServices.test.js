const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const User = require('../src/models/userModel');
jest.mock('../src/models/userModel');

const { createUser, signinUser } = require('../src/services/userServices');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Service - createUser', () => {
  test('throws error when user with email already exists', async () => {
    User.findOne.mockResolvedValue({ _id: '1', email: 'test@example.com' });

    await expect(
      createUser({ name: 'Test', email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow('User with this email already exists');
  });

  test('creates user with hashed password when email is new', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.create.mockResolvedValue({
      _id: '1',
      name: 'Test',
      email: 'test@example.com',
      password: 'hashedPassword',
      toObject() {
        return this;
      },
    });

    const result = await createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalled();
    expect(result.password).toBe('hashedPassword');
  });
});

describe('User Service - signinUser', () => {
  test('throws error when user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      signinUser({ email: 'missing@example.com', password: 'password123' })
    ).rejects.toThrow('User with this email does not exist');
  });

  test('throws error when password is invalid', async () => {
    User.findOne.mockResolvedValue({
      _id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      signinUser({ email: 'test@example.com', password: 'wrong' })
    ).rejects.toThrow('Invalid password');
  });

  test('returns token when credentials are valid', async () => {
    User.findOne.mockResolvedValue({
      _id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt-token');

    const result = await signinUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual({ token: 'fake-jwt-token' });
  });
});
