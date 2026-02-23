const Goal = require('./goal.model');

// GET all goals for logged-in user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create goal
exports.createGoal = async (req, res) => {
  try {
    const { title, description, category, priority, status, progress, deadline, milestones } = req.body;

    const goal = await Goal.create({
      userId: req.user.id,
      title,
      description,
      category,
      priority,
      status: status || 'not-started',
      progress: progress || 0,
      deadline,
      milestones: milestones || []
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update goal
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, category, priority, status, progress, deadline, milestones } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, category, priority, status, progress, deadline, milestones },
      { new: true, runValidators: true }
    );

    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH toggle a single milestone's completed state
exports.toggleMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.completed = !milestone.completed;

    // Auto-recalculate progress based on milestones
    if (goal.milestones.length > 0) {
      const done = goal.milestones.filter(m => m.completed).length;
      goal.progress = Math.round((done / goal.milestones.length) * 100);
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
