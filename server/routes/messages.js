const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation partner
    const conversationMap = new Map();
    
    conversations.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      if (message.receiverId === userId && !message.isRead) {
        conversationMap.get(partnerId).unreadCount++;
      }
    });

    const result = Array.from(conversationMap.values());
    res.json(result);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get messages with specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUserId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message
router.post('/', auth, [
  body('receiverId').isString(),
  body('content').isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            minecraftUsername: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await prisma.message.findFirst({
      where: {
        id,
        receiverId: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;