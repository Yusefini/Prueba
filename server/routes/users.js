const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        minecraftUsername: true,
        avatar: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            friends: true,
            servers: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('username').optional().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
  body('minecraftUsername').optional().isLength({ min: 3, max: 16 }),
  body('bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, minecraftUsername, bio, avatar } = req.body;
    const userId = req.user.userId;

    // Check if username is taken
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check if Minecraft username is taken
    if (minecraftUsername) {
      const existingUser = await prisma.user.findFirst({
        where: {
          minecraftUsername,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Minecraft username already taken' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(minecraftUsername && { minecraftUsername }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        username: true,
        minecraftUsername: true,
        avatar: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { minecraftUsername: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        minecraftUsername: true,
        avatar: true,
        isOnline: true,
        lastSeen: true
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { username: 'asc' }
    });

    const total = await prisma.user.count({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { minecraftUsername: { contains: q, mode: 'insensitive' } }
        ]
      }
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: { authorId: id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        },
        server: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.post.count({
      where: { authorId: id }
    });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's servers
router.get('/:id/servers', async (req, res) => {
  try {
    const { id } = req.params;

    const servers = await prisma.serverMember.findMany({
      where: { userId: id },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            description: true,
            ip: true,
            port: true,
            version: true,
            maxPlayers: true,
            isOnline: true,
            playerCount: true,
            icon: true,
            website: true,
            discord: true
          }
        }
      }
    });

    res.json(servers.map(member => ({
      ...member.server,
      role: member.role,
      joinedAt: member.joinedAt
    })));
  } catch (error) {
    console.error('Get user servers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;