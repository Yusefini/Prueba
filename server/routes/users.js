const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (for search)
router.get('/', auth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { minecraftUsername: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username avatar bio minecraftUsername isOnline lastSeen')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ username: 1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('friends', 'username avatar isOnline minecraftUsername');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the requesting user is friends with this user
    const isFriend = user.friends.some(friend => friend._id.toString() === req.user.id);
    const isOwnProfile = user._id.toString() === req.user.id;

    res.json({
      ...user.toObject(),
      isFriend,
      isOwnProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('bio').optional().isLength({ max: 500 }),
  body('favoriteServer').optional().isLength({ max: 100 }),
  body('minecraftUsername').optional().isLength({ min: 3, max: 16 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bio, favoriteServer, minecraftUsername } = req.body;
    const user = await User.findById(req.user.id);

    // Check if Minecraft username is already taken by another user
    if (minecraftUsername && minecraftUsername !== user.minecraftUsername) {
      const existingUser = await User.findOne({ 
        minecraftUsername, 
        _id: { $ne: req.user.id } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Minecraft username already taken' 
        });
      }
    }

    // Update user fields
    if (bio !== undefined) user.bio = bio;
    if (favoriteServer !== undefined) user.favoriteServer = favoriteServer;
    if (minecraftUsername !== undefined) user.minecraftUsername = minecraftUsername;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      bio: user.bio,
      favoriteServer: user.favoriteServer,
      minecraftUsername: user.minecraftUsername,
      avatar: user.avatar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add achievement
router.post('/achievements', auth, [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('icon').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, icon } = req.body;
    const user = await User.findById(req.user.id);

    // Check if achievement already exists
    const existingAchievement = user.achievements.find(ach => ach.name === name);
    if (existingAchievement) {
      return res.status(400).json({ message: 'Achievement already exists' });
    }

    user.achievements.push({
      name,
      description,
      icon: icon || '🏆'
    });

    await user.save();

    res.json({ message: 'Achievement added successfully', achievements: user.achievements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;