# MinecraftSocial 🎮

A modern social network platform designed specifically for Minecraft players to connect, share experiences, and discover amazing servers.

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Profile management with Minecraft username integration

### 👥 Social Features
- Friend system with requests and management
- Real-time messaging with Socket.io
- User search and discovery
- Activity status tracking

### 📝 Content Sharing
- Create and share posts about your Minecraft adventures
- Add server information and builds to posts
- Tag system for better content discovery
- Like and comment on posts

### 🖥️ Server Discovery
- Browse and discover Minecraft servers
- Detailed server information with ratings and reviews
- Server filtering by game mode, type, and player count
- Join servers and track your favorites

### 🏆 Achievements
- Track and showcase your Minecraft achievements
- Custom achievement system
- Profile statistics and milestones

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Toastify** for notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minecraft-social-network
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/minecraft-social
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Compass/Atlas for cloud database
   ```

5. **Run the application**
   
   Start both backend and frontend in development mode:
   ```bash
   npm run dev
   ```
   
   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
minecraft-social-network/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── package.json          # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/achievements` - Add achievement

### Friends
- `POST /api/friends/request/:userId` - Send friend request
- `POST /api/friends/accept/:userId` - Accept friend request
- `POST /api/friends/reject/:userId` - Reject friend request
- `DELETE /api/friends/:userId` - Remove friend
- `GET /api/friends` - Get friends list
- `GET /api/friends/requests` - Get friend requests

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get posts feed
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id` - Delete post

### Minecraft Servers
- `GET /api/minecraft/servers` - Get servers list
- `GET /api/minecraft/servers/:id` - Get server details
- `POST /api/minecraft/servers` - Create server
- `PUT /api/minecraft/servers/:id` - Update server
- `POST /api/minecraft/servers/:id/review` - Add review
- `POST /api/minecraft/servers/:id/join` - Join server

## 🎨 UI/UX Features

- **Dark Theme** - Minecraft-inspired dark color scheme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Components** - Clean, accessible UI components
- **Real-time Updates** - Live notifications and messaging
- **Smooth Animations** - Engaging micro-interactions

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting ready (can be implemented)

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster or use your preferred MongoDB hosting
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Set environment variables in your hosting platform
4. Update CORS origins for production

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy to Netlify, Vercel, or serve with your backend
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Image upload for posts and profiles
- [ ] Real-time chat system
- [ ] Minecraft server status checking
- [ ] Mobile app with React Native
- [ ] Advanced server analytics
- [ ] Group/guild system
- [ ] Event planning features
- [ ] Minecraft skin integration
- [ ] Push notifications
- [ ] Admin dashboard

## 🐛 Known Issues

- Server status checking is not implemented yet
- Image uploads need to be configured
- Real-time messaging UI needs enhancement

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Join our community Discord (coming soon)

---

**Built with ❤️ for the Minecraft community**
