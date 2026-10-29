import mongoose from 'mongoose';

const savedBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate saves
savedBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const SavedBook = mongoose.model('SavedBook', savedBookSchema);
export default SavedBook;
