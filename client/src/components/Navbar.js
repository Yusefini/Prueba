import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaUsers, 
  FaServer, 
  FaNewspaper, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/feed', icon: FaNewspaper, label: 'Feed' },
    { path: '/servers', icon: FaServer, label: 'Servers' },
    { path: '/friends', icon: FaUsers, label: 'Friends' },
    { path: '/profile', icon: FaUser, label: 'Profile' }
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-minecraft-green hover:text-green-400 transition-colors"
          >
            <div className="w-8 h-8 bg-minecraft-green rounded flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">MC</span>
            </div>
            <span className="hidden sm:block">MinecraftSocial</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'bg-minecraft-green text-slate-900'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-minecraft-green rounded-full flex items-center justify-center">
                    <span className="text-slate-900 font-semibold text-sm">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-300 font-medium">{user?.username}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-minecraft"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 border-b border-slate-700 mb-2">
                <div className="w-10 h-10 bg-minecraft-green rounded-full flex items-center justify-center">
                  <span className="text-slate-900 font-semibold">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{user?.username}</div>
                  {user?.minecraftUsername && (
                    <div className="text-slate-400 text-sm">{user.minecraftUsername}</div>
                  )}
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'bg-minecraft-green text-slate-900'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors w-full text-left"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;