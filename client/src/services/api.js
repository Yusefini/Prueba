import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  searchUsers: (query, page = 1, limit = 10) => 
    api.get(`/users/search?q=${query}&page=${page}&limit=${limit}`),
  getUserPosts: (id, page = 1, limit = 10) => 
    api.get(`/users/${id}/posts?page=${page}&limit=${limit}`),
  getUserServers: (id) => api.get(`/users/${id}/servers`),
};

// Posts API
export const postsAPI = {
  getPosts: (params = {}) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  likePost: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, content) => api.post(`/posts/${id}/comments`, { content }),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Servers API
export const serversAPI = {
  getServers: (params = {}) => api.get('/servers', { params }),
  getServer: (id) => api.get(`/servers/${id}`),
  createServer: (data) => api.post('/servers', data),
  joinServer: (id) => api.post(`/servers/${id}/join`),
  leaveServer: (id) => api.delete(`/servers/${id}/leave`),
};

// Friends API
export const friendsAPI = {
  getFriends: () => api.get('/friends'),
  getFriendRequests: () => api.get('/friends/requests'),
  sendFriendRequest: (id) => api.post(`/friends/${id}/request`),
  acceptFriendRequest: (id) => api.post(`/friends/${id}/accept`),
  rejectFriendRequest: (id) => api.delete(`/friends/${id}/reject`),
  removeFriend: (id) => api.delete(`/friends/${id}`),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId, page = 1, limit = 50) => 
    api.get(`/messages/${userId}?page=${page}&limit=${limit}`),
  sendMessage: (receiverId, content) => 
    api.post('/messages', { receiverId, content }),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (page = 1, limit = 20) => 
    api.get(`/notifications?page=${page}&limit=${limit}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Achievements API
export const achievementsAPI = {
  getAchievements: () => api.get('/achievements'),
  getUserAchievements: (userId) => api.get(`/achievements/user/${userId}`),
  unlockAchievement: (id) => api.post(`/achievements/${id}/unlock`),
};

// Convenience functions for common operations
export const fetchPosts = (params = {}) => postsAPI.getPosts(params).then(res => res.data);
export const fetchServers = (params = {}) => serversAPI.getServers(params).then(res => res.data);
export const fetchUser = (id) => usersAPI.getProfile(id).then(res => res.data);
export const fetchMessages = (userId, page = 1) => 
  messagesAPI.getMessages(userId, page).then(res => res.data);

export default api;