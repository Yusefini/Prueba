import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUserFriends, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends');
      setFriends(response.data);
    } catch (error) {
      toast.error('Failed to load friends');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('/api/friends/requests');
      setFriendRequests(response.data);
    } catch (error) {
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await axios.get(`/api/users?search=${searchQuery}`);
      setSearchResults(response.data.users);
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`/api/friends/request/${userId}`);
      toast.success('Friend request sent!');
      setSearchResults(searchResults.map(user => 
        user._id === userId ? { ...user, requestSent: true } : user
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (userId) => {
    try {
      await axios.post(`/api/friends/accept/${userId}`);
      toast.success('Friend request accepted!');
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const rejectFriendRequest = async (userId) => {
    try {
      await axios.post(`/api/friends/reject/${userId}`);
      toast.success('Friend request rejected');
      fetchFriendRequests();
    } catch (error) {
      toast.error('Failed to reject friend request');
    }
  };

  const removeFriend = async (userId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await axios.delete(`/api/friends/${userId}`);
        toast.success('Friend removed');
        fetchFriends();
      } catch (error) {
        toast.error('Failed to remove friend');
      }
    }
  };

  const UserCard = ({ user, showActions = false, isRequest = false }) => (
    <div className="card-minecraft p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-minecraft-green rounded-full flex items-center justify-center">
          <span className="text-slate-900 font-semibold">
            {user.username[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{user.username}</h3>
          {user.minecraftUsername && (
            <p className="text-sm text-slate-400">@{user.minecraftUsername}</p>
          )}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-slate-500'}`}></div>
            <span className="text-xs text-slate-500">
              {user.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex space-x-2">
          {isRequest ? (
            <>
              <button
                onClick={() => acceptFriendRequest(user.from._id)}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="Accept"
              >
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => rejectFriendRequest(user.from._id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                title="Reject"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </>
          ) : user.requestSent ? (
            <span className="text-sm text-slate-400">Request sent</span>
          ) : (
            <button
              onClick={() => sendFriendRequest(user._id)}
              className="btn-minecraft flex items-center space-x-2"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
          )}
        </div>
      )}

      {activeTab === 'friends' && (
        <button
          onClick={() => removeFriend(user._id)}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Remove friend"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-minecraft-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Friends</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'friends', label: 'Friends', count: friends.length },
          { id: 'requests', label: 'Requests', count: friendRequests.length },
          { id: 'search', label: 'Find Friends', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-minecraft-green text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 px-2 py-1 bg-slate-600 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'friends' && (
          <div>
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUserFriends className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No friends yet</h3>
                <p className="text-slate-400 mb-4">Start connecting with other Minecraft players!</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="btn-minecraft"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {friends.map(friend => (
                  <UserCard key={friend._id} user={friend} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            {friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUserPlus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No friend requests</h3>
                <p className="text-slate-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {friendRequests.map(request => (
                  <UserCard 
                    key={request._id} 
                    user={request} 
                    showActions={true} 
                    isRequest={true} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users by username or Minecraft username..."
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
              />
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults.map(user => (
                <UserCard key={user._id} user={user} showActions={true} />
              ))}
              
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No users found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;