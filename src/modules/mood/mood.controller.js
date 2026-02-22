const Mood = require('./mood.model');

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id }).sort({ datetime: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMood = async (req, res) => {
  try {
    const { mood, scale, note, datetime } = req.body;
    const entry = await Mood.create({
      userId: req.user.id,
      mood, scale, note,
      datetime: datetime || new Date()
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMood = async (req, res) => {
  try {
    await Mood.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
