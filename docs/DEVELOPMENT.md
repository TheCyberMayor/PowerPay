# PowerPay Development Setup Guide

## Prerequisites

Before setting up the PowerPay development environment, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v8 or higher) or **yarn**
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Docker** and **Docker Compose** (recommended)
- **Git**

### For Mobile Development
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

## Quick Start with Docker

The fastest way to get PowerPay running locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd powerpay
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Services
```bash
# Start PostgreSQL and Redis
docker-compose -f docker-compose.dev.yml up -d

# Install dependencies
npm install

# Start all services
npm run dev
```

This will start:
- **API Server**: http://localhost:3000
- **Web App**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **PgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081

## Manual Setup

If you prefer to set up services manually:

### 1. Database Setup

#### PostgreSQL
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database
sudo -u postgres createdb powerpay_dev
```

#### Redis
```bash
# Install Redis
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Start Redis service
sudo systemctl start redis-server  # Linux
brew services start redis          # macOS
```

### 2. Backend API Setup

```bash
cd apps/api

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Start development server
npm run start:dev
```

### 3. Web Application Setup

```bash
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Admin Dashboard Setup

```bash
cd apps/admin

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Mobile Application Setup

```bash
cd apps/mobile

# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm run start

# Run on Android (in another terminal)
npm run android

# Run on iOS (in another terminal)
npm run ios
```

## Development Workflows

### API Development

#### Running Tests
```bash
cd apps/api
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
```

#### Database Operations
```bash
cd apps/api
npm run migrate              # Run migrations
npm run migrate:generate     # Generate new migration
npm run migrate:revert       # Rollback last migration
npm run seed                 # Seed database
```

#### API Documentation
- Swagger UI: http://localhost:3000/api/docs
- Generate docs: `npm run docs:generate`

### Frontend Development

#### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

#### Building for Production
```bash
# Build all applications
npm run build

# Build specific app
npm run build:api
npm run build:web
npm run build:admin
```

### Mobile Development

#### Android Development
```bash
cd apps/mobile

# Run on Android device/emulator
npm run android

# Build release APK
npm run build:android

# Generate signed APK
cd android && ./gradlew assembleRelease
```

#### iOS Development (macOS only)
```bash
cd apps/mobile

# Run on iOS simulator
npm run ios

# Build for release
npm run build:ios
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=powerpay_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h

# Payment Gateways
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_flutterwave_secret_key

# Notifications
TERMII_API_KEY=your_termii_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

See `.env.example` for the complete list of environment variables.

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d powerpay_dev
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### React Native Issues
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Clean build (Android)
cd android && ./gradlew clean && cd ..

# Clean build (iOS)
cd ios && rm -rf build && cd ..
```

### Getting Help

1. Check the logs in the `logs/` directory
2. Review the API documentation at http://localhost:3000/api/docs
3. Check the GitHub Issues for known problems
4. Contact the development team

## Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- REST Client
- GitLens
- Thunder Client (for API testing)

### Database Management
- **PgAdmin**: http://localhost:5050 (when using Docker)
- **Redis Commander**: http://localhost:8081 (when using Docker)
- **DBeaver** (alternative PostgreSQL client)

### API Testing Tools
- Postman
- Insomnia
- VS Code REST Client
- Built-in Swagger UI

## Production Deployment

See the [Deployment Guide](./DEPLOYMENT.md) for production deployment instructions.

## Contributing

Please read the [Contributing Guidelines](./CONTRIBUTING.md) before making contributions to the project.