import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import './Profile.css';

function Profile() {
  const { id } = useParams();
  const { user: currentUser, loadUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    minecraftUsername: '',
    bio: '',
    favoriteServer: '',
    playstyle: ''
  });
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser._id === id;
  const isFriend = currentUser.friends?.includes(id);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      setFormData({
        minecraftUsername: res.data.minecraftUsername || '',
        bio: res.data.bio || '',
        favoriteServer: res.data.favoriteServer || '',
        playstyle: res.data.playstyle || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await api.get(`/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      await loadProfile();
      await loadUser();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async () => {
    if (window.confirm('Remove this friend?')) {
      try {
        await api.delete(`/friends/${id}`);
        await loadUser();
        alert('Friend removed');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">⛏️ Loading profile...</div>;
  }

  if (!user) {
    return <div className="container"><div className="card">User not found</div></div>;
  }

  return (
    <div className="container">
      <div className="profile-header card">
        <div className="profile-avatar">
          <img src={user.avatar || 'https://crafatar.com/avatars/steve'} alt="avatar" />
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="minecraft-username">⛏️ {user.minecraftUsername || 'No Minecraft username'}</p>
          
          {!editing ? (
            <>
              <p className="profile-bio">{user.bio || 'No bio yet'}</p>
              {user.favoriteServer && (
                <p>🖥️ Favorite Server: {user.favoriteServer}</p>
              )}
              {user.playstyle && (
                <p>🎮 Playstyle: {user.playstyle}</p>
              )}
              <div className="profile-stats">
                <span>👥 {user.friends?.length || 0} Friends</span>
                <span>📝 {posts.length} Posts</span>
              </div>
              {isOwnProfile && (
                <button onClick={() => setEditing(true)} className="btn btn-primary">
                  Edit Profile
                </button>
              )}
              {!isOwnProfile && isFriend && (
                <button onClick={handleRemoveFriend} className="btn btn-danger">
                  Remove Friend
                </button>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <label>Minecraft Username</label>
              <input
                type="text"
                name="minecraftUsername"
                value={formData.minecraftUsername}
                onChange={handleChange}
                maxLength="16"
              />
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength="500"
              />
              <label>Favorite Server</label>
              <input
                type="text"
                name="favoriteServer"
                value={formData.favoriteServer}
                onChange={handleChange}
                maxLength="100"
              />
              <label>Playstyle</label>
              <select name="playstyle" value={formData.playstyle} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Survival">Survival</option>
                <option value="Creative">Creative</option>
                <option value="Adventure">Adventure</option>
                <option value="Hardcore">Hardcore</option>
                <option value="Peaceful">Peaceful</option>
                <option value="Mixed">Mixed</option>
              </select>
              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2>📝 Posts</h2>
        {posts.length === 0 ? (
          <div className="card">
            <p>No posts yet</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onDelete={() => setPosts(posts.filter(p => p._id !== post._id))}
              onUpdate={loadPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
