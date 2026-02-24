const Workout = require('./fitness.model');

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const { title, category, duration, caloriesBurned, exercises, notes, date } = req.body;
    const workout = await Workout.create({
      userId: req.user.id,
      title, category, duration,
      caloriesBurned: caloriesBurned || 0,
      exercises: exercises || [],
      notes: notes || '',
      date
    });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { title, category, duration, caloriesBurned, exercises, notes, date } = req.body;
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, category, duration, caloriesBurned, exercises, notes, date },
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Personal Records - computed from all workouts
exports.getPersonalRecords = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    const prMap = {};

    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (!ex.name) return;
        const key = ex.name.toLowerCase();
        ex.sets.forEach(set => {
          if (!prMap[key] ||
            (set.weight && set.weight > (prMap[key].maxWeight || 0)) ||
            (!set.weight && set.reps > prMap[key].maxReps)) {
            prMap[key] = {
              exerciseName: ex.name,
              maxWeight: set.weight || 0,
              maxReps: set.reps,
              date: workout.date
            };
          }
        });
      });
    });

    res.json(Object.values(prMap).sort((a, b) => a.exerciseName.localeCompare(b.exerciseName)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
