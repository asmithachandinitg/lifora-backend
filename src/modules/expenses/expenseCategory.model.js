const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📦' },
  type: { type: String, enum: ['expense', 'income'], required: true },
  budget: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ExpenseCategory', categorySchema);
