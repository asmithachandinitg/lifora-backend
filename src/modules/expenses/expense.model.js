const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['expense', 'income'], required: true },
  amount:   { type: Number, required: true },
  category: { type: String, required: true },
  account:  { type: String, default: '' },
  note:     { type: String, default: '' },
  datetime: { type: Date,   required: true },

  // ── Travel link: set when this expense was created from a trip ──
  tripExpRef: {
    type:    String,   // matches the string _id used in trip.expenses[]
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
