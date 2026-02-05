const mongoose = require('mongoose');
const Budget = require('../src/models/budgetModel');

describe('Budget Model', () => {
  test('is valid with correct fields', () => {
    const budget = new Budget({
      user: new mongoose.Types.ObjectId(),
      month: 2,
      year: 2026,
      monthlyGoal: 1000,
      savingsTarget: 300,
    });

    const error = budget.validateSync();
    expect(error).toBeUndefined();
  });

  test('fails validation when month is out of range', () => {
    const budget = new Budget({
      user: new mongoose.Types.ObjectId(),
      month: 13,
      year: 2026,
      monthlyGoal: 1000,
      savingsTarget: 300,
    });

    const error = budget.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.month).toBeDefined();
  });

  test('fails validation when required fields are missing', () => {
    const budget = new Budget({});

    const error = budget.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.user).toBeDefined();
    expect(error.errors.month).toBeDefined();
    expect(error.errors.year).toBeDefined();
  });
});
