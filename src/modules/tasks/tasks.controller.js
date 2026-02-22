const Task = require('./tasks.model');

// CREATE
exports.createTask = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('USER FROM TOKEN:', req.user);

    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    console.log('SAVED TASK:', task);

    res.status(201).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL (with optional filters)
exports.getTasks = async (req, res) => {
  try {
    const filter = { userId: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserTags = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    if (!tasks || tasks.length === 0) {
      return res.json([]); 
    }

    const allTags = tasks.flatMap(task => task.tags || []);
    const uniqueTags = [...new Set(allTags)];

    res.json(uniqueTags);

  } catch (err) {
    console.error('Tags error:', err.message); // 👈 add this
    res.status(500).json({ message: err.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tag name required' });
    }

    res.status(201).json({ name: name.trim() });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};