const Sleep = require('./sleep.model');

// GET all sleep entries for logged-in user
exports.getSleepEntries = async (req, res) => {
  try {
    const entries = await Sleep.find({ userId: req.user.id }).sort({ sleepTime: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single entry
exports.getSleepEntry = async (req, res) => {
  try {
    const entry = await Sleep.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create entry
exports.createSleepEntry = async (req, res) => {
  try {
    const { sleepTime, wakeTime, quality, stages, notes } = req.body;

    // Auto-calculate duration in minutes
    const duration = Math.round(
      (new Date(wakeTime).getTime() - new Date(sleepTime).getTime()) / 60000
    );

    if (duration <= 0) {
      return res.status(400).json({ message: 'Wake time must be after sleep time' });
    }

    const entry = await Sleep.create({
      userId: req.user.id,
      sleepTime,
      wakeTime,
      duration,
      quality,
      stages: stages || { deep: 0, light: 0, rem: 0 },
      notes: notes || ''
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update entry
exports.updateSleepEntry = async (req, res) => {
  try {
    const { sleepTime, wakeTime, quality, stages, notes } = req.body;

    const duration = Math.round(
      (new Date(wakeTime).getTime() - new Date(sleepTime).getTime()) / 60000
    );

    if (duration <= 0) {
      return res.status(400).json({ message: 'Wake time must be after sleep time' });
    }

    const entry = await Sleep.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { sleepTime, wakeTime, duration, quality, stages, notes },
      { new: true, runValidators: true }
    );

    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE entry
exports.deleteSleepEntry = async (req, res) => {
  try {
    const entry = await Sleep.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
