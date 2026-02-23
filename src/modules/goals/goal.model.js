const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['personal', 'career', 'health', 'finance', 'education', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  deadline: { type: Date, required: true },
  milestones: { type: [milestoneSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
