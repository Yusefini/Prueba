const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, serverId } = req.query;
    const skip = (page - 1) * limit;

    const where = serverId ? { serverId } : {};

    const posts = await prisma.post.findMany({
      where,
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

    const total = await prisma.post.count({ where });

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
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create post
router.post('/', auth, [
  body('content').isLength({ min: 1, max: 2000 }),
  body('serverId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, imageUrl, serverId } = req.body;
    const userId = req.user.id;

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: userId,
        serverId: serverId || null
      },
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
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                minecraftUsername: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                minecraftUsername: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: id
          }
        }
      });
      res.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId: id
        }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add comment
router.post('/:id/comments', auth, [
  body('content').isLength({ min: 1, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: id
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;