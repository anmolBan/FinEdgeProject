const express = require('express');
const {
	createTransactionController,
	getAllTransactionsController,
	getTransactionByIdController,
	updateTransactionController,
	deleteTransactionController,
	getSummaryController,
} = require('../controllers/transactionController');
const validate = require('../middleware/validator');
const {
	createTransactionSchema,
	transactionIdSchema,
	updateTransactionSchema,
} = require('../validation/transactionValidation');

const router = express.Router();

// POST /transactions - Add income/expense
router.post('/', validate(createTransactionSchema, 'body'), createTransactionController);

// GET /transactions - Fetch all transactions
router.get('/', getAllTransactionsController);

// GET /transactions/:id - View single transaction
router.get('/:id', validate(transactionIdSchema, 'params'), getTransactionByIdController);

// PATCH /transactions/:id - Update transaction
router.patch(
	'/:id',
	validate(transactionIdSchema, 'params'),
	validate(updateTransactionSchema, 'body'),
	updateTransactionController
);

// DELETE /transactions/:id - Delete transaction
router.delete('/:id', validate(transactionIdSchema, 'params'), deleteTransactionController);

// GET /summary - Fetch income-expense summary
router.get('/summary/all', getSummaryController);

module.exports = router;

