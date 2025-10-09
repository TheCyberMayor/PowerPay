#!/usr/bin/env node

/**
 * Simple PowerPay Deployment Test Script
 * Tests the deployment without requiring doctl installation
 */

const https = require('https');
const fs = require('fs');

class DeploymentTester {
  constructor() {
    // Try common DigitalOcean App Platform URL patterns
    this.possibleUrls = [
      'https://powerpay-xyz.ondigitalocean.app',
      'https://api-xyz.ondigitalocean.app',
      'https://powerpay-api-xyz.ondigitalocean.app'
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().substr(11, 8);
    const icons = { info: '🔄', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async testUrl(url) {
    return new Promise((resolve) => {
      const request = https.get(`${url}/health`, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            url: url,
            success: true,
            status: res.statusCode,
            data: data
          });
        });
      });
      
      request.on('error', (err) => {
        resolve({
          url: url,
          success: false,
          error: err.code || err.message
        });
      });
      
      request.on('timeout', () => {
        request.destroy();
        resolve({
          url: url,
          success: false,
          error: 'TIMEOUT'
        });
      });
    });
  }

  async testAllUrls() {
    this.log('Testing possible deployment URLs...');
    
    const results = [];
    for (const url of this.possibleUrls) {
      this.log(`Testing: ${url}`);
      const result = await this.testUrl(url);
      results.push(result);
      
      if (result.success) {
        this.log(`✅ Found working URL: ${url} (${result.status})`, 'success');
        if (result.data) {
          console.log(`Response: ${result.data}`);
        }
      } else {
        this.log(`❌ ${url}: ${result.error}`, 'error');
      }
    }
    
    return results;
  }

  generateManualDeploymentGuide() {
    const guide = `# Manual DigitalOcean Deployment Guide

## Issue: App Not Found or Deployment Failed

### Option 1: Create App via DigitalOcean Dashboard

1. **Go to DigitalOcean Apps**: https://cloud.digitalocean.com/apps
2. **Create New App**
3. **Connect GitHub Repository**:
   - Repository: TheCyberMayor/PowerPay
   - Branch: master
   - Source Directory: apps/api
4. **Configure Build Settings**:
   - Build Command: \`npm ci && npm run build\`
   - Run Command: \`npm run start:prod\`
5. **Set Environment Variables**:
   \`\`\`
   NODE_ENV=production
   PORT=3000
   FLUTTERWAVE_SECRET_KEY=your-secret-key
   FLUTTERWAVE_PUBLIC_KEY=your-public-key
   JWT_SECRET=your-jwt-secret
   \`\`\`

### Option 2: Use DigitalOcean CLI (doctl)

1. **Install doctl**: https://docs.digitalocean.com/reference/doctl/how-to/install/
2. **Authenticate**: \`doctl auth init\`
3. **Deploy**: \`doctl apps create --spec .do/app.yaml\`

### Option 3: Alternative Deployment (Vercel/Railway)

If DigitalOcean continues to have issues, consider:
- **Vercel**: Free Node.js hosting with GitHub integration
- **Railway**: Simple deployment with PostgreSQL support
- **Render**: Free tier with automatic SSL

### Current App Configuration

The app.yaml configuration should work with these settings:
\`\`\`yaml
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
\`\`\`

### Troubleshooting Steps

1. **Check GitHub Repository Access**: Ensure DigitalOcean can access your repo
2. **Verify Build Command**: Test locally with \`npm ci && npm run build\`
3. **Check Environment Variables**: Ensure all required vars are set
4. **Review Deployment Logs**: Check DigitalOcean dashboard for error details

### Expected Endpoints

Once deployed, these should work:
- Health Check: \`/health\`
- API Health: \`/api/v1/health\` 
- Swagger Docs: \`/api/docs\`

### Contact Support

If issues persist:
1. Check DigitalOcean status page
2. Contact DigitalOcean support
3. Consider alternative hosting platforms
`;

    fs.writeFileSync('MANUAL_DEPLOYMENT_GUIDE.md', guide);
    this.log('Created manual deployment guide: MANUAL_DEPLOYMENT_GUIDE.md', 'success');
  }

  async run() {
    console.log('\n🔍 PowerPay Deployment Tester');
    console.log('==============================\n');

    // Test for working deployment
    const results = await this.testAllUrls();
    const workingUrls = results.filter(r => r.success);
    
    if (workingUrls.length > 0) {
      console.log('\n✅ DEPLOYMENT FOUND!');
      console.log('====================');
      workingUrls.forEach(result => {
        console.log(`🌍 ${result.url} (Status: ${result.status})`);
      });
    } else {
      console.log('\n❌ NO WORKING DEPLOYMENT FOUND');
      console.log('===============================');
      console.log('The app may not be deployed yet or deployment failed.');
      
      this.generateManualDeploymentGuide();
      
      console.log('\n📋 Next Steps:');
      console.log('1. Check DigitalOcean dashboard for deployment status');
      console.log('2. Review MANUAL_DEPLOYMENT_GUIDE.md for deployment options');
      console.log('3. Verify GitHub repository permissions');
      console.log('4. Consider alternative hosting platforms');
    }

    // Check local configuration
    console.log('\n🔧 Configuration Status:');
    console.log('========================');
    console.log(`✅ app.yaml exists: ${fs.existsSync('.do/app.yaml')}`);
    console.log(`✅ API package.json exists: ${fs.existsSync('apps/api/package.json')}`);
    console.log(`✅ nest-cli.json exists: ${fs.existsSync('apps/api/nest-cli.json')}`);
    console.log(`✅ Environment config: ${fs.existsSync('config/environment.ts')}`);
    
    return workingUrls.length > 0;
  }
}

// Run the tester
if (require.main === module) {
  const tester = new DeploymentTester();
  tester.run().then(found => {
    process.exit(found ? 0 : 1);
  });
}

module.exports = DeploymentTester;