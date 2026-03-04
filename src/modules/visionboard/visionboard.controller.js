// src/modules/visionboard/visionboard.controller.js
const VisionItem = require('./visionboard.model');

const getAll = async (req, res) => {
  try {
    const items = await VisionItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vision board' });
  }
};

const create = async (req, res) => {
  try {
    const item = new VisionItem({ ...req.body, user: req.user.id });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const item = await VisionItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const item = await VisionItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

// Mark as achieved
const markAchieved = async (req, res) => {
  try {
    const item = await VisionItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        achieved: true,
        achievedDate: new Date().toISOString().split('T')[0]
      },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};

module.exports = { getAll, create, update, remove, markAchieved };
