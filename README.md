# ⛏️ MineCraft Social Network

A full-stack social network application for Minecraft players to connect, share builds, achievements, and gaming experiences!

![Minecraft Social](https://img.shields.io/badge/Minecraft-Social-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 👤 User Management
- **User Registration & Authentication** - Secure JWT-based authentication
- **Profile Customization** - Add Minecraft username, bio, favorite servers, and playstyle
- **Pixelated Avatars** - Minecraft-style profile pictures

### 📝 Social Features
- **Create Posts** - Share builds, achievements, tutorials, memes, and more
- **Post Categories** - Organize content (Build, Achievement, Tutorial, Meme, Server, General)
- **Image Sharing** - Add images to your posts
- **Like System** - Like/unlike posts from other players
- **Comments** - Comment on posts and engage in discussions
- **Real-time Feed** - View posts from all players

### 👥 Friend System
- **Send Friend Requests** - Connect with other Minecraft players
- **Accept/Reject Requests** - Manage incoming friend requests
- **Friend Management** - View and remove friends
- **Player Discovery** - Browse all registered players

### 🎨 Minecraft-Themed UI
- **Blocky Design** - Authentic Minecraft-inspired interface
- **Minecraft Color Palette** - Grass green, dirt brown, stone gray
- **Pixelated Graphics** - Retro gaming aesthetic
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **date-fns** - Date formatting

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workspace
```

### 2. Install Dependencies

Install both backend and frontend dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minecraft-social
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` to a random, secure string in production!

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Linux/Mac:**
```bash
sudo systemctl start mongod
# or
mongod
```

**Windows:**
- MongoDB should start automatically as a service
- Or run `mongod.exe` from the installation directory

### 5. Run the Application

#### Option A: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Usage Guide

### Getting Started

1. **Register an Account**
   - Click "Register" in the navigation
   - Enter username, email, password
   - Optionally add your Minecraft username
   - Click "Register"

2. **Complete Your Profile**
   - Click "Profile" in the navigation
   - Click "Edit Profile"
   - Add bio, favorite server, and playstyle
   - Save changes

3. **Create Your First Post**
   - Go to the Home page
   - Use the "Create a Post" form
   - Add text content and optionally an image URL
   - Select a category
   - Click "Post"

4. **Connect with Players**
   - Click "Players" in the navigation
   - Browse available players
   - Click "Add Friend" to send a request
   - Accept incoming requests from the notification area

5. **Engage with Content**
   - Like posts by clicking the ❤️ button
   - Comment on posts by clicking the 💬 button
   - View player profiles by clicking their username
   - Delete your own posts with the 🗑️ button

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile (authenticated)
- `GET /api/users/search/:query` - Search users

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (authenticated)
- `GET /api/posts/user/:userId` - Get posts by user
- `PUT /api/posts/like/:id` - Like/unlike post (authenticated)
- `POST /api/posts/comment/:id` - Comment on post (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)

### Friends
- `POST /api/friends/request/:id` - Send friend request (authenticated)
- `POST /api/friends/accept/:id` - Accept friend request (authenticated)
- `POST /api/friends/reject/:id` - Reject friend request (authenticated)
- `DELETE /api/friends/:id` - Remove friend (authenticated)
- `GET /api/friends/requests` - Get friend requests (authenticated)

## 📁 Project Structure

```
minecraft-social-network/
├── backend/
│   ├── models/           # Database models
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── friends.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── CreatePost.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Users.jsx
│   │   ├── context/      # React context
│   │   │   └── AuthContext.js
│   │   ├── utils/        # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎮 Post Categories

- **Build** - Showcase your amazing constructions
- **Achievement** - Share your gaming accomplishments
- **Tutorial** - Teach others how to do something
- **Meme** - Share Minecraft humor
- **Server** - Promote or discuss servers
- **General** - Everything else

## 🎨 Customization

### Changing Colors

Edit `/frontend/src/index.css` to customize the Minecraft color theme:

```css
:root {
  --minecraft-green: #7fc800;
  --minecraft-brown: #8b4513;
  --minecraft-stone: #7f7f7f;
  /* Add more custom colors */
}
```

### Adding New Features

1. **Backend**: Add new routes in `/backend/routes/`
2. **Database**: Create models in `/backend/models/`
3. **Frontend**: Add components in `/frontend/src/components/`

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running: `sudo systemctl start mongod`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in `.env` or kill the process using the port

### JWT Token Issues
```
Error: Token is not valid
```
**Solution:** Log out and log back in to get a fresh token

### Frontend Can't Connect to Backend
**Solution:** Make sure backend is running on port 5000 and frontend proxy is configured in `vite.config.js`

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud database)
3. Set `NODE_ENV=production`
4. Deploy the backend

### Frontend Deployment (Vercel, Netlify)

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `frontend/dist` folder
3. Update API URLs in frontend code to point to your deployed backend

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Minecraft™ is a trademark of Mojang Studios
- This is a fan-made project not affiliated with Mojang or Microsoft
- Avatars provided by [Crafatar](https://crafatar.com/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Happy Mining! ⛏️** Enjoy connecting with fellow Minecraft players!
