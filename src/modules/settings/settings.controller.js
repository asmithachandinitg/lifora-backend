// Add these two functions to your existing users.controller.js

const mongoose = require('mongoose');

// ── EXPORT ALL USER DATA ──────────────────────────────────
// GET /api/users/export
const exportData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Dynamically load all module models
    const models = {
      diary:     tryRequire('../diary/diary.model'),
      tasks:     tryRequire('../tasks/tasks.model'),
      habits:    tryRequire('../habits/habits.model'),
      goals:     tryRequire('../goals/goals.model'),
      food:      tryRequire('../food/food.model'),
      fitness:   tryRequire('../fitness/fitness.model'),
      sleep:     tryRequire('../sleep/sleep.model'),
      mood:      tryRequire('../mood/mood.model'),
      medicine:  tryRequire('../medicine/medicine.model'),
      expenses:  tryRequire('../expenses/expenses.model'),
      travel:    tryRequire('../travel/travel.model'),
      reading:   tryRequire('../reading/reading.model'),
      knowledge: tryRequire('../knowledge/knowledge.model'),
      period:    tryRequire('../period/period.model'),
    };

    const data = {};

    for (const [name, Model] of Object.entries(models)) {
      if (Model) {
        try {
          data[name] = await Model.find({ user: userId }).lean();
        } catch {
          data[name] = [];
        }
      }
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Export failed' });
  }
};

// ── DELETE ACCOUNT ────────────────────────────────────────
// POST /api/users/delete-account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const User = require('../auth/user.model'); // adjust path if needed
    const bcrypt = require('bcryptjs');

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const userId = req.user.id;

    // Delete all user data across all modules
    const modelPaths = [
      '../diary/diary.model',
      '../tasks/tasks.model',
      '../habits/habits.model',
      '../goals/goals.model',
      '../food/food.model',
      '../fitness/fitness.model',
      '../sleep/sleep.model',
      '../mood/mood.model',
      '../medicine/medicine.model',
      '../expenses/expenses.model',
      '../travel/travel.model',
      '../reading/reading.model',
      '../knowledge/knowledge.model',
      '../period/period.model',
    ];

    for (const path of modelPaths) {
      const Model = tryRequire(path);
      if (Model) {
        try { await Model.deleteMany({ user: userId }); } catch {}
      }
    }

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

// Helper — won't crash if a model file doesn't exist yet
function tryRequire(path) {
  try { return require(path); } catch { return null; }
}

module.exports = { exportData, deleteAccount };
