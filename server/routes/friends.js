const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already friends
    if (currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Check if friend request already sent
    const existingRequest = targetUser.friendRequests.find(
      req => req.from.toString() === currentUserId
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request
    targetUser.friendRequests.push({ from: currentUserId });
    await targetUser.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.post('/accept/:userId', auth, async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and remove the friend request
    const requestIndex = currentUser.friendRequests.findIndex(
      req => req.from.toString() === requesterId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: 'Friend request not found' });
    }

    currentUser.friendRequests.splice(requestIndex, 1);

    // Add each other as friends
    currentUser.friends.push(requesterId);
    requester.friends.push(currentUserId);

    await Promise.all([currentUser.save(), requester.save()]);

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject friend request
router.post('/reject/:userId', auth, async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);

    // Find and remove the friend request
    const requestIndex = currentUser.friendRequests.findIndex(
      req => req.from.toString() === requesterId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: 'Friend request not found' });
    }

    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/:userId', auth, async (req, res) => {
  try {
    const friendId = req.params.userId;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from both users' friend lists
    currentUser.friends = currentUser.friends.filter(
      id => id.toString() !== friendId
    );
    friend.friends = friend.friends.filter(
      id => id.toString() !== currentUserId
    );

    await Promise.all([currentUser.save(), friend.save()]);

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username avatar bio minecraftUsername isOnline lastSeen');

    res.json(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests.from', 'username avatar minecraftUsername');

    res.json(user.friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;