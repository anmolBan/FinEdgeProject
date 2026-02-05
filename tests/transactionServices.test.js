const Transaction = require('../src/models/transactionModel');
jest.mock('../src/models/transactionModel');

const cache = require('../src/utils/cache');
jest.mock('../src/utils/cache');

const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../src/services/transactionServices');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Transaction Service', () => {
  test('createTransaction invalidates cache', async () => {
    const fakeTx = {
      _id: '1',
      type: 'income',
      amount: 100,
      toObject() {
        return this;
      },
    };
    Transaction.create.mockResolvedValue(fakeTx);

    const result = await createTransaction({ type: 'income', amount: 100 });

    expect(Transaction.create).toHaveBeenCalled();
    expect(cache.clear).toHaveBeenCalled();
    expect(result).toEqual(fakeTx);
  });

  test('getAllTransactions returns plain objects sorted', async () => {
    const docs = [
      { _id: '1', amount: 50, toObject() { return this; } },
      { _id: '2', amount: 150, toObject() { return this; } },
    ];
    Transaction.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(docs) });

    const result = await getAllTransactions();

    expect(Transaction.find).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]._id).toBe('1');
  });

  test('getTransactionById returns null when not found', async () => {
    Transaction.findById.mockResolvedValue(null);

    const result = await getTransactionById('123');

    expect(result).toBeNull();
  });

  test('updateTransaction invalidates cache when updated', async () => {
    const updated = {
      _id: '1',
      amount: 200,
      toObject() { return this; },
    };
    Transaction.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await updateTransaction('1', { amount: 200 });

    expect(Transaction.findByIdAndUpdate).toHaveBeenCalled();
    expect(cache.clear).toHaveBeenCalled();
    expect(result.amount).toBe(200);
  });

  test('deleteTransaction invalidates cache when something is deleted', async () => {
    Transaction.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const deleted = await deleteTransaction('1');

    expect(deleted).toBe(true);
    expect(cache.clear).toHaveBeenCalled();
  });

  test('getSummary uses cache when available', async () => {
    cache.get.mockReturnValue({ income: 100, expense: 50, net: 50 });

    const summary = await getSummary();

    expect(cache.get).toHaveBeenCalled();
    expect(Transaction.find).not.toHaveBeenCalled();
    expect(summary).toEqual({ income: 100, expense: 50, net: 50 });
  });

  test('getSummary computes and caches when not cached', async () => {
    cache.get.mockReturnValue(null);
    const docs = [
      { type: 'income', amount: 200 },
      { type: 'expense', amount: 50 },
    ];
    Transaction.find.mockResolvedValue(docs);

    const summary = await getSummary();

    expect(Transaction.find).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
    expect(summary).toEqual({ income: 200, expense: 50, net: 150 });
  });
});
