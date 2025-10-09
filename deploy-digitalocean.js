#!/usr/bin/env node

/**
 * PowerPay DigitalOcean Deployment Script
 * Handles complete deployment setup and monitoring
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');

class DigitalOceanDeployment {
  constructor() {
    this.appName = 'powerpay-api';
    this.region = 'nyc1'; // New York datacenter
    this.maxRetries = 30;
    this.retryDelay = 20000; // 20 seconds
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const icons = { info: '🔄', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkDoctlInstalled() {
    try {
      execSync('doctl version', { stdio: 'pipe' });
      this.log('DigitalOcean CLI (doctl) is installed', 'success');
      return true;
    } catch (error) {
      this.log('DigitalOcean CLI (doctl) is not installed or not in PATH', 'error');
      this.log('Install with: https://docs.digitalocean.com/reference/doctl/how-to/install/', 'info');
      return false;
    }
  }

  checkAuthentication() {
    try {
      execSync('doctl account get', { stdio: 'pipe' });
      this.log('DigitalOcean authentication verified', 'success');
      return true;
    } catch (error) {
      this.log('DigitalOcean not authenticated. Run: doctl auth init', 'error');
      return false;
    }
  }

  async deployApp() {
    try {
      this.log('Creating DigitalOcean App Platform deployment...');
      
      // Create app using the app spec
      const output = execSync(`doctl apps create --spec .do/app.yaml --format ID --no-header`, { 
        encoding: 'utf8',
        cwd: process.cwd()
      }).trim();
      
      const appId = output;
      this.log(`App created with ID: ${appId}`, 'success');
      
      // Store app ID for future reference
      fs.writeFileSync('.do/app-id.txt', appId);
      
      return appId;
    } catch (error) {
      this.log(`Failed to create app: ${error.message}`, 'error');
      
      // Try to find existing app
      try {
        const apps = execSync('doctl apps list --format ID,Name --no-header', { encoding: 'utf8' });
        const appLines = apps.trim().split('\n').filter(line => line.includes('powerpay'));
        
        if (appLines.length > 0) {
          const appId = appLines[0].split(/\s+/)[0];
          this.log(`Found existing app with ID: ${appId}`, 'info');
          fs.writeFileSync('.do/app-id.txt', appId);
          return appId;
        }
      } catch (listError) {
        this.log(`Could not list existing apps: ${listError.message}`, 'warning');
      }
      
      throw error;
    }
  }

  async waitForDeployment(appId) {
    this.log(`Monitoring deployment for app ${appId}...`);
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const status = execSync(`doctl apps get ${appId} --format Status --no-header`, { 
          encoding: 'utf8' 
        }).trim();
        
        this.log(`Deployment status: ${status} (${i + 1}/${this.maxRetries})`);
        
        if (status === 'ACTIVE') {
          this.log('Deployment completed successfully!', 'success');
          
          // Get the live URL
          const url = execSync(`doctl apps get ${appId} --format LiveURL --no-header`, { 
            encoding: 'utf8' 
          }).trim();
          
          this.log(`App is live at: ${url}`, 'success');
          return { success: true, url: url };
        } else if (status === 'ERROR' || status === 'CANCELED') {
          this.log(`Deployment failed with status: ${status}`, 'error');
          return { success: false, status: status };
        }
        
        // Still deploying, wait before next check
        if (i < this.maxRetries - 1) {
          await this.sleep(this.retryDelay);
        }
        
      } catch (error) {
        this.log(`Error checking status: ${error.message}`, 'warning');
        await this.sleep(this.retryDelay);
      }
    }
    
    return { success: false, status: 'TIMEOUT' };
  }

  async testEndpoints(url) {
    const endpoints = [
      { name: 'Health Check', path: '/health' },
      { name: 'API Health', path: '/api/v1/health' },
      { name: 'API Root', path: '/api/v1' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      const testUrl = `${url}${endpoint.path}`;
      this.log(`Testing: ${endpoint.name} - ${testUrl}`);
      
      try {
        const result = await this.makeRequest(testUrl);
        results.push({
          name: endpoint.name,
          url: testUrl,
          success: result.success,
          status: result.status,
          data: result.data
        });
        
        if (result.success) {
          this.log(`✅ ${endpoint.name}: OK (${result.status})`, 'success');
        } else {
          this.log(`❌ ${endpoint.name}: ${result.error}`, 'error');
        }
      } catch (error) {
        this.log(`❌ ${endpoint.name}: ${error.message}`, 'error');
        results.push({
          name: endpoint.name,
          url: testUrl,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  makeRequest(url) {
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

  async getLogs(appId) {
    try {
      this.log('Fetching deployment logs...');
      const logs = execSync(`doctl apps logs ${appId} --type build --follow=false`, { 
        encoding: 'utf8',
        timeout: 10000
      });
      
      console.log('\n📋 BUILD LOGS:');
      console.log('================');
      console.log(logs);
      return logs;
    } catch (error) {
      this.log(`Could not fetch logs: ${error.message}`, 'warning');
      return null;
    }
  }

  async run() {
    console.log('\n🚀 PowerPay DigitalOcean Deployment');
    console.log('====================================\n');

    // Step 1: Check prerequisites
    if (!this.checkDoctlInstalled() || !this.checkAuthentication()) {
      console.log('\n❌ Prerequisites not met. Please install and authenticate doctl first.');
      return false;
    }

    try {
      // Step 2: Push latest changes
      this.log('Pushing latest changes to GitHub...');
      execSync('git add .', { stdio: 'inherit' });
      
      try {
        execSync('git commit -m "Fix DigitalOcean deployment configuration"', { stdio: 'inherit' });
      } catch {
        this.log('No new changes to commit', 'info');
      }
      
      execSync('git push origin master', { stdio: 'inherit' });
      this.log('Changes pushed successfully', 'success');

      // Step 3: Deploy or update app
      let appId;
      if (fs.existsSync('.do/app-id.txt')) {
        appId = fs.readFileSync('.do/app-id.txt', 'utf8').trim();
        this.log(`Using existing app ID: ${appId}`, 'info');
        
        // Update existing app
        try {
          execSync(`doctl apps update ${appId} --spec .do/app.yaml`, { stdio: 'inherit' });
          this.log('App updated successfully', 'success');
        } catch (error) {
          this.log(`Update failed, will try to create new app: ${error.message}`, 'warning');
          appId = await this.deployApp();
        }
      } else {
        appId = await this.deployApp();
      }

      // Step 4: Monitor deployment
      const deploymentResult = await this.waitForDeployment(appId);
      
      if (deploymentResult.success) {
        // Step 5: Test endpoints
        this.log('Testing deployed endpoints...', 'info');
        const testResults = await this.testEndpoints(deploymentResult.url);
        
        // Step 6: Show summary
        console.log('\n🎯 DEPLOYMENT SUMMARY');
        console.log('======================');
        console.log(`✅ App ID: ${appId}`);
        console.log(`✅ Status: ACTIVE`);
        console.log(`✅ URL: ${deploymentResult.url}`);
        
        console.log('\n📋 Endpoint Tests:');
        testResults.forEach(result => {
          console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.url}`);
        });
        
        console.log('\n🔒 Next Steps:');
        console.log('1. Set environment variables in DigitalOcean dashboard');
        console.log('2. Add real Flutterwave keys');
        console.log('3. Test payment integration');
        
        return true;
      } else {
        this.log('Deployment failed or timed out', 'error');
        
        // Get logs for troubleshooting
        await this.getLogs(appId);
        
        console.log('\n❌ DEPLOYMENT FAILED');
        console.log('=====================');
        console.log(`Status: ${deploymentResult.status}`);
        console.log('Check the logs above for details');
        
        return false;
      }

    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      console.error('Full error:', error);
      return false;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const deployment = new DigitalOceanDeployment();
  deployment.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Deployment script failed:', error);
    process.exit(1);
  });
}

module.exports = DigitalOceanDeployment;