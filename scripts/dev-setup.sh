#!/bin/bash

# Minecraft Social Network - Development Setup Script
echo "🎮 Setting up Minecraft Social Network for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 15+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Go back to root
cd ..

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
createdb minecraft_social 2>/dev/null || echo "Database already exists"

# Run database migrations
echo "🔄 Running database migrations..."
cd server
npx prisma migrate dev --name init

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Seed the database
echo "🌱 Seeding database..."
npm run seed

cd ..

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Login with: admin@minecraftsocial.com / password123"
echo ""
echo "🚀 Happy coding!"