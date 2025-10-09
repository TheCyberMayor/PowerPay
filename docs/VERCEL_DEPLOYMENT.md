# PowerPay Vercel Deployment Guide

## 🚀 Deploying PowerPay to Vercel

### Overview
PowerPay can be deployed to Vercel using a hybrid approach:
- **Web App** and **Admin Dashboard** → Vercel (Frontend)
- **API Backend** → Railway/Render/DigitalOcean (Full Node.js support)

## 📋 Prerequisites
- Vercel account (free tier works)
- GitHub repository for your PowerPay project
- Environment variables ready

## 🎯 Deployment Strategy

### Option 1: Hybrid Deployment (Recommended)

#### 1. Frontend Apps on Vercel
Deploy both React apps separately:

**Web App (`apps/web`):**
```bash
# From project root
cd apps/web
vercel --prod
```

**Admin Dashboard (`apps/admin`):**
```bash
# From project root  
cd apps/admin
vercel --prod
```

#### 2. Backend API on Railway/Render
- Railway: Automatic PostgreSQL + Redis
- Render: Easy NestJS deployment
- DigitalOcean App Platform: Full control

### Option 2: Full Vercel (Serverless)
Convert NestJS API to Vercel serverless functions (requires refactoring).

## ⚙️ Setup Instructions

### Step 1: Prepare Frontend Apps

Both `apps/web` and `apps/admin` are already configured with:
- ✅ `vercel.json` configuration
- ✅ `vercel-build` script
- ✅ Environment variable setup

### Step 2: Environment Variables in Vercel

Set these in Vercel dashboard for both apps:

```env
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production

# Optional: Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Step 3: Deploy Web App

1. **Connect to GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Import your PowerPay repository
   - Select `apps/web` as root directory

2. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Root Directory: apps/web
   Build Command: npm run vercel-build
   Output Directory: dist
   ```

3. **Environment Variables:**
   Add your environment variables in Vercel dashboard

4. **Deploy:**
   Click "Deploy" - Vercel will build and deploy automatically

### Step 4: Deploy Admin Dashboard

Repeat the same process for `apps/admin`:
- Root Directory: `apps/admin`
- Same build settings
- Different domain (e.g., `powerpay-admin.vercel.app`)

### Step 5: Backend Deployment Options

#### Option A: Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd apps/api
railway up
```

#### Option B: Render
1. Connect GitHub repository
2. Select `apps/api` directory
3. Use Node.js environment
4. Add PostgreSQL and Redis add-ons

#### Option C: DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build/run commands
3. Add database components

## 🔧 Configuration Updates

### Update API URLs
After deploying your backend, update the frontend environment variables:

```env
# In Vercel dashboard for both web and admin apps
REACT_APP_API_URL=https://your-railway-app.railway.app
# or
REACT_APP_API_URL=https://your-render-app.onrender.com
```

### CORS Configuration
Update your API's CORS settings to allow your Vercel domains:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: [
    'https://powerpay-web.vercel.app',
    'https://powerpay-admin.vercel.app',
    'http://localhost:3001', // for development
    'http://localhost:3002', // for development
  ],
  credentials: true,
});
```

## 🌐 Expected URLs

After deployment:
- **Web App**: `https://powerpay-web.vercel.app`
- **Admin Dashboard**: `https://powerpay-admin.vercel.app`
- **API**: `https://your-backend-service.com`

## 📱 Mobile App Deployment

The React Native mobile app (`apps/mobile`) cannot be deployed to Vercel. Instead:
- **iOS**: Deploy to App Store using Xcode
- **Android**: Deploy to Google Play Store using Android Studio
- **Web Version**: Convert to React.js if needed

## 🔐 Environment Variables Checklist

### Frontend Apps (Vercel)
- [ ] `REACT_APP_API_URL`
- [ ] `REACT_APP_ENVIRONMENT`
- [ ] `REACT_APP_FLUTTERWAVE_PUBLIC_KEY`
- [ ] `REACT_APP_GOOGLE_ANALYTICS_ID` (optional)

### Backend API (Railway/Render)
- [ ] `DATABASE_URL`
- [ ] `REDIS_URL`
- [ ] `JWT_SECRET`
- [ ] `FLUTTERWAVE_SECRET_KEY`
- [ ] `INTERSWITCH_SECRET_KEY`
- [ ] `REMITA_SECRET_KEY`
- [ ] All DISCO API keys
- [ ] Notification service keys

## 🚨 Important Notes

1. **Database**: PostgreSQL needs persistent hosting (not Vercel)
2. **File Uploads**: Use cloud storage (AWS S3, Cloudinary)
3. **Background Jobs**: Use queue services (Bull MQ with Redis)
4. **Monitoring**: Add logging and error tracking
5. **SSL**: Ensure all external APIs support HTTPS

## 🔄 CI/CD Pipeline

Consider setting up GitHub Actions for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./apps/web
```

## 🆘 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version compatibility
2. **API Connection**: Verify CORS and environment variables
3. **Database Connection**: Ensure backend can reach PostgreSQL
4. **Environment Variables**: Double-check all required variables are set

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

## 💡 Cost Optimization

### Free Tiers Available:
- **Vercel**: 100GB bandwidth, unlimited personal projects
- **Railway**: $5/month credit, PostgreSQL included  
- **Render**: Free tier with limitations
- **Supabase**: Free PostgreSQL alternative

### Recommended Setup for Production:
- Vercel Pro: $20/month (better performance)
- Railway: $10-20/month (database + API)
- Total: ~$30-40/month for full deployment

Ready to deploy? Start with the frontend apps on Vercel and then choose your preferred backend hosting solution!