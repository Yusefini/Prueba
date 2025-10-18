const mongoose = require('mongoose');

const minecraftServerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ip: {
    type: String,
    required: true,
    trim: true
  },
  port: {
    type: Number,
    default: 25565
  },
  version: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  website: {
    type: String
  },
  discord: {
    type: String
  },
  maxPlayers: {
    type: Number,
    default: 20
  },
  onlinePlayers: {
    type: Number,
    default: 0
  },
  gameMode: {
    type: String,
    enum: ['survival', 'creative', 'adventure', 'spectator', 'hardcore'],
    default: 'survival'
  },
  serverType: {
    type: String,
    enum: ['vanilla', 'bukkit', 'spigot', 'paper', 'forge', 'fabric', 'modded'],
    default: 'vanilla'
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    playtime: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastPing: {
    type: Date,
    default: Date.now
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better search performance
minecraftServerSchema.index({ name: 1 });
minecraftServerSchema.index({ tags: 1 });
minecraftServerSchema.index({ gameMode: 1 });
minecraftServerSchema.index({ serverType: 1 });
minecraftServerSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('MinecraftServer', minecraftServerSchema);