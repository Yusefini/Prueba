import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    loadUsers();
    loadFriendRequests();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.filter(u => u._id !== currentUser._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const res = await api.get('/friends/requests');
      setFriendRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      alert('Friend request sent!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await api.post(`/friends/accept/${userId}`);
      await loadFriendRequests();
      await loadUsers();
      alert('Friend request accepted!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await api.post(`/friends/reject/${userId}`);
      await loadFriendRequests();
      alert('Friend request rejected');
    } catch (err) {
      console.error(err);
    }
  };

  const isFriend = (userId) => {
    return currentUser.friends?.includes(userId);
  };

  if (loading) {
    return <div className="loading">⛏️ Loading players...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">👥 Minecraft Players</h1>

      {friendRequests.length > 0 && (
        <div className="card">
          <h2>📬 Friend Requests</h2>
          <div className="requests-grid">
            {friendRequests.map(request => (
              <div key={request._id} className="request-card">
                <img src={request.avatar || 'https://crafatar.com/avatars/steve'} alt="avatar" />
                <div className="request-info">
                  <Link to={`/profile/${request._id}`} className="request-name">
                    {request.username}
                  </Link>
                  <p>⛏️ {request.minecraftUsername}</p>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="btn btn-small btn-primary"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    className="btn btn-small btn-danger"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>🌍 All Players</h2>
        <div className="users-grid">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <img src={user.avatar || 'https://crafatar.com/avatars/steve'} alt="avatar" />
              <div className="user-info">
                <Link to={`/profile/${user._id}`} className="user-name">
                  {user.username}
                </Link>
                <p>⛏️ {user.minecraftUsername}</p>
                {user.bio && <p className="user-bio">{user.bio}</p>}
                <div className="user-stats">
                  <span>👥 {user.friends?.length || 0} friends</span>
                </div>
              </div>
              <div className="user-actions">
                {isFriend(user._id) ? (
                  <span className="friend-badge">✓ Friends</span>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="btn btn-small btn-primary"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users;
