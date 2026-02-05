const { createUser, getUserById, signinUser } = require('../services/userServices');
const { createUserSchema, getUserByIdSchema, signinUserSchema } = require('../validation/userValidation');

async function createUserController(req, res, next) {
  try {
    const parsed = createUserSchema.safeParse({ body: req.body });
    if (!parsed.success) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = parsed.error.errors;
      return next(error);
    }
    const user = await createUser(parsed.data.body);
    res.status(201).json({
        message: "User created successfully"
    });
  } catch (err) {
    next(err);
  }
}

async function signinUserController(req, res, next) {
  try {
    const parsed = signinUserSchema.safeParse({ body: req.body });
    if (!parsed.success) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = parsed.error.errors;
      return next(error);
    }
    const result = await signinUser(parsed.data.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getUserByIdController(req, res, next) {
  try {
    const parsed = getUserByIdSchema.safeParse({ params: req.params });
    if (!parsed.success) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = parsed.error.errors;
      return next(error);
    }
    const user = await getUserById(parsed.data.params.id);
    if (!user) {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUserController, getUserByIdController, signinUserController };