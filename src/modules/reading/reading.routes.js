const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');  
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('./reading.controller');

router.get('/',         auth, getAllBooks);     
router.get('/:id',      auth, getBookById);     
router.post('/',        auth, createBook);      
router.put('/:id',      auth, updateBook);      
router.delete('/:id',   auth, deleteBook);      

module.exports = router;