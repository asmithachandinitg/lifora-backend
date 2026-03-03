const Habit = require('./habit.model');
const Goal  = require('../goals/goal.model'); // adjust path if needed

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
      break;
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

    // If this habit was created from a goal, add it to goal's linkedHabitIds
    if (habit.linkedGoalId) {
      await Goal.findOneAndUpdate(
        { _id: habit.linkedGoalId, userId: req.user.id },
        { $addToSet: { linkedHabitIds: habit._id } }
      );
    }

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
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    // Remove from goal's linkedHabitIds if linked
    if (habit.linkedGoalId) {
      await Goal.findOneAndUpdate(
        { _id: habit.linkedGoalId, userId: req.user.id },
        { $pull: { linkedHabitIds: habit._id } }
      );
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logCompletion = async (req, res) => {
  try {
    const { date, completed, note } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    const idx = habit.completions.findIndex(c => c.date === date);
    if (idx > -1) {
      habit.completions[idx].completed = completed;
      habit.completions[idx].note = note || '';
    } else {
      habit.completions.push({ date, completed, note: note || '' });
    }

    habit.currentStreak = calcCurrentStreak(habit);
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
    await habit.save();

    // ── Update linked goal's progress ──────────────────────
    if (habit.linkedGoalId) {
      const goal = await Goal.findOne({ _id: habit.linkedGoalId, userId: req.user.id });
      if (goal && goal.linkedHabitIds.length > 0) {

        const linkedHabits = await Habit.find({
          _id: { $in: goal.linkedHabitIds },
          userId: req.user.id
        });

        const today        = new Date();
        const goalStart    = new Date(goal.createdAt);
        const goalEnd      = new Date(goal.deadline);
        const totalDays    = Math.ceil((goalEnd - goalStart) / (1000 * 60 * 60 * 24)) || 1;
        const goalStartStr = goalStart.toISOString().split('T')[0];
        const todayStr     = today.toISOString().split('T')[0];

        // Start with dates where first habit was completed
        const allDates = new Set(
          linkedHabits[0].completions
            .filter(c => c.completed && c.date >= goalStartStr && c.date <= todayStr)
            .map(c => c.date)
        );

        // Intersect with every other linked habit — day counts only if ALL checked
        for (let i = 1; i < linkedHabits.length; i++) {
          const habitDates = new Set(
            linkedHabits[i].completions
              .filter(c => c.completed)
              .map(c => c.date)
          );
          for (const d of allDates) {
            if (!habitDates.has(d)) allDates.delete(d);
          }
        }

        const completedDays = allDates.size;
        const progress      = Math.min(Math.round((completedDays / totalDays) * 100), 100);
        const status        = progress === 100 ? 'completed'
                            : progress > 0    ? 'in-progress'
                            :                   'not-started';

        await Goal.findByIdAndUpdate(goal._id, { progress, status });
      }
    }
    // ──────────────────────────────────────────────────────

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
