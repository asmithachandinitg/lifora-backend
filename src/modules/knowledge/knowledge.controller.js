// src/modules/knowledge/knowledge.controller.js
const Knowledge = require('./knowledge.model');

// GET all entries for the logged-in user
const getAll = async (req, res) => {
  try {
    const entries = await Knowledge.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch knowledge entries' });
  }
};

// POST create a new entry
const create = async (req, res) => {
  try {
    const entry = new Knowledge({ ...req.body, user: req.user.id });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update an entry
const update = async (req, res) => {
  try {
    const entry = await Knowledge.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an entry
const remove = async (req, res) => {
  try {
    const entry = await Knowledge.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
};

module.exports = { getAll, create, update, remove };
