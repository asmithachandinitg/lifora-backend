const Reading = require('./reading.model');

// GET all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Reading.find().sort({ updatedAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single book
exports.getBookById = async (req, res) => {
  try {
    const book = await Reading.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create book
exports.createBook = async (req, res) => {
  try {
    const book = new Reading(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Reading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Reading.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};