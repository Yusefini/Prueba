const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new post
router.post('/', auth, [
  body('content').notEmpty().isLength({ max: 1000 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      content,
      images,
      minecraftServer,
      minecraftBuild,
      tags,
      isPublic = true
    } = req.body;

    const post = new Post({
      author: req.user.id,
      content,
      images: images || [],
      minecraftServer,
      minecraftBuild,
      tags: tags || [],
      isPublic
    });

    await post.save();
    await post.populate('author', 'username avatar minecraftUsername');

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, tag } = req.query;
    const query = { isPublic: true };

    // Filter by user if specified
    if (userId) {
      query.author = userId;
    }

    // Filter by tag if specified
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar minecraftUsername')
      .populate('comments.user', 'username avatar')
      .populate('likes.user', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar minecraftUsername')
      .populate('comments.user', 'username avatar')
      .populate('likes.user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is public or user is the author
    if (!post.isPublic && post.author._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = post.likes.find(
      like => like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike the post
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Like the post
      post.likes.push({ user: req.user.id });
    }

    await post.save();
    await post.populate('likes.user', 'username');

    res.json({
      likes: post.likes,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to post
router.post('/:id/comment', auth, [
  body('content').notEmpty().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'username avatar');

    res.json(post.comments[post.comments.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending tags
router.get('/tags/trending', auth, async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;