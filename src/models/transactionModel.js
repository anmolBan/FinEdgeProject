const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['income', 'expense'],
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		note: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

