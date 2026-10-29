import mongoose from 'mongoose';

const librarySettingSchema = new mongoose.Schema({
  loanDurationDays: {
    type: Number,
    default: 14,
    min: 1
  },
  gracePeriodDays: {
    type: Number,
    default: 0,
    min: 0
  },
  finePerDay: {
    type: Number,
    default: 5,
    min: 0
  },
  maxFine: {
    type: Number,
    default: 500,
    min: 0
  },
  maxBooksPerStudent: {
    type: Number,
    default: 4,
    min: 1
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  libraryName: {
    type: String,
    default: 'Libratech Central University Library'
  },
  contactEmail: {
    type: String,
    default: 'support@libratech.edu'
  }
}, {
  timestamps: true
});

const LibrarySetting = mongoose.model('LibrarySetting', librarySettingSchema);
export default LibrarySetting;
