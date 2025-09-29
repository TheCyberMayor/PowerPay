@echo off
echo 🌊 PowerPay DigitalOcean Deployment Script
echo ===========================================

REM Check if doctl is installed
where doctl >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Please install DigitalOcean CLI first:
    echo    1. Download from: https://github.com/digitalocean/doctl/releases
    echo    2. Extract and add to PATH
    echo    3. Run: doctl auth init
    pause
    exit /b 1
)

echo.
echo 🔐 Checking DigitalOcean authentication...
doctl account get >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ DigitalOcean not authenticated. Please run:
    echo    doctl auth init
    echo    (Get your API token from: https://cloud.digitalocean.com/account/api/tokens)
    pause
    exit /b 1
)

echo ✅ DigitalOcean authenticated

echo.
echo 🚀 Choose deployment option:
echo 1. App Platform (Recommended - Easy ^& Fast)
echo 2. Droplets + Docker (Advanced - More Control)
echo 3. Static Sites + Functions (Serverless)
echo 4. Kubernetes (Enterprise)

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Deploying with App Platform...
    echo --------------------------------
    
    echo 📤 Creating PowerPay app...
    doctl apps create .do\app.yaml
    
    echo.
    echo 📊 Checking deployment status...
    echo This may take 5-10 minutes...
    
    REM Get app ID - this is simplified, you may need to parse the output
    echo ⏳ Waiting for deployment to complete...
    echo Please check your DigitalOcean dashboard for deployment status.
    
    echo.
    echo ✅ App Platform Deployment Initiated!
    echo.
    echo 🌐 Check your app status at:
    echo    https://cloud.digitalocean.com/apps
    
) else if "%choice%"=="2" (
    echo.
    echo 🐳 Deploying with Droplets + Docker...
    echo ------------------------------------
    
    echo 💧 Creating DigitalOcean droplet...
    doctl compute droplet create powerpay-api --size s-2vcpu-2gb --image docker-20-04 --region nyc1 --wait
    
    echo ✅ Droplet created!
    echo.
    echo 📋 Next steps:
    echo 1. Get your droplet IP from DigitalOcean dashboard
    echo 2. SSH into your droplet
    echo 3. Clone your repository
    echo 4. Run: docker-compose up -d
    
) else if "%choice%"=="3" (
    echo.
    echo ⚡ Deploying Serverless Functions...
    echo -----------------------------------
    echo Coming soon - Functions deployment configuration
    
) else if "%choice%"=="4" (
    echo.
    echo ☸️ Deploying to Kubernetes...
    echo -----------------------------
    
    echo 🚢 Creating Kubernetes cluster...
    doctl kubernetes cluster create powerpay-cluster --region nyc1 --version latest --count 2 --size s-2vcpu-2gb --wait
    
    echo ✅ Kubernetes cluster created!
    echo.
    echo 📋 Next steps:
    echo 1. Configure kubectl: doctl kubernetes cluster kubeconfig save powerpay-cluster
    echo 2. Apply Kubernetes manifests
    
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 PowerPay DigitalOcean Deployment Process Complete!
echo.
echo 📋 Next Steps:
echo 1. Configure your custom domain in DigitalOcean console
echo 2. Set up SSL certificates (free with Let's Encrypt)
echo 3. Configure environment variables
echo 4. Set up monitoring and alerts
echo.
echo 💡 Useful Commands:
echo    doctl apps list                    # List your apps
echo    doctl apps get ^<app-id^>           # Get app details
echo    doctl apps logs ^<app-id^>          # View app logs
echo    doctl compute droplet list        # List droplets
echo.
echo 📚 Documentation:
echo    https://docs.digitalocean.com/products/app-platform/

pause