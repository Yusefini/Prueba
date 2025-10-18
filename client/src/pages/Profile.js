import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaSave, FaTimes, FaTrophy, FaServer, FaCalendar } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    favoriteServer: '',
    minecraftUsername: ''
  });

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    if (isOwnProfile) {
      setUser(currentUser);
      setEditForm({
        bio: currentUser?.bio || '',
        favoriteServer: currentUser?.favoriteServer || '',
        minecraftUsername: currentUser?.minecraftUsername || ''
      });
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [id, currentUser, isOwnProfile]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/api/users/profile', editForm);
      setUser({ ...user, ...response.data });
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      bio: user?.bio || '',
      favoriteServer: user?.favoriteServer || '',
      minecraftUsername: user?.minecraftUsername || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-minecraft-green"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
        <p className="text-slate-400">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-minecraft p-8 mb-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="w-24 h-24 bg-minecraft-green rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">
                {user.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              {user.minecraftUsername && (
                <p className="text-lg text-slate-400">@{user.minecraftUsername}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  <span className="text-sm text-slate-400">
                    {user.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <FaCalendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="btn-minecraft flex items-center space-x-2"
                  >
                    <FaSave className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-minecraft-secondary flex items-center space-x-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-minecraft flex items-center space-x-2"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent resize-none"
                rows="4"
              />
            ) : (
              <p className="text-slate-300">
                {user.bio || 'No bio available.'}
              </p>
            )}
          </div>

          {/* Minecraft Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Minecraft Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Minecraft Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.minecraftUsername}
                    onChange={(e) => setEditForm({ ...editForm, minecraftUsername: e.target.value })}
                    placeholder="Your Minecraft username"
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                  />
                ) : (
                  <p className="text-slate-300">
                    {user.minecraftUsername || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Favorite Server
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.favoriteServer}
                    onChange={(e) => setEditForm({ ...editForm, favoriteServer: e.target.value })}
                    placeholder="Your favorite Minecraft server"
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                  />
                ) : (
                  <p className="text-slate-300">
                    {user.favoriteServer || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card-minecraft p-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <FaServer className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {user.friends?.length || 0}
          </div>
          <div className="text-slate-400">Friends</div>
        </div>

        <div className="card-minecraft p-6 text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <FaTrophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {user.achievements?.length || 0}
          </div>
          <div className="text-slate-400">Achievements</div>
        </div>

        <div className="card-minecraft p-6 text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">0</div>
          <div className="text-slate-400">Posts</div>
        </div>
      </div>

      {/* Achievements Section */}
      {user.achievements && user.achievements.length > 0 && (
        <div className="card-minecraft p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaTrophy className="w-5 h-5 mr-2 text-minecraft-green" />
            Achievements
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-slate-700 p-4 rounded-lg border-l-4 border-minecraft-green"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;