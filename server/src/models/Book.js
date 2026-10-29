import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: 250
  },
  authors: [{
    type: String,
    required: true,
    trim: true
  }],
  isbn: {
    type: String,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subjects: [{
    type: String,
    trim: true
  }],
  publisher: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number
  },
  language: {
    type: String,
    default: 'English'
  },
  coverImageUrl: {
    type: String,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  popularityCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Text index for robust search across title, authors, description, subjects, publisher
bookSchema.index({
  title: 'text',
  description: 'text',
  subjects: 'text',
  publisher: 'text'
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
