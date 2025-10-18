const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    res.json(userAchievements);
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlock achievement (admin only - for testing)
router.post('/:id/unlock', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already unlocked
    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: id
        }
      }
    });

    if (existingAchievement) {
      return res.status(400).json({ message: 'Achievement already unlocked' });
    }

    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: id
      },
      include: {
        achievement: true
      }
    });

    res.status(201).json(userAchievement);
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;