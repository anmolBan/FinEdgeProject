const express = require('express');
const {
  createBudgetController,
  getAllBudgetsController,
  getBudgetByIdController,
  updateBudgetController,
  deleteBudgetController,
} = require('../controllers/budgetController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {
  createBudgetSchema,
  budgetIdSchema,
  updateBudgetSchema,
} = require('../validation/budgetValidation');

const router = express.Router();

// Protect all budget routes with authentication
router.use(auth);

// POST /budgets - Create a new budget
router.post('/', validate(createBudgetSchema, 'body'), createBudgetController);

// GET /budgets - Fetch all budgets for the authenticated user
router.get('/', getAllBudgetsController);

// GET /budgets/:id - View a specific budget
router.get('/:id', validate(budgetIdSchema, 'params'), getBudgetByIdController);

// PATCH /budgets/:id - Update a budget
router.patch(
  '/:id',
  validate(budgetIdSchema, 'params'),
  validate(updateBudgetSchema, 'body'),
  updateBudgetController
);

// DELETE /budgets/:id - Remove a budget
router.delete('/:id', validate(budgetIdSchema, 'params'), deleteBudgetController);

module.exports = router;
