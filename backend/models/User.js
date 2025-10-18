const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  minecraftUsername: {
    type: String,
    trim: true,
    maxlength: 16
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  favoriteServer: {
    type: String,
    maxlength: 100,
    default: ''
  },
  playstyle: {
    type: String,
    enum: ['Survival', 'Creative', 'Adventure', 'Hardcore', 'Peaceful', 'Mixed', ''],
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://crafatar.com/avatars/steve'
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
