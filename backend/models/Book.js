const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 1000 && value <= new Date().getFullYear();
      },
      message: props => `${props.value} is not a valid year!`
    }
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value) {
        // Basic ISBN validation (supports both ISBN-10 and ISBN-13)
        return /^(?:\d{10}|\d{13})$/.test(value.replace(/-/g, ''));
      },
      message: props => `${props.value} is not a valid ISBN!`
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema); 