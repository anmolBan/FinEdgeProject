const zod = require('zod');

// Expect an object shaped like { body: { name, email, password } }
const createUserSchema = zod.object({
  body: zod.object({
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().email('Invalid email address'),
    password: zod.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

const signinUserSchema = zod.object({
  body: zod.object({
    email: zod.string().email('Invalid email address'),
    password: zod.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

// Expect an object shaped like { params: { id } }
const getUserByIdSchema = zod.object({
	params: zod.object({
		id: zod.string().length(24, 'Invalid user ID'),
	}),
});

module.exports = { createUserSchema, getUserByIdSchema, signinUserSchema };