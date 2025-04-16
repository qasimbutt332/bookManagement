const Book = require('../models/Book');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Helper function to check if ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({ 
      message: 'Error fetching books', 
      error: error.message 
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error('Error in getBookById:', error);
    res.status(500).json({ 
      message: 'Error fetching book', 
      error: error.message 
    });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error in createBook:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'ISBN already exists',
        error: 'A book with this ISBN already exists in the database'
      });
    }
    res.status(500).json({ 
      message: 'Error creating book', 
      error: error.message 
    });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if ISBN is being changed and if it's already in use
    if (req.body.isbn && req.body.isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn: req.body.isbn });
      if (existingBook) {
        return res.status(400).json({ 
          message: 'ISBN already exists',
          error: 'A book with this ISBN already exists in the database'
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(500).json({ 
      message: 'Error updating book', 
      error: error.message 
    });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    res.status(500).json({ 
      message: 'Error deleting book', 
      error: error.message 
    });
  }
}; 