@echo off
echo 🚀 PowerPay AWS Deployment Script
echo ==================================

REM Check if AWS CLI is installed
where aws >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI not found. Please install AWS CLI first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    pause
    exit /b 1
)

REM Check if CDK is installed
where cdk >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing AWS CDK...
    npm install -g aws-cdk
)

echo.
echo 🔐 Checking AWS credentials...
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS credentials not configured. Please run:
    echo    aws configure
    pause
    exit /b 1
)

echo ✅ AWS credentials configured

echo.
echo 🏗️ Choose deployment option:
echo 1. AWS CDK (Full Infrastructure as Code)
echo 2. AWS Amplify (Quick ^& Easy)
echo 3. ECS Fargate (API Only)
echo 4. Serverless (Lambda Functions)

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🏗️ Deploying with AWS CDK...
    echo -----------------------------
    cd infrastructure\aws-cdk
    npm install
    cdk bootstrap
    echo.
    echo 🚀 Deploying development environment...
    cdk deploy PowerPayDev --require-approval never
    echo.
    echo ✅ CDK Deployment Complete!
    echo 🌐 Check AWS Console for resource URLs
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying with AWS Amplify...
    echo --------------------------------
    where amplify >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Amplify CLI...
        npm install -g @aws-amplify/cli
    )
    
    echo 🔧 Initializing Amplify project...
    amplify init --yes
    
    echo 🚀 Adding hosting...
    amplify add hosting
    
    echo 📤 Publishing...
    amplify publish
    
    echo ✅ Amplify Deployment Complete!
) else if "%choice%"=="3" (
    echo.
    echo 🐳 Deploying API to ECS Fargate...
    echo ---------------------------------
    echo This requires manual setup via AWS Console or Terraform
    echo See docs\AWS_DEPLOYMENT.md for detailed instructions
) else if "%choice%"=="4" (
    echo.
    echo ⚡ Deploying Serverless Functions...
    echo ------------------------------------
    where serverless >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Serverless Framework...
        npm install -g serverless
    )
    echo Coming soon - serverless configuration in progress
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 PowerPay AWS Deployment Process Complete!
echo.
echo 📋 Next Steps:
echo 1. Update environment variables in AWS Console
echo 2. Configure custom domain names
echo 3. Set up SSL certificates
echo 4. Configure monitoring and alerts
echo.
echo 📚 For detailed configuration, see:
echo    docs\AWS_DEPLOYMENT.md

pause