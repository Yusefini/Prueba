const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username minecraftUsername avatar');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { minecraftUsername, bio, favoriteServer, playstyle, avatar } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (minecraftUsername) user.minecraftUsername = minecraftUsername;
    if (bio !== undefined) user.bio = bio;
    if (favoriteServer !== undefined) user.favoriteServer = favoriteServer;
    if (playstyle !== undefined) user.playstyle = playstyle;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/search/:query
// @desc    Search users
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: req.params.query, $options: 'i' } },
        { minecraftUsername: { $regex: req.params.query, $options: 'i' } }
      ]
    }).select('-password').limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
