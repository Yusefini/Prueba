const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await prisma.friendship.findMany({
      where: {
        userId,
        status: 'ACCEPTED'
      },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true,
            isOnline: true,
            lastSeen: true
          }
        }
      }
    });

    res.json(friends.map(f => f.friend));
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true,
            isOnline: true,
            lastSeen: true
          }
        }
      }
    });

    res.json(requests.map(r => r.user));
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send friend request
router.post('/:id/request', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (userId === id) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId: id },
          { userId: id, friendId: userId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'Friendship already exists' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        userId,
        friendId: id,
        status: 'PENDING'
      }
    });

    res.status(201).json(friendship);
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Accept friend request
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: id,
        friendId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' }
    });

    res.json(updatedFriendship);
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject friend request
router.delete('/:id/reject', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: id,
        friendId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove friend
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId: id },
          { userId: id, friendId: userId }
        ],
        status: 'ACCEPTED'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;