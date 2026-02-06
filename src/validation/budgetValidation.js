const zod = require('zod');

// For POST /budgets
const createBudgetSchema = zod.object({
  body: zod.object({
    user: zod.string().length(24, 'Invalid user ID'),
    month: zod.number().int().min(1).max(12),
    year: zod.number().int().min(2000),
    monthlyGoal: zod.number().nonnegative(),
    savingsTarget: zod.number().nonnegative(),
  }),
});

// For params :id
const budgetIdSchema = zod.object({
  params: zod.object({
    id: zod.string().length(24, 'Invalid budget ID'),
  }),
});

// For PATCH /budgets/:id
const updateBudgetSchema = zod.object({
  body: zod
    .object({
      month: zod.number().int().min(1).max(12).optional(),
      year: zod.number().int().min(2000).optional(),
      monthlyGoal: zod.number().nonnegative().optional(),
      savingsTarget: zod.number().nonnegative().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

module.exports = {
  createBudgetSchema,
  budgetIdSchema,
  updateBudgetSchema,
};
