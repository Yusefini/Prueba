import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaComment, FaShare, FaPlus, FaImage, FaServer } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    tags: '',
    minecraftServer: {
      name: '',
      ip: ''
    }
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data.posts);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      const postData = {
        content: newPost.content,
        tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [],
        minecraftServer: newPost.minecraftServer.name ? newPost.minecraftServer : undefined
      };

      const response = await axios.post('/api/posts', postData);
      setPosts([response.data, ...posts]);
      setNewPost({ content: '', tags: '', minecraftServer: { name: '', ip: '' } });
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.likes }
          : post
      ));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const PostCard = ({ post }) => (
    <div className="card-minecraft p-6 mb-6">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-minecraft-green rounded-full flex items-center justify-center mr-3">
          <span className="text-slate-900 font-semibold">
            {post.author.username[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{post.author.username}</h3>
          {post.author.minecraftUsername && (
            <p className="text-sm text-slate-400">@{post.author.minecraftUsername}</p>
          )}
          <p className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-slate-200 whitespace-pre-wrap">{post.content}</p>
        
        {/* Minecraft Server Info */}
        {post.minecraftServer && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg border-l-4 border-minecraft-green">
            <div className="flex items-center text-minecraft-green mb-1">
              <FaServer className="w-4 h-4 mr-2" />
              <span className="font-semibold">Server: {post.minecraftServer.name}</span>
            </div>
            <p className="text-slate-300 text-sm">IP: {post.minecraftServer.ip}</p>
            {post.minecraftServer.version && (
              <p className="text-slate-400 text-xs">Version: {post.minecraftServer.version}</p>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700 text-minecraft-green text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <button
          onClick={() => handleLike(post._id)}
          className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <FaHeart className="w-5 h-5" />
          <span>{post.likes?.length || 0}</span>
        </button>
        
        <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors">
          <FaComment className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
        
        <button className="flex items-center space-x-2 text-slate-400 hover:text-green-400 transition-colors">
          <FaShare className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Feed</h1>
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="btn-minecraft flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <div className="card-minecraft p-6 mb-6">
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind? Share your latest Minecraft adventure..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  value={newPost.minecraftServer.name}
                  onChange={(e) => setNewPost({
                    ...newPost,
                    minecraftServer: { ...newPost.minecraftServer, name: e.target.value }
                  })}
                  placeholder="Server name (optional)"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newPost.minecraftServer.ip}
                  onChange={(e) => setNewPost({
                    ...newPost,
                    minecraftServer: { ...newPost.minecraftServer, ip: e.target.value }
                  })}
                  placeholder="Server IP (optional)"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="Tags (comma separated, e.g., survival, building, pvp)"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-minecraft-green transition-colors"
                  title="Add Image"
                >
                  <FaImage className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="btn-minecraft-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-minecraft"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Posts */}
      <div>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaComment className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-slate-400 mb-4">Be the first to share something with the community!</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="btn-minecraft"
            >
              Create First Post
            </button>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;