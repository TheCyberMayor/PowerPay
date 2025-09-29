#!/bin/bash

echo "🚀 PowerPay AWS Deployment Script"
echo "=================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "📦 Installing AWS CDK..."
    npm install -g aws-cdk
fi

echo ""
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ AWS credentials configured"

echo ""
echo "🏗️ Choose deployment option:"
echo "1. AWS CDK (Full Infrastructure as Code)"
echo "2. AWS Amplify (Quick & Easy)"
echo "3. ECS Fargate (API Only)"
echo "4. Serverless (Lambda Functions)"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🏗️ Deploying with AWS CDK..."
        echo "-----------------------------"
        cd infrastructure/aws-cdk
        npm install
        cdk bootstrap
        echo ""
        echo "🚀 Deploying development environment..."
        cdk deploy PowerPayDev --require-approval never
        echo ""
        echo "✅ CDK Deployment Complete!"
        echo "🌐 Check AWS Console for resource URLs"
        ;;
    2)
        echo ""
        echo "🚀 Deploying with AWS Amplify..."
        echo "--------------------------------"
        if ! command -v amplify &> /dev/null; then
            echo "📦 Installing Amplify CLI..."
            npm install -g @aws-amplify/cli
        fi
        
        echo "🔧 Initializing Amplify project..."
        amplify init --yes
        
        echo "🚀 Adding hosting..."
        amplify add hosting
        
        echo "📤 Publishing..."
        amplify publish
        
        echo "✅ Amplify Deployment Complete!"
        ;;
    3)
        echo ""
        echo "🐳 Deploying API to ECS Fargate..."
        echo "---------------------------------"
        echo "This requires manual setup via AWS Console or Terraform"
        echo "See docs/AWS_DEPLOYMENT.md for detailed instructions"
        ;;
    4)
        echo ""
        echo "⚡ Deploying Serverless Functions..."
        echo "------------------------------------"
        if ! command -v serverless &> /dev/null; then
            echo "📦 Installing Serverless Framework..."
            npm install -g serverless
        fi
        echo "Coming soon - serverless configuration in progress"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 PowerPay AWS Deployment Process Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update environment variables in AWS Console"
echo "2. Configure custom domain names"
echo "3. Set up SSL certificates"
echo "4. Configure monitoring and alerts"
echo ""
echo "📚 For detailed configuration, see:"
echo "   docs/AWS_DEPLOYMENT.md"