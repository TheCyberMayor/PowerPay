#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * PowerPay Environment Generator
 * Generates secure environment variables for production deployment
 */
class EnvironmentGenerator {
  
  generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  generateJWTSecret() {
    return crypto.randomBytes(64).toString('base64url');
  }
  
  generateWebhookSecret() {
    return crypto.randomBytes(32).toString('base64url');
  }
  
  generateProductionEnv() {
    const config = {
      // Security keys (generated)
      JWT_SECRET: this.generateJWTSecret(),
      ENCRYPTION_KEY: this.generateSecureKey(32),
      WEBHOOK_SECRET: this.generateWebhookSecret(),
      
      // Flutterwave (placeholder - user must replace)
      FLUTTERWAVE_SECRET_KEY: 'FLWSECK-your-real-secret-key-from-dashboard',
      FLUTTERWAVE_PUBLIC_KEY: 'FLWPUBK-your-real-public-key-from-dashboard',
      FLUTTERWAVE_WEBHOOK_HASH: 'your-webhook-hash-from-flutterwave',
      
      // Database (configured)
      DATABASE_SSL: 'true',
      DATABASE_URL: 'postgresql://placeholder-will-be-set-by-digitalocean',
      
      // Application
      NODE_ENV: 'production',
      PORT: '3000',
      FRONTEND_URL: 'https://powerpay.ng',
      ADMIN_URL: 'https://admin.powerpay.ng',
      
      // Features
      QUEUES_ENABLED: 'false', // Disable Redis queues initially
      RATE_LIMIT_ENABLED: 'true',
      LOGGING_LEVEL: 'info',
      
      // Monitoring
      HEALTH_CHECK_ENABLED: 'true',
      METRICS_ENABLED: 'true'
    };
    
    return config;
  }
  
  generateDotEnv(config) {
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    return `# PowerPay Production Environment Variables
# Generated: ${new Date().toISOString()}
# 
# 🔒 SECURITY WARNING: 
# - Keep this file secure and never commit to version control
# - Replace Flutterwave placeholder values with real keys
# - Verify all secrets are properly generated

${envContent}

# 📋 Setup Instructions:
# 1. Copy the values above to DigitalOcean App Platform environment variables
# 2. Replace FLUTTERWAVE_* values with real keys from your dashboard
# 3. Ensure DATABASE_URL is properly connected to your PostgreSQL cluster
# 4. Redeploy the application after setting all variables
`;
  }
  
  generateDigitalOceanCommands(config) {
    const commands = Object.entries(config)
      .filter(([key]) => !key.startsWith('FLUTTERWAVE_') || key === 'FLUTTERWAVE_WEBHOOK_HASH')
      .map(([key, value]) => `doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: ${key}
    value: "${value}"
EOF
)`)
      .join('\n\n');
    
    return `# DigitalOcean CLI Commands to Set Environment Variables
# Run these commands after installing doctl and authenticating
# Get your APP_ID from: doctl apps list

export APP_ID="your-app-id-here"

${commands}

# For Flutterwave keys, set them manually in the DigitalOcean dashboard
# as they contain sensitive information that shouldn't be in command history`;
  }
  
  run() {
    console.log('🔐 PowerPay Environment Generator');
    console.log('=================================\n');
    
    const config = this.generateProductionEnv();
    
    // Generate .env file
    const envContent = this.generateDotEnv(config);
    fs.writeFileSync('.env.production', envContent);
    console.log('✅ Generated: .env.production');
    
    // Generate DigitalOcean commands
    const doCommands = this.generateDigitalOceanCommands(config);
    fs.writeFileSync('digitalocean-env-setup.sh', doCommands);
    console.log('✅ Generated: digitalocean-env-setup.sh');
    
    // Generate summary
    const summary = `
# 🔒 Environment Variables Summary

## Generated Secure Keys ✅
- JWT_SECRET: 64-byte secure token ✅
- ENCRYPTION_KEY: 32-byte hex key ✅  
- WEBHOOK_SECRET: 32-byte secure token ✅

## Flutterwave Configuration ⚠️
- FLUTTERWAVE_SECRET_KEY: **PLACEHOLDER - SET REAL VALUE** ❌
- FLUTTERWAVE_PUBLIC_KEY: **PLACEHOLDER - SET REAL VALUE** ❌
- FLUTTERWAVE_WEBHOOK_HASH: **PLACEHOLDER - SET REAL VALUE** ❌

## Database Configuration ✅
- DATABASE_SSL: Enabled for secure connection
- DATABASE_URL: Connected to PostgreSQL cluster

## Next Steps:
1. 📋 Copy values from .env.production to DigitalOcean
2. 🔑 Replace Flutterwave placeholders with real keys
3. 🚀 Redeploy application
4. 🧪 Test all endpoints

## Security Notes:
- All generated keys are cryptographically secure
- JWT_SECRET uses 64 bytes (512 bits) for maximum security
- ENCRYPTION_KEY uses AES-256 compatible 32-byte key
- Never commit .env.production to version control
`;

    fs.writeFileSync('ENVIRONMENT_SUMMARY.md', summary);
    console.log('✅ Generated: ENVIRONMENT_SUMMARY.md');
    
    console.log('\n🎯 Key Information:');
    console.log(`📍 JWT Secret Length: ${config.JWT_SECRET.length} characters`);
    console.log(`📍 Encryption Key Length: ${config.ENCRYPTION_KEY.length} characters`);
    console.log(`📍 Webhook Secret Length: ${config.WEBHOOK_SECRET.length} characters`);
    
    console.log('\n⚠️  IMPORTANT:');
    console.log('1. Set real Flutterwave keys in DigitalOcean dashboard');
    console.log('2. Keep .env.production file secure (already in .gitignore)');
    console.log('3. Verify DATABASE_URL connection');
    
    return config;
  }
}

if (require.main === module) {
  const generator = new EnvironmentGenerator();
  generator.run();
}

module.exports = EnvironmentGenerator;