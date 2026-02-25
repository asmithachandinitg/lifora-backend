const { PregnancyProfile, PregnancyEntry } = require('./pregnancy.model');

// ── Profile ─────────────────────────────────────────────────

exports.getProfile = async (req, res) => {
  try {
    const profile = await PregnancyProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'No profile found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { dueDate, lmpDate } = req.body;
    const profile = await PregnancyProfile.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, dueDate, lmpDate: lmpDate || null },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Entries ──────────────────────────────────────────────────

exports.getEntries = async (req, res) => {
  try {
    const entries = await PregnancyEntry.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEntry = async (req, res) => {
  try {
    const entry = await PregnancyEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const { date, week, weight, bloodPressure, babyMovements, symptoms, mood, notes } = req.body;
    const entry = await PregnancyEntry.create({
      userId: req.user.id,
      date,
      week,
      weight: weight || null,
      bloodPressure: bloodPressure || null,
      babyMovements: babyMovements != null ? babyMovements : null,
      symptoms: symptoms || [],
      mood: mood || 3,
      notes: notes || ''
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { date, week, weight, bloodPressure, babyMovements, symptoms, mood, notes } = req.body;
    const entry = await PregnancyEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { date, week, weight, bloodPressure, babyMovements, symptoms, mood, notes },
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await PregnancyEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
