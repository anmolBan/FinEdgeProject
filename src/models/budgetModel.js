const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    monthlyGoal: {
      type: Number,
      required: true,
      min: 0,
    },
    savingsTarget: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
