import mongoose from 'mongoose';
import { COPY_STATUS } from '../config/constants.js';

const bookCopySchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  accessionCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  barcodeValue: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: Object.values(COPY_STATUS),
    default: COPY_STATUS.AVAILABLE
  },
  location: {
    type: String,
    trim: true,
    default: 'Main Stacks'
  }
}, {
  timestamps: true
});

const BookCopy = mongoose.model('BookCopy', bookCopySchema);
export default BookCopy;
