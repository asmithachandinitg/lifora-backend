const mongoose = require('mongoose');

const notificationStateSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dismissed: { type: [String], default: [] },   // notification IDs dismissed permanently
  read:      { type: [String], default: [] },    // notification IDs marked as read
}, { timestamps: true });

module.exports = mongoose.model('NotificationState', notificationStateSchema);
