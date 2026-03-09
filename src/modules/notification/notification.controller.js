const NotificationState = require('./notification.model');

// GET /api/notifications/state
// Returns the user's dismissed and read notification IDs
exports.getState = async (req, res) => {
  try {
    const state = await NotificationState.findOne({ userId: req.user.id });
    res.json(state || { dismissed: [], read: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/read/:id
// Mark a single notification as read
exports.markRead = async (req, res) => {
  try {
    const state = await NotificationState.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { read: req.params.id } },
      { upsert: true, new: true }
    );
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/read-all
// Mark all provided IDs as read
exports.markAllRead = async (req, res) => {
  try {
    const { ids } = req.body;
    const state = await NotificationState.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { read: { $each: ids } } },
      { upsert: true, new: true }
    );
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/dismiss/:id
// Dismiss a single notification permanently
exports.dismiss = async (req, res) => {
  try {
    const state = await NotificationState.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { dismissed: req.params.id } },
      { upsert: true, new: true }
    );
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/notifications/dismiss-all
// Clear all dismissed IDs (reset)
exports.dismissAll = async (req, res) => {
  try {
    const state = await NotificationState.findOneAndUpdate(
      { userId: req.user.id },
      { dismissed: [], read: [] },
      { upsert: true, new: true }
    );
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
