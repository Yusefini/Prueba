import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaServer, FaGamepad, FaTrophy } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FaUsers,
      title: 'Connect with Players',
      description: 'Find and connect with Minecraft players from around the world'
    },
    {
      icon: FaServer,
      title: 'Discover Servers',
      description: 'Browse and join amazing Minecraft servers with active communities'
    },
    {
      icon: FaGamepad,
      title: 'Share Your Builds',
      description: 'Show off your amazing creations and get inspired by others'
    },
    {
      icon: FaTrophy,
      title: 'Track Achievements',
      description: 'Showcase your Minecraft achievements and gaming milestones'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="animate-float mb-8">
          <div className="w-24 h-24 bg-minecraft-green rounded-lg mx-auto flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-slate-900">MC</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Minecraft
          <span className="text-minecraft-green"> Social</span>
        </h1>
        
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          The ultimate social network for Minecraft players. Connect, share, and discover 
          amazing servers and builds with fellow crafters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="btn-minecraft text-lg px-8 py-3"
              >
                Join the Community
              </Link>
              <Link
                to="/login"
                className="btn-minecraft-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </>
          ) : (
            <Link
              to="/feed"
              className="btn-minecraft text-lg px-8 py-3"
            >
              Go to Feed
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose MinecraftSocial?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-minecraft p-6 text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 bg-minecraft-green rounded-full mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card-minecraft p-8">
              <div className="text-4xl font-bold text-minecraft-green mb-2">1000+</div>
              <div className="text-slate-300">Active Players</div>
            </div>
            <div className="card-minecraft p-8">
              <div className="text-4xl font-bold text-minecraft-green mb-2">500+</div>
              <div className="text-slate-300">Servers Listed</div>
            </div>
            <div className="card-minecraft p-8">
              <div className="text-4xl font-bold text-minecraft-green mb-2">10k+</div>
              <div className="text-slate-300">Builds Shared</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-20 bg-gradient-to-r from-minecraft-green to-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-slate-800 mb-8 text-lg">
              Join thousands of Minecraft players in the ultimate social experience
            </p>
            <Link
              to="/register"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;