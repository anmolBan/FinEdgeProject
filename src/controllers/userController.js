const { createUser, getUserById, signinUser } = require('../services/userServices');
const { createUserSchema, getUserByIdSchema, signinUserSchema } = require('../validation/userValidation');

async function createUserController(req, res, next) {
  try {
    const parsed = createUserSchema.safeParse({ body: req.body });
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
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
      return res.status(400).json({ errors: parsed.error.errors });
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
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const user = await getUserById(parsed.data.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUserController, getUserByIdController, signinUserController };