#!/usr/bin/env node
/**
 * PowerPay Deployment Monitor
 * 
 * Simple script to check deployment status
 */

const https = require('https');

console.log('🚀 PowerPay Deployment Monitor');
console.log('===============================');

function checkHealth(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          resolve({ error: 'Invalid JSON response', raw: data });
        }
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(10000, () => {
      reject(new Error('Request timeout'));
    });
  });
}

async function monitorDeployment() {
  const healthUrl = 'https://powerpay-xyz.ondigitalocean.app/health';
  
  console.log('\n🔄 Checking deployment status...');
  console.log(`📍 Health URL: ${healthUrl}`);
  
  try {
    const result = await checkHealth(healthUrl);
    
    if (result.error) {
      console.log('❌ Deployment not ready yet');
      console.log(`   Error: ${result.error}`);
      if (result.raw) {
        console.log(`   Response: ${result.raw.substring(0, 200)}...`);
      }
    } else {
      console.log('✅ Deployment successful!');
      console.log(`   Status: ${result.status}`);
      console.log(`   Timestamp: ${result.timestamp}`);
      if (result.deployment) {
        console.log(`   Version: ${result.deployment}`);
      }
    }
    
  } catch (error) {
    console.log('⏳ Deployment still in progress...');
    console.log(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('   💡 The domain might not be ready yet');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   💡 The service is starting up');
    }
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. ✅ Code pushed successfully');
  console.log('2. 🔄 DigitalOcean build in progress');
  console.log('3. ⚠️  Set real environment variables in DigitalOcean dashboard:');
  console.log('   - FLUTTERWAVE_SECRET_KEY (your real key)');
  console.log('   - FLUTTERWAVE_PUBLIC_KEY (your real key)');
  console.log('   - JWT_SECRET, ENCRYPTION_KEY, WEBHOOK_SECRET');
  console.log('4. 🧪 Test the health endpoint when ready');
  
  console.log('\n🔍 Manual check:');
  console.log(`   Visit: ${healthUrl}`);
  console.log('   Expected: {"status":"OK","timestamp":"...","deployment":"PowerPay v1.0 - Flutterwave Integration Only"}');
}

// Run the monitor
monitorDeployment();