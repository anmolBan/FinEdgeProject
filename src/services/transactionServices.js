const Transaction = require('../models/transactionModel');

async function createTransaction(data) {
	const transaction = await Transaction.create(data);
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
	return transaction.toObject();
}

async function deleteTransaction(id) {
	const result = await Transaction.findByIdAndDelete(id);
	return result != null;
}

async function getSummary(filter = {}) {
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

	return {
		income,
		expense,
		net: income - expense,
	};
}

module.exports = {
	createTransaction,
	getAllTransactions,
	getTransactionById,
	updateTransaction,
	deleteTransaction,
	getSummary,
};

