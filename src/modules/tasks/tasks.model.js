const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date
    },
    priority: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    reminderEnabled: {
      type: Boolean,
      default: false
    },
    reminderTime: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
