const Reading = require('./reading.model');

// GET all books FOR CURRENT USER
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Reading.find({ userId: req.user.id }).sort({ updatedAt: -1 });  // ← FILTER BY USER
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
    
    // Check if user owns this book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create book
exports.createBook = async (req, res) => {
  try {
    const book = new Reading({
      ...req.body,
      userId: req.user.id  // ← SET USER ID
    });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Reading.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Check if user owns this book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updated = await Reading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Reading.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Check if user owns this book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Reading.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};