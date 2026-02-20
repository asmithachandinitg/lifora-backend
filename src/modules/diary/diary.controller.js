const Diary = require('./diary.model');

exports.createEntry = async (req, res) => {
  try {

    const {
      title,
      content,
      mood,
      entryDate
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content required'
      });
    }

    const entry = await Diary.create({

      title,
      content,
      mood,
      entryDate,
      userId: req.user.id

    });

    res.status(201).json(entry);

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.getEntries = async (req, res) => {
  try {

    const entries =
      await Diary.find({
        userId: req.user.id
      })
      .sort({ createdAt: -1 });

    res.json(entries);

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.getEntryById = async (req, res) => {
  try {

    const entry =
      await Diary.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    res.json(entry);

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.updateEntry = async (req, res) => {
  try {

    const entry =
      await Diary.findOneAndUpdate(

        {
          _id: req.params.id,
          userId: req.user.id
        },

        req.body,

        { new: true }

      );

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    res.json(entry);

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.updateEntry = async (req, res) => {
  try {

    const entry =
      await Diary.findOneAndUpdate(

        {
          _id: req.params.id,
          userId: req.user.id
        },

        req.body,

        { new: true }

      );

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    res.json(entry);

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.deleteEntry = async (req, res) => {
  try {

    const entry =
      await Diary.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    res.json({
      message: 'Entry deleted'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};
