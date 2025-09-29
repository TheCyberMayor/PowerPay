#!/bin/bash

echo "🚀 PowerPay Vercel Deployment Script"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🌐 Deploying PowerPay Web App..."
echo "--------------------------------"
cd apps/web
echo "Current directory: $(pwd)"
echo "Building and deploying web app..."
vercel --prod

cd ../..

echo ""
echo "👨‍💼 Deploying PowerPay Admin Dashboard..."
echo "----------------------------------------"
cd apps/admin
echo "Current directory: $(pwd)"
echo "Building and deploying admin dashboard..."
vercel --prod

cd ../..

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📋 Next Steps:"
echo "1. Update environment variables in Vercel dashboard"
echo "2. Deploy your API backend to Railway/Render"
echo "3. Update API URLs in both frontend apps"
echo ""
echo "🌐 Your apps will be available at:"
echo "- Web App: https://[your-project-name]-web.vercel.app"
echo "- Admin: https://[your-project-name]-admin.vercel.app"
echo ""
echo "📚 See docs/VERCEL_DEPLOYMENT.md for detailed instructions"