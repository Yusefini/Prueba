import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaServer, 
  FaUsers, 
  FaStar, 
  FaSearch, 
  FaFilter, 
  FaPlus,
  FaGamepad,
  FaCog
} from 'react-icons/fa';

const Servers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gameMode: '',
    serverType: '',
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchServers();
  }, [searchQuery, filters]);

  const fetchServers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.gameMode) params.append('gameMode', filters.gameMode);
      if (filters.serverType) params.append('serverType', filters.serverType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await axios.get(`/api/minecraft/servers?${params}`);
      setServers(response.data.servers);
    } catch (error) {
      toast.error('Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const joinServer = async (serverId) => {
    try {
      await axios.post(`/api/minecraft/servers/${serverId}/join`);
      toast.success('Successfully joined server!');
      fetchServers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join server');
    }
  };

  const ServerCard = ({ server }) => (
    <div className="card-minecraft p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{server.name}</h3>
          <p className="text-slate-300 text-sm mb-3 line-clamp-2">
            {server.description || 'No description available.'}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
            <div className="flex items-center space-x-1">
              <FaUsers className="w-4 h-4" />
              <span>{server.onlinePlayers}/{server.maxPlayers}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaStar className="w-4 h-4 text-yellow-400" />
              <span>{server.rating.average.toFixed(1)} ({server.rating.count})</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaGamepad className="w-4 h-4" />
              <span className="capitalize">{server.gameMode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2 py-1 bg-slate-700 text-minecraft-green text-xs rounded-full capitalize">
              {server.serverType}
            </span>
            <span className="px-2 py-1 bg-slate-700 text-blue-400 text-xs rounded-full">
              {server.version}
            </span>
          </div>

          <div className="text-sm text-slate-400">
            <p><strong>IP:</strong> {server.ip}:{server.port}</p>
            <p><strong>Owner:</strong> {server.owner.username}</p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className={`w-3 h-3 rounded-full ${server.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-xs text-slate-500">
            {server.isActive ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Tags */}
      {server.tags && server.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {server.tags.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {server.tags.length > 5 && (
            <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
              +{server.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          to={`/servers/${server._id}`}
          className="btn-minecraft-secondary"
        >
          View Details
        </Link>
        
        <button
          onClick={() => joinServer(server._id)}
          className="btn-minecraft"
          disabled={!server.isActive}
        >
          Join Server
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Minecraft Servers</h1>
        <Link
          to="/create-server"
          className="btn-minecraft flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Server</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card-minecraft p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search servers by name, description, or tags..."
              className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-minecraft-secondary flex items-center space-x-2"
          >
            <FaFilter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game Mode
                </label>
                <select
                  value={filters.gameMode}
                  onChange={(e) => setFilters({ ...filters, gameMode: e.target.value })}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                >
                  <option value="">All Game Modes</option>
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
                  value={filters.serverType}
                  onChange={(e) => setFilters({ ...filters, serverType: e.target.value })}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                >
                  <option value="">All Types</option>
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
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green focus:border-transparent"
                >
                  <option value="rating">Rating</option>
                  <option value="players">Player Count</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Servers Grid */}
      <div>
        {servers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaServer className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No servers found</h3>
            <p className="text-slate-400 mb-4">
              {searchQuery || filters.gameMode || filters.serverType
                ? 'Try adjusting your search or filters'
                : 'Be the first to add a server to the community!'
              }
            </p>
            <Link
              to="/create-server"
              className="btn-minecraft"
            >
              Add Your Server
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map(server => (
              <ServerCard key={server._id} server={server} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Servers;