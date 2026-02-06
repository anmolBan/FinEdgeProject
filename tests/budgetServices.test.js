const Budget = require('../src/models/budgetModel');
jest.mock('../src/models/budgetModel');

const {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../src/services/budgetServices');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Budget Service', () => {
  test('createBudget creates and returns plain object', async () => {
    const fake = {
      _id: '1',
      month: 2,
      year: 2026,
      monthlyGoal: 1000,
      savingsTarget: 300,
      toObject() { return this; },
    };
    Budget.create.mockResolvedValue(fake);

    const result = await createBudget({ month: 2, year: 2026, monthlyGoal: 1000, savingsTarget: 300 });

    expect(Budget.create).toHaveBeenCalled();
    expect(result).toEqual(fake);
  });

  test('getAllBudgets returns mapped plain objects', async () => {
    const docs = [
      { _id: '1', month: 2, year: 2026, toObject() { return this; } },
      { _id: '2', month: 1, year: 2026, toObject() { return this; } },
    ];
    Budget.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(docs) });

    const result = await getAllBudgets();

    expect(Budget.find).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]._id).toBe('1');
  });

  test('getBudgetById returns null when not found', async () => {
    Budget.findById.mockResolvedValue(null);

    const result = await getBudgetById('123');

    expect(result).toBeNull();
  });

  test('updateBudget returns null when not found', async () => {
    Budget.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateBudget('123', { monthlyGoal: 2000 });

    expect(result).toBeNull();
  });

  test('updateBudget returns updated budget when found', async () => {
    const updated = {
      _id: '1',
      monthlyGoal: 2000,
      toObject() { return this; },
    };
    Budget.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await updateBudget('1', { monthlyGoal: 2000 });

    expect(Budget.findByIdAndUpdate).toHaveBeenCalled();
    expect(result.monthlyGoal).toBe(2000);
  });

  test('deleteBudget returns true when something is deleted', async () => {
    Budget.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const deleted = await deleteBudget('1');

    expect(deleted).toBe(true);
  });

  test('deleteBudget returns false when nothing is deleted', async () => {
    Budget.findByIdAndDelete.mockResolvedValue(null);

    const deleted = await deleteBudget('1');

    expect(deleted).toBe(false);
  });
});
