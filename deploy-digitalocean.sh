#!/bin/bash

echo "🌊 PowerPay DigitalOcean Deployment Script"
echo "==========================================="

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "📦 Installing DigitalOcean CLI (doctl)..."
    
    # Install doctl based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        wget https://github.com/digitalocean/doctl/releases/download/v1.98.0/doctl-1.98.0-linux-amd64.tar.gz
        tar xf doctl-1.98.0-linux-amd64.tar.gz
        sudo mv doctl /usr/local/bin
        rm doctl-1.98.0-linux-amd64.tar.gz
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install doctl
    else
        echo "❌ Please install doctl manually from: https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi
fi

echo ""
echo "🔐 Checking DigitalOcean authentication..."
if ! doctl account get > /dev/null 2>&1; then
    echo "❌ DigitalOcean not authenticated. Please run:"
    echo "   doctl auth init"
    echo "   (Get your API token from: https://cloud.digitalocean.com/account/api/tokens)"
    exit 1
fi

echo "✅ DigitalOcean authenticated"

echo ""
echo "🚀 Choose deployment option:"
echo "1. App Platform (Recommended - Easy & Fast)"
echo "2. Droplets + Docker (Advanced - More Control)"  
echo "3. Static Sites + Functions (Serverless)"
echo "4. Kubernetes (Enterprise)"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying with App Platform..."
        echo "--------------------------------"
        
        # Create App Platform deployment
        echo "📤 Creating PowerPay app..."
        doctl apps create .do/app.yaml
        
        echo ""
        echo "📊 Checking deployment status..."
        echo "This may take 5-10 minutes..."
        
        # Get app ID
        APP_ID=$(doctl apps list --format ID --no-header | head -1)
        
        # Wait for deployment
        echo "⏳ Waiting for deployment to complete..."
        doctl apps create-deployment $APP_ID --wait
        
        echo ""
        echo "✅ App Platform Deployment Complete!"
        echo ""
        echo "🌐 Your PowerPay application is live at:"
        doctl apps get $APP_ID --format LiveURL --no-header
        ;;
        
    2)
        echo ""
        echo "🐳 Deploying with Droplets + Docker..."
        echo "------------------------------------"
        
        # Create droplet
        echo "💧 Creating DigitalOcean droplet..."
        doctl compute droplet create powerpay-api \
            --size s-2vcpu-2gb \
            --image docker-20-04 \
            --region nyc1 \
            --ssh-keys $(doctl compute ssh-key list --format ID --no-header) \
            --wait
        
        # Get droplet IP
        DROPLET_IP=$(doctl compute droplet get powerpay-api --format PublicIPv4 --no-header)
        
        echo "✅ Droplet created at IP: $DROPLET_IP"
        echo ""
        echo "📋 Next steps:"
        echo "1. SSH into your droplet: ssh root@$DROPLET_IP"
        echo "2. Clone your repository"
        echo "3. Run: docker-compose up -d"
        ;;
        
    3)
        echo ""
        echo "⚡ Deploying Serverless Functions..."
        echo "-----------------------------------"
        echo "Coming soon - Functions deployment configuration"
        ;;
        
    4)
        echo ""
        echo "☸️ Deploying to Kubernetes..."
        echo "-----------------------------"
        
        # Create Kubernetes cluster
        echo "🚢 Creating Kubernetes cluster..."
        doctl kubernetes cluster create powerpay-cluster \
            --region nyc1 \
            --version latest \
            --count 2 \
            --size s-2vcpu-2gb \
            --wait
        
        echo "✅ Kubernetes cluster created!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Configure kubectl: doctl kubernetes cluster kubeconfig save powerpay-cluster"
        echo "2. Apply Kubernetes manifests"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 PowerPay DigitalOcean Deployment Process Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your custom domain in DigitalOcean console"
echo "2. Set up SSL certificates (free with Let's Encrypt)"
echo "3. Configure environment variables"
echo "4. Set up monitoring and alerts"
echo ""
echo "💡 Useful Commands:"
echo "   doctl apps list                    # List your apps"
echo "   doctl apps get <app-id>           # Get app details"
echo "   doctl apps logs <app-id>          # View app logs"
echo "   doctl compute droplet list        # List droplets"
echo ""
echo "📚 Documentation:"
echo "   https://docs.digitalocean.com/products/app-platform/"