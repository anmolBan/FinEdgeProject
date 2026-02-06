const {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../services/budgetServices');

async function createBudgetController(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.user && req.user.id) {
      data.user = req.user.id;
    }
    const budget = await createBudget(data);
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
}

async function getAllBudgetsController(req, res, next) {
  try {
    const filter = {};
    if (req.user && req.user.id) {
      filter.user = req.user.id;
    }
    const budgets = await getAllBudgets(filter);
    res.json(budgets);
  } catch (err) {
    next(err);
  }
}

async function getBudgetByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const budget = await getBudgetById(id);
    if (!budget) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(budget);
  } catch (err) {
    next(err);
  }
}

async function updateBudgetController(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    const budget = await updateBudget(id, updates);
    if (!budget) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(budget);
  } catch (err) {
    next(err);
  }
}

async function deleteBudgetController(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteBudget(id);
    if (!deleted) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBudgetController,
  getAllBudgetsController,
  getBudgetByIdController,
  updateBudgetController,
  deleteBudgetController,
};
