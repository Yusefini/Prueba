import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaServer, FaArrowLeft } from 'react-icons/fa';

const CreateServer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '25565',
    version: '',
    description: '',
    website: '',
    discord: '',
    maxPlayers: '20',
    gameMode: 'survival',
    serverType: 'vanilla',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serverData = {
        ...formData,
        port: parseInt(formData.port),
        maxPlayers: parseInt(formData.maxPlayers),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await axios.post('/api/minecraft/servers', serverData);
      toast.success('Server created successfully!');
      navigate(`/servers/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/servers')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>Back to Servers</span>
      </button>

      <div className="card-minecraft p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-minecraft-green rounded-lg mx-auto mb-4 flex items-center justify-center">
            <FaServer className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white">Add Your Server</h1>
          <p className="text-slate-400 mt-2">
            Share your Minecraft server with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Server Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Server"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Minecraft Version *
                </label>
                <input
                  type="text"
                  name="version"
                  required
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="1.20.1"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Server Connection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connection Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Server IP *
                </label>
                <input
                  type="text"
                  name="ip"
                  required
                  value={formData.ip}
                  onChange={handleChange}
                  placeholder="play.myserver.com"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="25565"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Server Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game Mode
                </label>
                <select
                  name="gameMode"
                  value={formData.gameMode}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                >
                  <option value="survival">Survival</option>
                  <option value="creative">Creative</option>
                  <option value="adventure">Adventure</option>
                  <option value="hardcore">Hardcore</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Server Type
                </label>
                <select
                  name="serverType"
                  value={formData.serverType}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                >
                  <option value="vanilla">Vanilla</option>
                  <option value="bukkit">Bukkit</option>
                  <option value="spigot">Spigot</option>
                  <option value="paper">Paper</option>
                  <option value="forge">Forge</option>
                  <option value="fabric">Fabric</option>
                  <option value="modded">Modded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Players
                </label>
                <input
                  type="number"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell players about your server, what makes it special, rules, etc."
              rows="4"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent resize-none"
            />
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Links (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://myserver.com"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Discord
                </label>
                <input
                  type="url"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  placeholder="https://discord.gg/invite"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="pvp, economy, factions, skyblock (comma separated)"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
            />
            <p className="text-sm text-slate-500 mt-1">
              Add tags to help players find your server (separate with commas)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/servers')}
              className="btn-minecraft-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-minecraft flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaServer className="w-4 h-4" />
                  <span>Create Server</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServer;