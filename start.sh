#!/bin/bash

# Minecraft Social Network - Quick Start Script
echo "🎮 Starting Minecraft Social Network..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Dependencies not found. Running setup..."
    ./scripts/dev-setup.sh
fi

# Start the development servers
echo "🚀 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

npm run dev