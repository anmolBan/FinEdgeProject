const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../services/transactionServices');

// Controllers expect validation middleware to already have run,
// so they can trust req.body/req.params.

async function createTransactionController(req, res, next) {
  try {
    const data = { ...req.body };
    if (data.date) {
      data.date = new Date(data.date);
    }
    const transaction = await createTransaction(data);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

async function getAllTransactionsController(req, res, next) {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function getTransactionByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const transaction = await getTransactionById(id);
    if (!transaction) {
        console.log("transaction not found for id:", id);
        const error = new Error('Transaction not found');
        error.statusCode = 404;
        return next(error);
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

async function updateTransactionController(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    const transaction = await updateTransaction(id, updates);
    if (!transaction) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

async function deleteTransactionController(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteTransaction(id);
    if (!deleted) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getSummaryController(req, res, next) {
  try {
    const summary = await getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTransactionController,
  getAllTransactionsController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
  getSummaryController,
};
