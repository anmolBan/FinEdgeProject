const {
  createBudgetController,
  getAllBudgetsController,
  getBudgetByIdController,
  updateBudgetController,
  deleteBudgetController,
} = require('../src/controllers/budgetController');

jest.mock('../src/services/budgetServices', () => ({
  createBudget: jest.fn(),
  getAllBudgets: jest.fn(),
  getBudgetById: jest.fn(),
  updateBudget: jest.fn(),
  deleteBudget: jest.fn(),
}));

const {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../src/services/budgetServices');

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

describe('BudgetController', () => {
  test('createBudgetController attaches user from req.user', async () => {
    const req = {
      body: { month: 2, year: 2026, monthlyGoal: 1000, savingsTarget: 300 },
      user: { id: 'user123' },
    };
    const res = createMockRes();
    const next = jest.fn();

    createBudget.mockResolvedValue({ id: 'b1' });

    await createBudgetController(req, res, next);

    expect(createBudget).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'user123' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('getAllBudgetsController filters by user', async () => {
    const req = { user: { id: 'user123' } };
    const res = createMockRes();
    const next = jest.fn();

    getAllBudgets.mockResolvedValue([]);

    await getAllBudgetsController(req, res, next);

    expect(getAllBudgets).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('getBudgetByIdController passes 404 error when not found', async () => {
    const req = { params: { id: 'b1' } };
    const res = createMockRes();
    const next = jest.fn();

    getBudgetById.mockResolvedValue(null);

    await getBudgetByIdController(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(404);
  });

  test('deleteBudgetController sends 204 on success', async () => {
    const req = { params: { id: 'b1' } };
    const res = createMockRes();
    const next = jest.fn();

    deleteBudget.mockResolvedValue(true);

    await deleteBudgetController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
