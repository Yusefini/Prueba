import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import './PostCard.css';

function PostCard({ post, currentUser, onDelete, onUpdate }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = likes.includes(currentUser._id);
  const isOwner = post.user._id === currentUser._id;

  const handleLike = async () => {
    try {
      const res = await api.put(`/posts/like/${post._id}`);
      setLikes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/comment/${post._id}`, { text: commentText });
      setComments(res.data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${post._id}`);
        onDelete(post._id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="post-user">
          <img src={post.user.avatar || 'https://crafatar.com/avatars/steve'} alt="avatar" />
          <div>
            <Link to={`/profile/${post.user._id}`} className="post-username">
              {post.user.username}
            </Link>
            <span className="post-minecraft">⛏️ {post.user.minecraftUsername}</span>
          </div>
        </div>
        <div className="post-meta">
          <span className="post-category">{post.category}</span>
          <span className="post-time">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="post" className="post-image" />
        )}
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
          ❤️ {likes.length}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="action-btn">
          💬 {comments.length}
        </button>
        {isOwner && (
          <button onClick={handleDelete} className="action-btn delete-btn">
            🗑️ Delete
          </button>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              maxLength="500"
            />
            <button type="submit" className="btn btn-small">Post</button>
          </form>
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <Link to={`/profile/${comment.user._id}`} className="comment-username">
                  {comment.user.username}
                </Link>
                <p>{comment.text}</p>
                <span className="comment-time">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
