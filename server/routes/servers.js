const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all servers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const servers = await prisma.server.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.server.count({ where });

    res.json({
      servers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create server
router.post('/', auth, [
  body('name').isLength({ min: 3, max: 50 }),
  body('description').optional().isLength({ max: 500 }),
  body('ip').isIP(),
  body('port').isInt({ min: 1, max: 65535 }),
  body('version').optional().isLength({ max: 20 }),
  body('maxPlayers').optional().isInt({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, ip, port, version, maxPlayers, website, discord } = req.body;
    const userId = req.user.id;

    const server = await prisma.server.create({
      data: {
        name,
        description,
        ip,
        port: parseInt(port),
        version,
        maxPlayers: parseInt(maxPlayers) || 20,
        website,
        discord
      }
    });

    // Add creator as owner
    await prisma.serverMember.create({
      data: {
        userId,
        serverId: server.id,
        role: 'OWNER'
      }
    });

    res.status(201).json(server);
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get server details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        members: {
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
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.json(server);
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Join server
router.post('/:id/join', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already a member
    const existingMember = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: id
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'Already a member of this server' });
    }

    const member = await prisma.serverMember.create({
      data: {
        userId,
        serverId: id,
        role: 'MEMBER'
      },
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
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Join server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Leave server
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const member = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: id
        }
      }
    });

    if (!member) {
      return res.status(404).json({ message: 'Not a member of this server' });
    }

    if (member.role === 'OWNER') {
      return res.status(400).json({ message: 'Owner cannot leave server' });
    }

    await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId: id
        }
      }
    });

    res.json({ message: 'Left server successfully' });
  } catch (error) {
    console.error('Leave server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;