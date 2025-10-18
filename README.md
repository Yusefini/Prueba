# Minecraft Social Network

A comprehensive social networking platform designed specifically for Minecraft players to connect, share their builds, discover servers, and build lasting friendships within the Minecraft community.

## 🎮 Features

### Core Social Features
- **User Profiles**: Create detailed profiles with Minecraft usernames, bios, and avatars
- **Friend System**: Add friends, send requests, and manage your social connections
- **Real-time Messaging**: Private messaging with real-time updates using Socket.io
- **Posts & Feed**: Share your Minecraft experiences, builds, and adventures
- **Comments & Likes**: Interact with posts through comments and likes

### Minecraft-Specific Features
- **Server Discovery**: Browse and join Minecraft servers with detailed information
- **Server Management**: Add your own servers with IP, version, and player count
- **Achievement System**: Unlock achievements for various activities
- **Minecraft Integration**: Link your Minecraft username to your profile

### Technical Features
- **Real-time Notifications**: Get notified about friend requests, messages, and interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, dark-themed interface with smooth animations
- **Search & Filter**: Find users, servers, and content easily
- **Image Upload**: Share screenshots of your builds and adventures

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Docker (optional)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minecraft-social-network
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Initialize the database**
   ```bash
   # Run migrations
   docker-compose exec backend npx prisma migrate dev
   
   # Seed the database
   docker-compose exec backend npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Manual Setup

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb minecraft_social
   
   # Run migrations
   cd server
   npx prisma migrate dev
   npm run seed
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## 🏗️ Project Structure

```
minecraft-social-network/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth, Socket)
│   │   ├── services/      # API service functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API route handlers
│   ├── middleware/       # Custom middleware
│   ├── prisma/          # Database schema and migrations
│   └── index.js         # Main server file
├── docker-compose.yml    # Docker configuration
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📱 Screenshots

### Home Feed
- Browse posts from friends and community
- Create new posts with images
- Like and comment on posts

### Server Discovery
- Browse available Minecraft servers
- View server details, player counts, and versions
- Join servers and manage memberships

### Messaging
- Real-time private messaging
- Conversation management
- Message status indicators

### Profile & Friends
- Detailed user profiles
- Friend management system
- Achievement tracking

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/minecraft_social?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### Frontend (.env)
```env
REACT_APP_API_URL="http://localhost:5000/api"
REACT_APP_SOCKET_URL="http://localhost:5000"
```

## 🧪 Testing

### Sample Accounts
The seed script creates several test accounts:
- **admin@minecraftsocial.com** / password123
- **alex@example.com** / password123  
- **sarah@example.com** / password123
- **mike@example.com** / password123

### API Testing
The backend provides a RESTful API with the following endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `GET /api/servers` - Get servers list
- `POST /api/servers` - Add new server
- `GET /api/friends` - Get friends list
- `POST /api/friends/:id/request` - Send friend request
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message

## 🚀 Deployment

### Production Deployment

1. **Set up production environment variables**
2. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```
3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-specific Docker Compose

Create `docker-compose.prod.yml` for production with:
- Environment variables for production
- Volume mounts for persistent data
- Health checks
- Resource limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Minecraft community for inspiration
- All the amazing open-source libraries used
- Contributors and testers

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Happy Mining and Socializing! 🎮✨**
