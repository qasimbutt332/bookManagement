const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Validation middleware
const bookValidation = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('author').notEmpty().trim().withMessage('Author is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('publishedYear')
    .notEmpty()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Invalid published year'),
  body('isbn')
    .notEmpty()
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('Invalid ISBN format')
];

// Routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookValidation, bookController.createBook);
router.put('/:id', bookValidation, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router; 