const Transaction = require('../models/transactionModel');
const cache = require('../utils/cache');

const SUMMARY_TTL_MS = 60 * 1000; // 1 minute

async function createTransaction(data) {
	const transaction = await Transaction.create(data);
	// Invalidate cached summaries when data changes
	cache.clear();
	return transaction.toObject();
}

async function getAllTransactions(filter = {}) {
	const transactions = await Transaction.find(filter).sort({ date: -1 });
	return transactions.map((t) => t.toObject());
}

async function getTransactionById(id) {
	const transaction = await Transaction.findById(id);
	if (!transaction) return null;
	return transaction.toObject();
}

async function updateTransaction(id, updates) {
	const transaction = await Transaction.findByIdAndUpdate(id, updates, {
		new: true,
		runValidators: true,
	});
	if (!transaction) return null;
	// Data changed, invalidate cache
	cache.clear();
	return transaction.toObject();
}

async function deleteTransaction(id) {
	const result = await Transaction.findByIdAndDelete(id);
	if (result) {
		// Data changed, invalidate cache
		cache.clear();
	}
	return result != null;
}

async function getSummary(filter = {}) {
	const cacheKey = `summary:${JSON.stringify(filter || {})}`;
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const transactions = await Transaction.find(filter);
	let income = 0;
	let expense = 0;

	for (const tx of transactions) {
		if (tx.type === 'income') {
			income += tx.amount;
		} else if (tx.type === 'expense') {
			expense += tx.amount;
		}
	}

	const summary = {
		income,
		expense,
		net: income - expense,
	};

	cache.set(cacheKey, summary, SUMMARY_TTL_MS);
	return summary;
}

module.exports = {
	createTransaction,
	getAllTransactions,
	getTransactionById,
	updateTransaction,
	deleteTransaction,
	getSummary,
};

