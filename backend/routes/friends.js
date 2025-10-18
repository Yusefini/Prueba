const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/friends/request/:id
// @desc    Send friend request
// @access  Private
router.post('/request/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    if (currentUser.friends.includes(req.params.id)) {
      return res.status(400).json({ msg: 'Already friends' });
    }

    // Check if request already sent
    if (targetUser.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Friend request already sent' });
    }

    targetUser.friendRequests.push(req.user.id);
    await targetUser.save();

    res.json({ msg: 'Friend request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/friends/accept/:id
// @desc    Accept friend request
// @access  Private
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requestUser = await User.findById(req.params.id);

    if (!requestUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if friend request exists
    if (!currentUser.friendRequests.includes(req.params.id)) {
      return res.status(400).json({ msg: 'No friend request from this user' });
    }

    // Add to friends list
    currentUser.friends.push(req.params.id);
    requestUser.friends.push(req.user.id);

    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.id
    );

    await currentUser.save();
    await requestUser.save();

    res.json({ msg: 'Friend request accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/friends/reject/:id
// @desc    Reject friend request
// @access  Private
router.post('/reject/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.id
    );

    await currentUser.save();

    res.json({ msg: 'Friend request rejected' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/friends/:id
// @desc    Remove friend
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const friendUser = await User.findById(req.params.id);

    if (!friendUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    currentUser.friends = currentUser.friends.filter(
      id => id.toString() !== req.params.id
    );
    friendUser.friends = friendUser.friends.filter(
      id => id.toString() !== req.user.id
    );

    await currentUser.save();
    await friendUser.save();

    res.json({ msg: 'Friend removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/friends/requests
// @desc    Get friend requests
// @access  Private
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests', 'username minecraftUsername avatar bio');

    res.json(user.friendRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
