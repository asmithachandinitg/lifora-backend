const { Medicine, DoseLog } = require('./medicine.model');

// ── Medicines ────────────────────────────────────────────────

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, reminders, stock, lowStockThreshold, notes, startDate, endDate, status } = req.body;
    const medicine = await Medicine.create({
      userId: req.user.id,
      name, dosage, frequency,
      reminders: reminders || [],
      stock: stock || 0,
      lowStockThreshold: lowStockThreshold || 5,
      notes: notes || '',
      startDate,
      endDate: endDate || null,
      status: status || 'active'
    });
    res.status(201).json(medicine);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, reminders, stock, lowStockThreshold, notes, startDate, endDate, status } = req.body;
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, dosage, frequency, reminders, stock, lowStockThreshold, notes, startDate, endDate: endDate || null, status },
      { new: true, runValidators: true }
    );
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    // Also delete associated logs
    await DoseLog.deleteMany({ medicineId: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Dose Logs ────────────────────────────────────────────────

exports.getDoseLogs = async (req, res) => {
  try {
    const logs = await DoseLog.find({ userId: req.user.id }).sort({ takenAt: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createDoseLog = async (req, res) => {
  try {
    const { medicineId, medicineName, dosage, takenAt, notes } = req.body;
    const log = await DoseLog.create({
      userId: req.user.id,
      medicineId, medicineName, dosage,
      takenAt: takenAt || new Date(),
      notes: notes || ''
    });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteDoseLog = async (req, res) => {
  try {
    const log = await DoseLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
