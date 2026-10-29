import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please provide a valid email address'
    ]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.STUDENT
  },
  studentId: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },
  department: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash passwords
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

// Exclude passwordHash from JSON transformations
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
