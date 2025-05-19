const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    default: '',
    trim: true
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add this to help debug index issues
userSchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    console.log('Duplicate key error:', error);
    next(new Error('Username or User ID already exists'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 