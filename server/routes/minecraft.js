const express = require('express');
const { body, validationResult } = require('express-validator');
const MinecraftServer = require('../models/MinecraftServer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all servers
router.get('/servers', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      gameMode, 
      serverType, 
      sortBy = 'rating' 
    } = req.query;
    
    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } }
      ];
    }

    // Game mode filter
    if (gameMode) {
      query.gameMode = gameMode;
    }

    // Server type filter
    if (serverType) {
      query.serverType = serverType;
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'players':
        sort = { onlinePlayers: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { 'rating.average': -1 };
    }

    const servers = await MinecraftServer.find(query)
      .populate('owner', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MinecraftServer.countDocuments(query);

    res.json({
      servers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single server
router.get('/servers/:id', auth, async (req, res) => {
  try {
    const server = await MinecraftServer.findById(req.params.id)
      .populate('owner', 'username avatar minecraftUsername')
      .populate('moderators', 'username avatar')
      .populate('players.user', 'username avatar')
      .populate('reviews.user', 'username avatar');

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new server
router.post('/servers', auth, [
  body('name').notEmpty().trim(),
  body('ip').notEmpty().trim(),
  body('version').notEmpty().trim(),
  body('description').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      ip,
      port = 25565,
      version,
      description,
      website,
      discord,
      maxPlayers = 20,
      gameMode = 'survival',
      serverType = 'vanilla',
      tags = []
    } = req.body;

    // Check if server with same IP already exists
    const existingServer = await MinecraftServer.findOne({ ip, port });
    if (existingServer) {
      return res.status(400).json({ message: 'Server with this IP already exists' });
    }

    const server = new MinecraftServer({
      name,
      ip,
      port,
      version,
      description,
      website,
      discord,
      maxPlayers,
      gameMode,
      serverType,
      tags: tags.map(tag => tag.toLowerCase()),
      owner: req.user.id
    });

    await server.save();
    await server.populate('owner', 'username avatar');

    res.status(201).json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update server
router.put('/servers/:id', auth, async (req, res) => {
  try {
    const server = await MinecraftServer.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user is owner or moderator
    const isOwner = server.owner.toString() === req.user.id;
    const isModerator = server.moderators.includes(req.user.id);

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      name,
      description,
      website,
      discord,
      maxPlayers,
      gameMode,
      serverType,
      tags
    } = req.body;

    // Update allowed fields
    if (name) server.name = name;
    if (description !== undefined) server.description = description;
    if (website !== undefined) server.website = website;
    if (discord !== undefined) server.discord = discord;
    if (maxPlayers) server.maxPlayers = maxPlayers;
    if (gameMode) server.gameMode = gameMode;
    if (serverType) server.serverType = serverType;
    if (tags) server.tags = tags.map(tag => tag.toLowerCase());

    await server.save();
    await server.populate('owner', 'username avatar');

    res.json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add server review
router.post('/servers/:id/review', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const server = await MinecraftServer.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user already reviewed this server
    const existingReview = server.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this server' });
    }

    const { rating, comment } = req.body;

    server.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = server.reviews.reduce((sum, review) => sum + review.rating, 0);
    server.rating.average = totalRating / server.reviews.length;
    server.rating.count = server.reviews.length;

    await server.save();
    await server.populate('reviews.user', 'username avatar');

    res.json(server.reviews[server.reviews.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join server (add to player list)
router.post('/servers/:id/join', auth, async (req, res) => {
  try {
    const server = await MinecraftServer.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user is already in the server
    const existingPlayer = server.players.find(
      player => player.user.toString() === req.user.id
    );

    if (existingPlayer) {
      return res.status(400).json({ message: 'Already joined this server' });
    }

    server.players.push({ user: req.user.id });
    await server.save();

    res.json({ message: 'Successfully joined server' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;