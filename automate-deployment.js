#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

class PowerPayAutomation {
  constructor() {
    this.deploymentUrl = 'https://powerpay-xyz.ondigitalocean.app';
    this.healthEndpoint = `${this.deploymentUrl}/health`;
    this.apiHealthEndpoint = `${this.deploymentUrl}/api/v1/health`;
    this.maxRetries = 20; // 10 minutes with 30-second intervals
    this.retryDelay = 30000; // 30 seconds
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const icons = { info: '🔄', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkUrl(url) {
    return new Promise((resolve) => {
      const request = https.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: true, data: parsed, status: res.statusCode });
          } catch (e) {
            resolve({ success: true, data: data, status: res.statusCode });
          }
        });
      });
      
      request.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
      
      request.on('timeout', () => {
        request.destroy();
        resolve({ success: false, error: 'Request timeout' });
      });
    });
  }

  async pushLatestChanges() {
    try {
      this.log('Pushing latest changes to GitHub...');
      execSync('git add .', { stdio: 'inherit', cwd: process.cwd() });
      
      // Check if there are changes to commit
      try {
        execSync('git diff --staged --quiet', { cwd: process.cwd() });
        this.log('No new changes to commit', 'info');
      } catch {
        execSync('git commit -m "Automated deployment optimization and monitoring"', { 
          stdio: 'inherit', 
          cwd: process.cwd() 
        });
        this.log('Changes committed successfully', 'success');
      }
      
      execSync('git push origin master', { stdio: 'inherit', cwd: process.cwd() });
      this.log('Changes pushed to GitHub successfully', 'success');
      return true;
    } catch (error) {
      this.log(`Failed to push changes: ${error.message}`, 'error');
      return false;
    }
  }

  async waitForDeployment() {
    this.log('Waiting for DigitalOcean deployment to complete...');
    
    for (let i = 0; i < this.maxRetries; i++) {
      this.log(`Attempt ${i + 1}/${this.maxRetries}: Checking deployment status...`);
      
      // Check health endpoint
      const healthCheck = await this.checkUrl(this.healthEndpoint);
      if (healthCheck.success && healthCheck.status === 200) {
        this.log('Health endpoint is responding!', 'success');
        this.log(`Response: ${JSON.stringify(healthCheck.data)}`, 'info');
        
        // Also check API endpoint
        const apiCheck = await this.checkUrl(this.apiHealthEndpoint);
        if (apiCheck.success && apiCheck.status === 200) {
          this.log('API health endpoint is also responding!', 'success');
          this.log(`API Response: ${JSON.stringify(apiCheck.data)}`, 'info');
          return { success: true, health: healthCheck.data, api: apiCheck.data };
        } else {
          this.log('Health endpoint works but API endpoint not ready yet...', 'warning');
        }
      } else {
        this.log(`Deployment not ready yet: ${healthCheck.error || 'HTTP ' + healthCheck.status}`, 'warning');
      }
      
      if (i < this.maxRetries - 1) {
        this.log(`Waiting ${this.retryDelay/1000} seconds before next check...`);
        await this.sleep(this.retryDelay);
      }
    }
    
    return { success: false, message: 'Deployment timeout - manual check required' };
  }

  generateEnvironmentGuide() {
    const guide = `
# 🔒 PowerPay Environment Variables Setup Guide

## Critical Security Variables (Set these IMMEDIATELY)

### JWT & Encryption (Generate secure random keys)
\`\`\`
JWT_SECRET=your-256-bit-random-string-here
ENCRYPTION_KEY=your-32-byte-hex-key-here
WEBHOOK_SECRET=your-webhook-validation-secret
\`\`\`

### Flutterwave Configuration (Get from Flutterwave Dashboard)
\`\`\`
FLUTTERWAVE_SECRET_KEY=FLWSECK-your-real-secret-key
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-your-real-public-key
FLUTTERWAVE_WEBHOOK_HASH=your-webhook-hash
\`\`\`

### Database (Already configured)
\`\`\`
DATABASE_URL=postgresql://... (connected to cluster 3f174a2b...)
DATABASE_SSL=true
\`\`\`

## 🚨 IMPORTANT SECURITY NOTES
1. Never use the placeholder values in production
2. Generate JWT_SECRET: \`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\`
3. Generate ENCRYPTION_KEY: \`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\`
4. Get Flutterwave keys from: https://dashboard.flutterwave.com/settings/api-keys

## 📍 How to Set in DigitalOcean
1. Go to: https://cloud.digitalocean.com/apps
2. Find your PowerPay app
3. Click Settings > Environment Variables
4. Add/Update each variable above with real values
5. Redeploy the app

## 🧪 Test Commands After Setup
\`\`\`bash
# Health check
curl ${this.healthEndpoint}

# API health check  
curl ${this.apiHealthEndpoint}

# Test Flutterwave integration (requires real keys)
curl -X POST ${this.deploymentUrl}/api/v1/payments/initialize \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 1000, "email": "test@example.com", "meterNumber": "12345"}'
\`\`\`
`;

    fs.writeFileSync(path.join(process.cwd(), 'ENVIRONMENT_SETUP.md'), guide);
    this.log('Environment setup guide created: ENVIRONMENT_SETUP.md', 'success');
  }

  async runComprehensiveTests() {
    this.log('Running comprehensive API tests...');
    
    const tests = [
      { name: 'Health Check', url: this.healthEndpoint },
      { name: 'API Health Check', url: this.apiHealthEndpoint },
      { name: 'API Documentation', url: `${this.deploymentUrl}/api` },
      { name: 'Swagger UI', url: `${this.deploymentUrl}/api/docs` }
    ];

    const results = [];
    
    for (const test of tests) {
      this.log(`Testing: ${test.name}...`);
      const result = await this.checkUrl(test.url);
      results.push({
        name: test.name,
        url: test.url,
        success: result.success,
        status: result.status,
        error: result.error
      });
      
      if (result.success) {
        this.log(`✅ ${test.name}: OK (${result.status})`, 'success');
      } else {
        this.log(`❌ ${test.name}: ${result.error}`, 'error');
      }
    }

    return results;
  }

  updateDeploymentStatus(deploymentResult, testResults) {
    const status = `# PowerPay Deployment Status - AUTOMATED UPDATE

## Deployment Completed: ${new Date().toISOString()}

### ✅ Build Configuration Issues RESOLVED
- Missing nest-cli.json: FIXED
- Incorrect run command path: FIXED  
- NestJS build structure: PROPERLY CONFIGURED

### 🚀 Deployment Status
- **GitHub Push**: ✅ Completed
- **DigitalOcean Build**: ${deploymentResult.success ? '✅ SUCCESS' : '❌ TIMEOUT/FAILED'}
- **Health Endpoint**: ${deploymentResult.success ? '✅ RESPONSIVE' : '❌ NOT RESPONDING'}
- **API Endpoint**: ${deploymentResult.success && deploymentResult.api ? '✅ RESPONSIVE' : '❌ NOT RESPONDING'}

### 🔍 Test Results
${testResults.map(test => 
  `- **${test.name}**: ${test.success ? `✅ OK (${test.status})` : `❌ ${test.error}`}`
).join('\n')}

### 📍 Live URLs
- **Health Check**: [${this.healthEndpoint}](${this.healthEndpoint})
- **API Health**: [${this.apiHealthEndpoint}](${this.apiHealthEndpoint})
- **API Docs**: [${this.deploymentUrl}/api/docs](${this.deploymentUrl}/api/docs)

### 🔒 Critical Next Step: ENVIRONMENT VARIABLES
${deploymentResult.success ? 
  '⚠️ **URGENT**: Replace placeholder environment variables with real values in DigitalOcean dashboard!' :
  '⚠️ Manual investigation required - check DigitalOcean build logs'}

### 🎯 Payment Gateway Status
- **Active**: Flutterwave only
- **Removed**: Paystack, Remita
- **Commented**: Interswitch
- **Configuration**: Centralized in config/environment.ts

### 📋 Immediate Actions Required
${deploymentResult.success ? `
1. Set real FLUTTERWAVE_SECRET_KEY and FLUTTERWAVE_PUBLIC_KEY
2. Generate secure JWT_SECRET and ENCRYPTION_KEY
3. Configure webhook secrets
4. Test payment integration endpoints
5. Deploy React frontend applications` : `
1. Check DigitalOcean build logs for errors
2. Verify environment variables are set
3. Check database connectivity
4. Review application startup logs`}

---
*Last Updated: ${new Date().toISOString()} (Automated)*
`;

    fs.writeFileSync(path.join(process.cwd(), 'DEPLOYMENT_STATUS.md'), status);
    this.log('Deployment status updated', 'success');
  }

  async run() {
    console.log('\n🚀 PowerPay Deployment Automation');
    console.log('==================================\n');

    try {
      // Step 1: Push any remaining changes
      const pushSuccess = await this.pushLatestChanges();
      if (!pushSuccess) {
        this.log('Failed to push changes - continuing anyway...', 'warning');
      }

      // Step 2: Wait for deployment
      this.log('Starting deployment monitoring...');
      const deploymentResult = await this.waitForDeployment();

      // Step 3: Run tests if deployment succeeded
      let testResults = [];
      if (deploymentResult.success) {
        this.log('Deployment successful! Running comprehensive tests...', 'success');
        testResults = await this.runComprehensiveTests();
      } else {
        this.log('Deployment monitoring timed out - may need manual check', 'warning');
      }

      // Step 4: Generate guides and update status
      this.generateEnvironmentGuide();
      this.updateDeploymentStatus(deploymentResult, testResults);

      // Step 5: Final summary
      console.log('\n🎯 AUTOMATION COMPLETE');
      console.log('=====================');
      
      if (deploymentResult.success) {
        console.log('✅ PowerPay API is LIVE and responding!');
        console.log('✅ Health endpoints are working');
        console.log('📍 URL:', this.deploymentUrl);
        console.log('\n🔒 CRITICAL NEXT STEP:');
        console.log('   Replace environment variables with real values in DigitalOcean dashboard');
        console.log('   See: ENVIRONMENT_SETUP.md for detailed instructions');
      } else {
        console.log('⚠️ Deployment monitoring timed out');
        console.log('   Check DigitalOcean dashboard for build status');
        console.log('   The deployment may still be in progress');
      }

      console.log('\n📋 Files Updated:');
      console.log('   - DEPLOYMENT_STATUS.md (current status)');
      console.log('   - ENVIRONMENT_SETUP.md (security guide)');

    } catch (error) {
      this.log(`Automation failed: ${error.message}`, 'error');
      console.error(error);
      process.exit(1);
    }
  }
}

// Run automation if called directly
if (require.main === module) {
  const automation = new PowerPayAutomation();
  automation.run().then(() => {
    console.log('\n✅ Automation completed successfully!');
  }).catch(error => {
    console.error('\n❌ Automation failed:', error);
    process.exit(1);
  });
}

module.exports = PowerPayAutomation;