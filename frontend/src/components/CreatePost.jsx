import { useState } from 'react';
import api from '../utils/api';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Build', 'Achievement', 'Tutorial', 'Meme', 'Server', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/posts', { content, imageUrl, category });
      onPostCreated(res.data);
      setContent('');
      setImageUrl('');
      setCategory('General');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card create-post">
      <h3>✏️ Create a Post</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your Minecraft adventures..."
          maxLength="1000"
          required
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
