const { Period, DailySymptom } = require('./period.model');

// ── Period entries ────────────────────────────────────────────

exports.getEntries = async (req, res) => {
  try {
    const entries = await Period.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json(entries);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEntry = async (req, res) => {
  try {
    const { startDate, endDate, flow, painLevel, mood, symptoms, notes } = req.body;

    // Auto-calc period length
    const periodLength = endDate
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1
      : null;

    // Auto-calc cycle length from previous entry
    const prev = await Period.findOne({ userId: req.user.id }).sort({ startDate: -1 });
    const cycleLength = prev
      ? Math.round((new Date(startDate) - new Date(prev.startDate)) / 86400000)
      : null;

    const entry = await Period.create({
      userId: req.user.id, startDate, endDate: endDate || null,
      flow, painLevel, mood, symptoms: symptoms || [],
      notes: notes || null, periodLength, cycleLength
    });
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateEntry = async (req, res) => {
  try {
    const { startDate, endDate, flow, painLevel, mood, symptoms, notes } = req.body;
    const periodLength = endDate
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1
      : null;
    const entry = await Period.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { startDate, endDate: endDate || null, flow, painLevel, mood,
        symptoms, notes: notes || null, periodLength },
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Period.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Daily symptom logs ────────────────────────────────────────

exports.getDailyLogs = async (req, res) => {
  try {
    const logs = await DailySymptom.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createDailyLog = async (req, res) => {
  try {
    const { date, mood, painLevel, symptoms, notes } = req.body;
    const log = await DailySymptom.create({
      userId: req.user.id, date, mood, painLevel,
      symptoms: symptoms || [], notes: notes || null
    });
    res.status(201).json(log);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Log already exists for this date' });
    res.status(500).json({ message: err.message });
  }
};

exports.updateDailyLog = async (req, res) => {
  try {
    const { date, mood, painLevel, symptoms, notes } = req.body;
    const log = await DailySymptom.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { date, mood, painLevel, symptoms, notes: notes || null },
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ message: 'Not found' });
    res.json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteDailyLog = async (req, res) => {
  try {
    const log = await DailySymptom.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
