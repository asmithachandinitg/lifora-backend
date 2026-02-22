const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: String, required: true }, // works for both default and custom categories
  limit: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// One budget per user per category
budgetSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
