#!/bin/bash
echo "🔧 PowerPay Build Debug Script"
echo "=============================="

# Check Node.js version
echo "📋 Node.js version:"
node --version
npm --version

# Check if we're in the right directory
echo "📁 Current directory:"
pwd
ls -la

# Check package.json
echo "📦 Package.json exists:"
if [ -f "package.json" ]; then
  echo "✅ package.json found"
  echo "📋 Build script:"
  cat package.json | grep '"build"'
else
  echo "❌ package.json not found"
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Run the build
echo "🔨 Building the application..."
npm run build

# Check the dist folder
echo "📁 Checking dist folder:"
if [ -d "dist" ]; then
  echo "✅ dist folder exists"
  ls -la dist/
  
  if [ -f "dist/main.js" ]; then
    echo "✅ main.js found in dist/"
  else
    echo "❌ main.js NOT found in dist/"
    echo "📋 Files in dist:"
    find dist/ -name "*.js" | head -10
  fi
else
  echo "❌ dist folder does not exist"
fi

# Check for TypeScript files
echo "📋 TypeScript source files:"
find src/ -name "*.ts" | head -5

echo "🏁 Build debug complete"