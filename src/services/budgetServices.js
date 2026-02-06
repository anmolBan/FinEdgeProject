const Budget = require('../models/budgetModel');

async function createBudget(data) {
  const budget = await Budget.create(data);
  return budget.toObject();
}

async function getAllBudgets(filter = {}) {
  const budgets = await Budget.find(filter).sort({ year: -1, month: -1 });
  return budgets.map((b) => b.toObject());
}

async function getBudgetById(id) {
  const budget = await Budget.findById(id);
  if (!budget) return null;
  return budget.toObject();
}

async function updateBudget(id, updates) {
  const budget = await Budget.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!budget) return null;
  return budget.toObject();
}

async function deleteBudget(id) {
  const result = await Budget.findByIdAndDelete(id);
  return result != null;
}

module.exports = {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
