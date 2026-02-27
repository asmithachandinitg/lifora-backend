const Habit = require('./habit.model');

// ── Helper: completion rate (last 30 days) ─────────────────
function calcCompletionRate(habit) {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const start = new Date(Math.max(
    new Date(habit.createdAt).getTime(),
    thirtyDaysAgo.getTime()
  ));

  const startStr = start.toISOString().split('T')[0];
  const days = Math.ceil((today - start) / (1000 * 60 * 60 * 24)) || 1;
  const completed = (habit.completions || []).filter(
    c => c.completed && c.date >= startStr
  ).length;

  return Math.round((completed / days) * 100);
}

// ── Helper: current streak ─────────────────────────────────
function calcCurrentStreak(habit) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const comp = habit.completions.find(c => c.date === dateStr && c.completed);
    if (comp) {
      streak++;
    } else if (i > 0) {
      break; // allow today to be unmarked
    }
  }
  return streak;
}

// ── GET all habits ─────────────────────────────────────────
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST create habit ──────────────────────────────────────
exports.createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, userId: req.user.id });
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── PUT update habit ───────────────────────────────────────
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Not found' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── DELETE habit ───────────────────────────────────────────
exports.deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST toggle log for a date ─────────────────────────────
exports.logCompletion = async (req, res) => {
  try {
    const { date, completed, note } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    // Update existing or push new completion
    const idx = habit.completions.findIndex(c => c.date === date);
    if (idx > -1) {
      habit.completions[idx].completed = completed;
      habit.completions[idx].note = note || '';
    } else {
      habit.completions.push({ date, completed, note: note || '' });
    }

    // Recalculate streaks
    habit.currentStreak = calcCurrentStreak(habit);
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};