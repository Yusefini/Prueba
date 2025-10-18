import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return <div className="loading">⛏️ Loading posts...</div>;
  }

  return (
    <div className="container">
      <div className="home-grid">
        <div className="main-feed">
          <CreatePost onPostCreated={handlePostCreated} />
          {posts.length === 0 ? (
            <div className="card">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onDelete={handlePostDeleted}
                onUpdate={loadPosts}
              />
            ))
          )}
        </div>
        <div className="sidebar">
          <div className="card">
            <h3>👤 {user.username}</h3>
            <p>⛏️ {user.minecraftUsername || 'No Minecraft username'}</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              {user.bio || 'No bio yet'}
            </p>
          </div>
          <div className="card">
            <h3>📊 Stats</h3>
            <p>Friends: {user.friends?.length || 0}</p>
            <p>Posts: {posts.filter(p => p.user._id === user._id).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
