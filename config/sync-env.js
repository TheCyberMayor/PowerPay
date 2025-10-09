#!/usr/bin/env node
/**
 * PowerPay Environment Sync Script
 * 
 * This script syncs environment variables from config/environment.js
 * to DigitalOcean app.yaml and other configuration files.
 * 
 * Usage: node config/sync-env.js
 */

const fs = require('fs');
const path = require('path');
const { environment, generateSecureKeys } = require('./environment.js');

console.log('🔄 PowerPay Environment Sync Script');
console.log('=====================================');

// =============================================================================
// 🔧 HELPER FUNCTIONS
// =============================================================================

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    return false;
  }
}

function updateDigitalOceanConfig() {
  console.log('\n📱 Updating DigitalOcean app.yaml...');
  
  const appYamlPath = path.join(__dirname, '..', '.do', 'app.yaml');
  let content = readFile(appYamlPath);
  
  if (!content) return false;
  
  // Update environment variables in the envs section
  const envVars = [
    'NODE_ENV',
    'DATABASE_SSL', 
    'QUEUES_ENABLED',
    'JWT_SECRET',
    'FLUTTERWAVE_SECRET_KEY',
    'FLUTTERWAVE_PUBLIC_KEY',
    'INTERSWITCH_CLIENT_ID',
    'INTERSWITCH_CLIENT_SECRET',
    'TERMII_API_KEY',
    'SENDGRID_API_KEY',
    'ENCRYPTION_KEY',
    'WEBHOOK_SECRET'
  ];
  
  // Find the envs section and replace/add variables
  const envsMatch = content.match(/(  envs:\n)([\s\S]*?)(?=\n\n|\n#|$)/);
  
  if (envsMatch) {
    let newEnvs = '  envs:\n';
    
    // Always include these core variables
    newEnvs += `  - key: NODE_ENV\n    value: production\n`;
    newEnvs += `  - key: DATABASE_URL\n    value: "postgresql://placeholder"\n`;
    newEnvs += `  - key: DATABASE_SSL\n    value: "true"\n`;
    newEnvs += `  - key: QUEUES_ENABLED\n    value: "false"\n`;
    
    // Add environment variables from central config
    for (const key of envVars) {
      if (environment[key] && key !== 'NODE_ENV') {
        newEnvs += `  - key: ${key}\n    value: ${environment[key]}\n`;
      }
    }
    
    content = content.replace(envsMatch[0], newEnvs);
  }
  
  return writeFile(appYamlPath, content);
}

function updateEnvExample() {
  console.log('\n📄 Updating .env.example...');
  
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  let content = readFile(envExamplePath);
  
  if (!content) return false;
  
  // Update specific values while preserving structure
  for (const [key, value] of Object.entries(environment)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`);
    }
  }
  
  return writeFile(envExamplePath, content);
}

function generateNewKeys() {
  console.log('\n🔑 Generate New Secure Keys');
  console.log('============================');
  
  const answer = require('readline-sync').question(
    'Do you want to generate new secure keys? (y/N): '
  );
  
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    const newKeys = generateSecureKeys();
    
    console.log('\n🔐 Generated secure keys:');
    console.log('Copy these to your config/environment.js file:');
    console.log('');
    
    for (const [key, value] of Object.entries(newKeys)) {
      console.log(`${key}: "${value}",`);
    }
    
    console.log('\n⚠️  IMPORTANT: Update config/environment.js with these keys, then run this script again!');
  }
}

function displayMissingKeys() {
  console.log('\n🔍 Checking for Missing Keys');
  console.log('=============================');
  
  const placeholderKeys = [];
  const requiredKeys = [
    'JWT_SECRET',
    'FLUTTERWAVE_SECRET_KEY',
    'FLUTTERWAVE_PUBLIC_KEY'
  ];
  
  for (const [key, value] of Object.entries(environment)) {
    if (typeof value === 'string' && (
      value.includes('your_') || 
      value.includes('change-this') ||
      value.includes('your-') ||
      value === 'SuperSecurePassword123!'
    )) {
      placeholderKeys.push(key);
    }
  }
  
  if (placeholderKeys.length > 0) {
    console.log('⚠️  Keys with placeholder values:');
    placeholderKeys.forEach(key => {
      const isRequired = requiredKeys.includes(key) ? '🚨 REQUIRED' : '📝 Optional';
      console.log(`   - ${key} ${isRequired}`);
    });
  } else {
    console.log('✅ All keys appear to have real values');
  }
  
  return placeholderKeys;
}

// =============================================================================
// 🚀 MAIN EXECUTION
// =============================================================================

function main() {
  console.log('Starting environment sync...\n');
  
  // Check for missing keys first
  const missingKeys = displayMissingKeys();
  
  if (missingKeys.length > 0) {
    console.log('\n⚠️  Some keys need to be updated in config/environment.js');
    console.log('   Edit config/environment.js with your real keys, then run this script again.');
    
    // Offer to generate secure keys
    try {
      generateNewKeys();
    } catch (error) {
      console.log('\n💡 To generate secure keys, install readline-sync:');
      console.log('   npm install readline-sync');
    }
    
    return;
  }
  
  // Update configuration files
  console.log('\n🔄 Syncing configuration files...');
  
  let success = true;
  
  if (!updateDigitalOceanConfig()) success = false;
  if (!updateEnvExample()) success = false;
  
  if (success) {
    console.log('\n✅ Environment sync completed successfully!');
    console.log('   All configuration files have been updated.');
    console.log('   You can now commit and deploy your changes.');
  } else {
    console.log('\n❌ Some files could not be updated.');
    console.log('   Please check the errors above and try again.');
  }
  
  console.log('\n📖 Next steps:');
  console.log('   1. Review the updated files');
  console.log('   2. Commit your changes: git add . && git commit -m "Update environment configuration"');
  console.log('   3. Deploy: git push origin master');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  updateDigitalOceanConfig,
  updateEnvExample,
  generateSecureKeys,
  displayMissingKeys
};