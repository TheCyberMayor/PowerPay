#!/bin/bash

echo "🚀 PowerPay GitHub Setup Script"
echo "==============================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Adding all files to Git..."
    git add .
    
    echo "💾 Committing changes..."
    git commit -m "Initial commit: PowerPay electricity payment application

Features:
- NestJS backend API with PostgreSQL and Redis
- React web application and admin dashboard  
- React Native mobile app
- Nigerian DISCO integrations
- Payment gateway integrations (Flutterwave, Interswitch)
- DigitalOcean deployment configuration
- Comprehensive documentation"
else
    echo "✅ No changes to commit"
fi

# Check if remote origin exists
if git remote | grep -q "origin"; then
    echo "✅ Remote origin already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote URL: $REMOTE_URL"
else
    echo ""
    echo "🔗 GitHub Repository Setup Required"
    echo "=================================="
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Go to https://github.com and sign in"
    echo "2. Click 'New repository' (green button)"
    echo "3. Repository name: PowerPay"
    echo "4. Description: Nigerian Electricity Payment Application"
    echo "5. Set to Private (recommended)"
    echo "6. Don't initialize with README"
    echo "7. Click 'Create repository'"
    echo ""
    echo "8. Then run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/PowerPay.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
fi

# Check if main branch exists and is current
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🌟 Switching to main branch..."
    git branch -M main
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""

if git remote | grep -q "origin"; then
    echo "🚀 Push to GitHub:"
    echo "   git push origin main"
    echo ""
    echo "🌊 Deploy to DigitalOcean:"
    echo "   1. Go to cloud.digitalocean.com"
    echo "   2. Create → Apps → GitHub"
    echo "   3. Select your PowerPay repository"
    echo "   4. Configure environment variables"
    echo "   5. Deploy!"
else
    echo "1. Create GitHub repository (see instructions above)"
    echo "2. Connect local repository to GitHub"
    echo "3. Push code to GitHub"
    echo "4. Deploy to DigitalOcean"
fi

echo ""
echo "📚 Documentation:"
echo "   docs/GITHUB_TO_DIGITALOCEAN.md - Complete deployment guide"
echo "   docs/DIGITALOCEAN_DEPLOYMENT.md - DigitalOcean specific info"
echo ""
echo "💡 Need help? Check the documentation or create an issue on GitHub!"