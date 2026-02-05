const zod = require('zod');

// For POST /transactions
const createTransactionSchema = zod.object({
  body: zod.object({
    user: zod.string().length(24, 'Invalid user ID'),
    type: zod.enum(['income', 'expense']),
    category: zod.string().min(1, 'Category is required'),
    amount: zod.number().positive('Amount must be positive'),
    date: zod.string().optional(), // ISO string; will be converted to Date
    note: zod.string().optional(),
  }),
});

// For params :id
const transactionIdSchema = zod.object({
  params: zod.object({
    id: zod.string().length(24, 'Invalid transaction ID'),
  }),
});

// For PATCH /transactions/:id
const updateTransactionSchema = zod.object({
  body: zod
    .object({
      type: zod.enum(['income', 'expense']).optional(),
      category: zod.string().min(1, 'Category is required').optional(),
      amount: zod.number().positive('Amount must be positive').optional(),
      date: zod.string().optional(),
      note: zod.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

module.exports = {
  createTransactionSchema,
  transactionIdSchema,
  updateTransactionSchema,
};
