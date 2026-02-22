const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  account: { type: String, default: '' },
  note: { type: String, default: '' },
  datetime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
