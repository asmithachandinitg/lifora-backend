const Food = require('./food.model');

// GET all entries
exports.getFoodEntries = async (req, res) => {
  try {
    const entries = await Food.find({ userId: req.user.id }).sort({ date: -1, time: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single entry
exports.getFoodEntry = async (req, res) => {
  try {
    const entry = await Food.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create entry
exports.createFoodEntry = async (req, res) => {
  try {
    const { date, mealType, time, items, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'At least one food item is required' });
    }

    const entry = await Food.create({
      userId: req.user.id,
      date,
      mealType,
      time,
      items,
      notes: notes || null
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update entry
exports.updateFoodEntry = async (req, res) => {
  try {
    const { date, mealType, time, items, notes } = req.body;

    const entry = await Food.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { date, mealType, time, items, notes: notes || null },
      { new: true, runValidators: true }
    );

    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE entry
exports.deleteFoodEntry = async (req, res) => {
  try {
    const entry = await Food.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
