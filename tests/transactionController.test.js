const {
  createTransactionController,
  getAllTransactionsController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
  getSummaryController,
} = require('../src/controllers/transactionController');

jest.mock('../src/services/transactionServices', () => ({
  createTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  getSummary: jest.fn(),
}));

const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../src/services/transactionServices');

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

describe('TransactionController', () => {
  test('createTransactionController attaches user from req.user', async () => {
    const req = {
      body: { type: 'income', category: 'salary', amount: 1000 },
      user: { id: 'user123' },
    };
    const res = createMockRes();
    const next = jest.fn();

    createTransaction.mockResolvedValue({ id: 'tx1' });

    await createTransactionController(req, res, next);

    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'user123' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('getAllTransactionsController filters by user', async () => {
    const req = { user: { id: 'user123' } };
    const res = createMockRes();
    const next = jest.fn();

    getAllTransactions.mockResolvedValue([]);

    await getAllTransactionsController(req, res, next);

    expect(getAllTransactions).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('getTransactionByIdController passes 404 error when not found', async () => {
    const req = { params: { id: 'tx1' } };
    const res = createMockRes();
    const next = jest.fn();

    getTransactionById.mockResolvedValue(null);

    await getTransactionByIdController(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(404);
  });

  test('deleteTransactionController sends 204 on success', async () => {
    const req = { params: { id: 'tx1' } };
    const res = createMockRes();
    const next = jest.fn();

    deleteTransaction.mockResolvedValue(true);

    await deleteTransactionController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('getSummaryController filters by user', async () => {
    const req = { user: { id: 'user123' } };
    const res = createMockRes();
    const next = jest.fn();

    getSummary.mockResolvedValue({ income: 100, expense: 50, net: 50 });

    await getSummaryController(req, res, next);

    expect(getSummary).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.json).toHaveBeenCalledWith({ income: 100, expense: 50, net: 50 });
  });
});
