#!/bin/bash

# PowerPay Setup Script
# This script sets up the development environment for PowerPay

echo "🚀 Setting up PowerPay Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    DOCKER_AVAILABLE=true
else
    echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL and Redis manually."
    DOCKER_AVAILABLE=false
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install API dependencies
echo "📦 Installing API dependencies..."
cd apps/api && npm install && cd ../..

# Install Web dependencies
echo "📦 Installing Web dependencies..."
cd apps/web && npm install && cd ../..

# Install Admin dependencies
echo "📦 Installing Admin dependencies..."
cd apps/admin && npm install && cd ../..

# Install Mobile dependencies
echo "📦 Installing Mobile dependencies..."
cd apps/mobile && npm install && cd ../..

# Install Shared library dependencies
echo "📦 Installing Shared library dependencies..."
cd libs/shared && npm install && cd ../..

# Start Docker services if available
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Starting Docker services..."
    docker-compose -f docker-compose.dev.yml up -d
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres; do
        sleep 2
    done
    
    echo "✅ PostgreSQL is ready"
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    cd apps/api && npm run migrate && cd ../..
    
    echo "✅ Database migrations completed"
else
    echo "⚠️  Please set up PostgreSQL and Redis manually:"
    echo "   - PostgreSQL: Create database 'powerpay_dev'"
    echo "   - Redis: Start Redis server on port 6379"
    echo "   - Run 'npm run migrate' in apps/api after setup"
fi

echo ""
echo "🎉 PowerPay setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your .env file with API keys and configuration"
echo "   2. Start the development servers:"
echo "      npm run dev"
echo ""
echo "🌐 Application URLs:"
echo "   - API Server: http://localhost:3000"
echo "   - Web App: http://localhost:3001"
echo "   - Admin Dashboard: http://localhost:3002"
echo "   - API Documentation: http://localhost:3000/api/docs"
echo ""
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🛠️  Database Management:"
    echo "   - PgAdmin: http://localhost:5050 (admin@powerpay.ng / admin123)"
    echo "   - Redis Commander: http://localhost:8081"
    echo ""
fi
echo "📚 For more information, see docs/DEVELOPMENT.md"