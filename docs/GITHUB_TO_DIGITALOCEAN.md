# GitHub to DigitalOcean Deployment Guide

## 🚀 Complete Step-by-Step Guide: GitHub → DigitalOcean

### Phase 1: Push to GitHub

#### Step 1: Initialize Git Repository
```powershell
# In your PowerPay project directory
git init
git add .
git commit -m "Initial commit: PowerPay electricity payment application"
```

#### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Repository name: `PowerPay`
4. Description: `Nigerian Electricity Payment Application`
5. Set to **Private** (recommended for production app)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

#### Step 3: Connect Local Repository to GitHub
```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/PowerPay.git
git branch -M main
git push -u origin main
```

#### Step 4: Verify Upload
- Go to your GitHub repository
- Confirm all files are uploaded
- Check that sensitive files (.env) are not visible (blocked by .gitignore)

### Phase 2: Connect to DigitalOcean

#### Step 1: Create DigitalOcean Account
1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up (get $200 credit with referral links)
3. Complete account verification

#### Step 2: Create New App
1. Go to DigitalOcean Dashboard
2. Click "Create" → "Apps"
3. Choose "GitHub" as source
4. Click "Authorize DigitalOcean" to connect GitHub

#### Step 3: Configure Repository
1. Select your `PowerPay` repository
2. Choose branch: `main`
3. Auto-deploy: ✅ **Enabled** (deploys on every push)

#### Step 4: Configure Services
DigitalOcean will auto-detect your apps based on `.do/app.yaml`:

**Detected Services:**
- ✅ **API Service** (`apps/api`) - NestJS Backend
- ✅ **Web Service** (`apps/web`) - React Web App  
- ✅ **Admin Service** (`apps/admin`) - React Admin Dashboard

**Auto-configured:**
- ✅ **PostgreSQL Database** - Managed database
- ✅ **Redis Cache** - Managed cache
- ✅ **Environment Variables** - From app.yaml

#### Step 5: Set Environment Variables
In DigitalOcean App Platform dashboard, add these **required** variables:

```
# Payment Gateway (Required)
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key

# Security (Required)  
JWT_SECRET=your-super-secure-jwt-secret-key-32-chars-min

# Optional but Recommended
FLUTTERWAVE_SECRET_KEY=FLWSECK-your-flutterwave-secret-key
TERMII_API_KEY=your_termii_api_key
SENDGRID_API_KEY=SG.your_sendgrid_api_key
```

**Note:** `DATABASE_URL` and `REDIS_URL` are auto-configured by DigitalOcean

#### Step 6: Review & Deploy
1. Review app configuration
2. Select region: **New York** (closest to Nigeria with good performance)
3. Plan: **Basic** ($12/month for development)
4. Click "Create Resources"

### Phase 3: Monitor Deployment

#### Deployment Process (10-15 minutes)
1. **Building** (5 mins): Installing dependencies, building apps
2. **Creating Database** (3 mins): PostgreSQL + Redis setup
3. **Deploying Services** (5 mins): API, Web, Admin deployment
4. **Health Checks** (2 mins): Ensuring all services are running

#### Access Your Application
After deployment completes, you'll get:
- **Web App**: `https://your-app-name-web.ondigitalocean.app`
- **Admin**: `https://your-app-name-admin.ondigitalocean.app` 
- **API**: `https://your-app-name-api.ondigitalocean.app`

### Phase 4: Custom Domain (Optional)

#### Step 1: Add Domain in DigitalOcean
1. Go to App Settings → Domains
2. Add your domain: `powerpay.ng`
3. Add subdomain: `admin.powerpay.ng`

#### Step 2: Update DNS
Point your domain to DigitalOcean:
```
Type: CNAME
Name: @
Value: your-app-name.ondigitalocean.app

Type: CNAME  
Name: admin
Value: your-app-name-admin.ondigitalocean.app
```

#### Step 3: SSL Certificate
- DigitalOcean automatically provides free SSL certificates
- HTTPS will be enabled automatically

## 🔄 Continuous Deployment

### Automatic Deployments
Every time you push to GitHub:
```powershell
# Make changes to your code
git add .
git commit -m "Added new payment feature"
git push origin main
```

**DigitalOcean will automatically:**
1. Detect the push
2. Pull latest code
3. Build applications
4. Deploy updates
5. Run health checks
6. Switch traffic to new version

### Manual Deployment
If needed, you can trigger manual deployment:
1. Go to DigitalOcean App dashboard
2. Click "Deploy" button
3. Select branch/commit to deploy

## 💰 Cost Estimation

### Development/Testing
- **App Platform**: $12/month (Basic plan)
- **Database**: $8/month (1GB PostgreSQL)
- **Redis**: $5/month (1GB Redis)
- **Total**: **$25/month**

### Production
- **App Platform**: $48/month (Pro plan, multiple instances)
- **Database**: $25/month (4GB PostgreSQL with standby)
- **Redis**: $15/month (2GB Redis)
- **Load Balancer**: $10/month
- **Total**: **$98/month**

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
- **Cause**: Missing dependencies or wrong Node.js version
- **Fix**: Check build logs, update package.json

#### Environment Variables
- **Cause**: Missing required variables
- **Fix**: Add all required env vars in DO dashboard

#### Database Connection
- **Cause**: Database not ready or wrong connection string
- **Fix**: Wait for database creation, check DATABASE_URL

#### 502 Bad Gateway
- **Cause**: App not starting properly
- **Fix**: Check app logs, verify health check endpoint

### Getting Help
- **DigitalOcean Docs**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **Community**: [community.digitalocean.com](https://community.digitalocean.com)
- **Support**: Available 24/7 via ticket system

## 🎉 Success Checklist

After deployment, verify:
- [ ] All services are running (API, Web, Admin)
- [ ] Database connection working
- [ ] Environment variables configured
- [ ] Payment gateway integration working
- [ ] SSL certificates active
- [ ] Custom domain configured (if applicable)
- [ ] Auto-deployment from GitHub working

## 🔐 Security Best Practices

### Production Checklist
- [ ] Use production API keys (not test keys)
- [ ] Enable 2FA on GitHub and DigitalOcean accounts
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure CORS properly in API
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review access logs regularly

## 📊 Monitoring & Analytics

### Built-in Monitoring
DigitalOcean provides:
- **App Performance**: Response times, error rates
- **Resource Usage**: CPU, memory, bandwidth
- **Database Metrics**: Connection count, query performance
- **Uptime Monitoring**: 99.99% SLA

### Custom Monitoring
Add to your application:
- Error tracking (e.g., Sentry)
- Analytics (e.g., Google Analytics)
- Performance monitoring (e.g., New Relic)

---

**Your PowerPay application is now live and ready to serve Nigerian electricity customers! 🇳🇬⚡**