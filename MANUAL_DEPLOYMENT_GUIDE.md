# Manual DigitalOcean Deployment Guide

## Issue: App Not Found or Deployment Failed

### Option 1: Create App via DigitalOcean Dashboard

1. **Go to DigitalOcean Apps**: https://cloud.digitalocean.com/apps
2. **Create New App**
3. **Connect GitHub Repository**:
   - Repository: TheCyberMayor/PowerPay
   - Branch: master
   - Source Directory: apps/api
4. **Configure Build Settings**:
   - Build Command: `npm ci && npm run build`
   - Run Command: `npm run start:prod`
5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   FLUTTERWAVE_SECRET_KEY=your-secret-key
   FLUTTERWAVE_PUBLIC_KEY=your-public-key
   JWT_SECRET=your-jwt-secret
   ```

### Option 2: Use DigitalOcean CLI (doctl)

1. **Install doctl**: https://docs.digitalocean.com/reference/doctl/how-to/install/
2. **Authenticate**: `doctl auth init`
3. **Deploy**: `doctl apps create --spec .do/app.yaml`

### Option 3: Alternative Deployment (Vercel/Railway)

If DigitalOcean continues to have issues, consider:
- **Vercel**: Free Node.js hosting with GitHub integration
- **Railway**: Simple deployment with PostgreSQL support
- **Render**: Free tier with automatic SSL

### Current App Configuration

The app.yaml configuration should work with these settings:
```yaml
name: powerpay
services:
- name: api
  source_dir: apps/api
  github:
    repo: TheCyberMayor/PowerPay
    branch: master
  run_command: npm run start:prod
  build_command: npm ci && npm run build
  environment_slug: node-js
  instance_size_slug: basic-xxs
  http_port: 3000
```

### Troubleshooting Steps

1. **Check GitHub Repository Access**: Ensure DigitalOcean can access your repo
2. **Verify Build Command**: Test locally with `npm ci && npm run build`
3. **Check Environment Variables**: Ensure all required vars are set
4. **Review Deployment Logs**: Check DigitalOcean dashboard for error details

### Expected Endpoints

Once deployed, these should work:
- Health Check: `/health`
- API Health: `/api/v1/health` 
- Swagger Docs: `/api/docs`

### Contact Support

If issues persist:
1. Check DigitalOcean status page
2. Contact DigitalOcean support
3. Consider alternative hosting platforms
