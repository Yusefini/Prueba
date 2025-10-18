import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaServer, 
  FaUsers, 
  FaStar, 
  FaGlobe, 
  FaDiscord,
  FaGamepad,
  FaCog,
  FaArrowLeft,
  FaEdit
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const ServerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchServer();
  }, [id]);

  const fetchServer = async () => {
    try {
      const response = await axios.get(`/api/minecraft/servers/${id}`);
      setServer(response.data);
    } catch (error) {
      toast.error('Failed to load server details');
      navigate('/servers');
    } finally {
      setLoading(false);
    }
  };

  const joinServer = async () => {
    try {
      await axios.post(`/api/minecraft/servers/${id}/join`);
      toast.success('Successfully joined server!');
      fetchServer();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join server');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/minecraft/servers/${id}/review`, reviewForm);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchServer();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const copyServerIP = () => {
    navigator.clipboard.writeText(`${server.ip}:${server.port}`);
    toast.success('Server IP copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-minecraft-green"></div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Server not found</h2>
        <p className="text-slate-400">The server you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/servers')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>Back to Servers</span>
      </button>

      {/* Server Header */}
      <div className="card-minecraft p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-minecraft-green rounded-lg flex items-center justify-center">
                <FaServer className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{server.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`flex items-center space-x-2 ${server.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${server.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm font-medium">
                      {server.isActive ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span>{server.rating.average.toFixed(1)} ({server.rating.count} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-300 mb-6">{server.description}</p>

            {/* Server Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Server Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address:</span>
                    <button
                      onClick={copyServerIP}
                      className="text-minecraft-green hover:text-green-400 transition-colors cursor-pointer"
                    >
                      {server.ip}:{server.port}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="text-white">{server.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Game Mode:</span>
                    <span className="text-white capitalize">{server.gameMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Server Type:</span>
                    <span className="text-white capitalize">{server.serverType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Players:</span>
                    <span className="text-white">{server.onlinePlayers}/{server.maxPlayers}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Owner & Links</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner:</span>
                    <span className="text-white">{server.owner.username}</span>
                  </div>
                  {server.website && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Website:</span>
                      <a
                        href={server.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-minecraft-green hover:text-green-400 transition-colors flex items-center space-x-1"
                      >
                        <FaGlobe className="w-3 h-3" />
                        <span>Visit</span>
                      </a>
                    </div>
                  )}
                  {server.discord && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Discord:</span>
                      <a
                        href={server.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-minecraft-green hover:text-green-400 transition-colors flex items-center space-x-1"
                      >
                        <FaDiscord className="w-3 h-3" />
                        <span>Join</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 lg:ml-8">
            <button
              onClick={joinServer}
              className="btn-minecraft flex items-center space-x-2"
              disabled={!server.isActive}
            >
              <FaGamepad className="w-4 h-4" />
              <span>Join Server</span>
            </button>
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-minecraft-secondary flex items-center space-x-2"
            >
              <FaStar className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        {server.tags && server.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {server.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-700 text-minecraft-green text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="card-minecraft p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
          <form onSubmit={submitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`text-2xl ${
                      star <= reviewForm.rating ? 'text-yellow-400' : 'text-slate-600'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience with this server..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-minecraft"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-minecraft-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews */}
      {server.reviews && server.reviews.length > 0 && (
        <div className="card-minecraft p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Reviews ({server.reviews.length})
          </h3>
          <div className="space-y-6">
            {server.reviews.map((review, index) => (
              <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-minecraft-green rounded-full flex items-center justify-center">
                    <span className="text-slate-900 font-semibold text-sm">
                      {review.user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-white">{review.user.username}</h4>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-slate-300">{review.comment}</p>
                    )}
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

export default ServerDetail;