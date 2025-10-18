const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@minecraftsocial.com' },
      update: {},
      create: {
        email: 'admin@minecraftsocial.com',
        username: 'admin',
        password: hashedPassword,
        minecraftUsername: 'AdminUser',
        bio: 'Welcome to Minecraft Social! I\'m here to help you get started.',
        isOnline: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'alex@example.com' },
      update: {},
      create: {
        email: 'alex@example.com',
        username: 'alex_builder',
        password: hashedPassword,
        minecraftUsername: 'AlexBuilder',
        bio: 'Passionate about building amazing structures in Minecraft!',
        isOnline: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        username: 'sarah_redstone',
        password: hashedPassword,
        minecraftUsername: 'SarahRedstone',
        bio: 'Redstone engineer and technical builder. Love creating complex contraptions!',
        isOnline: false
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        username: 'mike_adventurer',
        password: hashedPassword,
        minecraftUsername: 'MikeAdventurer',
        bio: 'Always exploring new biomes and discovering hidden treasures!',
        isOnline: true
      }
    })
  ]);

  console.log('✅ Created users');

  // Create sample servers
  const servers = await Promise.all([
    prisma.server.create({
      data: {
        name: 'Creative Paradise',
        description: 'A creative server focused on building amazing structures. No griefing allowed!',
        ip: 'creative.paradise.com',
        port: 25565,
        version: '1.20.4',
        maxPlayers: 50,
        isOnline: true,
        playerCount: 23,
        website: 'https://creativeparadise.com',
        discord: 'https://discord.gg/creativeparadise'
      }
    }),
    prisma.server.create({
      data: {
        name: 'Survival Legends',
        description: 'Hardcore survival server with custom plugins and economy system.',
        ip: 'survival.legends.net',
        port: 25565,
        version: '1.20.3',
        maxPlayers: 100,
        isOnline: true,
        playerCount: 67,
        website: 'https://survivallegends.net'
      }
    }),
    prisma.server.create({
      data: {
        name: 'Mini Games Hub',
        description: 'Fun mini-games including Bed Wars, Sky Wars, and more!',
        ip: 'minigames.hub.org',
        port: 25565,
        version: '1.20.2',
        maxPlayers: 200,
        isOnline: false,
        playerCount: 0,
        discord: 'https://discord.gg/minigameshub'
      }
    })
  ]);

  console.log('✅ Created servers');

  // Add users to servers
  await Promise.all([
    prisma.serverMember.create({
      data: {
        userId: users[0].id,
        serverId: servers[0].id,
        role: 'OWNER'
      }
    }),
    prisma.serverMember.create({
      data: {
        userId: users[1].id,
        serverId: servers[0].id,
        role: 'ADMIN'
      }
    }),
    prisma.serverMember.create({
      data: {
        userId: users[2].id,
        serverId: servers[1].id,
        role: 'OWNER'
      }
    }),
    prisma.serverMember.create({
      data: {
        userId: users[3].id,
        serverId: servers[1].id,
        role: 'MEMBER'
      }
    })
  ]);

  console.log('✅ Added users to servers');

  // Create sample posts
  await Promise.all([
    prisma.post.create({
      data: {
        content: 'Just finished building this amazing castle! What do you think? #building #minecraft',
        authorId: users[1].id,
        serverId: servers[0].id
      }
    }),
    prisma.post.create({
      data: {
        content: 'Working on a new redstone contraption. This one is going to be epic! 🔴⚡',
        authorId: users[2].id,
        serverId: servers[1].id
      }
    }),
    prisma.post.create({
      data: {
        content: 'Found this beautiful cave system today. The natural formations are incredible!',
        authorId: users[3].id
      }
    }),
    prisma.post.create({
      data: {
        content: 'Welcome to Minecraft Social! This is the place to connect with fellow Minecraft players, share your builds, and discover amazing servers. Join us and start your journey!',
        authorId: users[0].id
      }
    })
  ]);

  console.log('✅ Created posts');

  // Create sample friendships
  await Promise.all([
    prisma.friendship.create({
      data: {
        userId: users[0].id,
        friendId: users[1].id,
        status: 'ACCEPTED'
      }
    }),
    prisma.friendship.create({
      data: {
        userId: users[1].id,
        friendId: users[2].id,
        status: 'ACCEPTED'
      }
    }),
    prisma.friendship.create({
      data: {
        userId: users[2].id,
        friendId: users[3].id,
        status: 'PENDING'
      }
    })
  ]);

  console.log('✅ Created friendships');

  // Create sample achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Post',
        description: 'Share your first post on Minecraft Social',
        icon: '📝',
        category: 'social'
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Server Explorer',
        description: 'Join your first server',
        icon: '🌐',
        category: 'server'
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Social Butterfly',
        description: 'Make 10 friends',
        icon: '👥',
        category: 'social'
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Chat Master',
        description: 'Send 100 messages',
        icon: '💬',
        category: 'communication'
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Builder Pro',
        description: 'Share 50 posts about your builds',
        icon: '🏗️',
        category: 'special'
      }
    })
  ]);

  console.log('✅ Created achievements');

  // Award some achievements to users
  await Promise.all([
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        achievementId: achievements[0].id
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[0].id
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[1].id
      }
    })
  ]);

  console.log('✅ Awarded achievements');

  // Create sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hey! Great build you shared earlier!',
        senderId: users[0].id,
        receiverId: users[1].id,
        isRead: false
      }
    }),
    prisma.message.create({
      data: {
        content: 'Thanks! I worked on it for weeks.',
        senderId: users[1].id,
        receiverId: users[0].id,
        isRead: true
      }
    }),
    prisma.message.create({
      data: {
        content: 'Want to collaborate on a project?',
        senderId: users[2].id,
        receiverId: users[3].id,
        isRead: false
      }
    })
  ]);

  console.log('✅ Created messages');

  // Create sample notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'POST_LIKE',
        title: 'Your post was liked!',
        message: 'alex_builder liked your post about the castle build.',
        data: { postId: '1', likerId: users[0].id }
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        type: 'FRIEND_REQUEST',
        title: 'New friend request',
        message: 'mike_adventurer wants to be your friend.',
        data: { requesterId: users[3].id }
      }
    })
  ]);

  console.log('✅ Created notifications');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Sample accounts created:');
  console.log('👤 admin@minecraftsocial.com / password123');
  console.log('👤 alex@example.com / password123');
  console.log('👤 sarah@example.com / password123');
  console.log('👤 mike@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });