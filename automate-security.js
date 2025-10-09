#!/usr/bin/env node
/**
 * PowerPay Security Automation Script
 * 
 * This script automates the security fixes and deployment updates needed
 * after commenting out Interswitch and securing API keys.
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 PowerPay Security Automation Script');
console.log('=====================================');

// =============================================================================
// 🛡️ SECURITY FUNCTIONS
// =============================================================================

function generateSecureKey(length = 64) {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

function generateFlutterwaveKey(type = 'secret') {
  const crypto = require('crypto');
  const prefix = type === 'secret' ? 'FLWSECK' : 'FLWPUBK';
  const suffix = crypto.randomBytes(16).toString('hex');
  return `${prefix}-your-flutterwave-${type}-key-${suffix}`;
}

function replaceInFile(filePath, searchValue, replaceValue) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchValue)) {
      content = content.replace(new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceValue);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// =============================================================================
// 🔧 CONFIGURATION UPDATES
// =============================================================================

function updateEnvironmentFiles() {
  console.log('\n🔄 Updating environment configuration files...');
  
  const configFiles = [
    'config/environment.js',
    'config/environment.ts'
  ];
  
  // Replace any real Flutterwave keys with placeholders
  const realKeyPatterns = [
    /FLWSECK-[a-zA-Z0-9\-]+/g,
    /FLWPUBK-[a-zA-Z0-9\-]+/g
  ];
  
  for (const file of configFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Replace real keys with safe placeholders
      content = content.replace(realKeyPatterns[0], 'FLWSECK-your-flutterwave-secret-key');
      content = content.replace(realKeyPatterns[1], 'FLWPUBK-your-flutterwave-public-key');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Secured ${file}`);
    }
  }
}

function updateDigitalOceanConfig() {
  console.log('\n🌊 Updating DigitalOcean configuration...');
  
  const doConfigFile = path.join(process.cwd(), '.do', 'app.yaml');
  
  if (fs.existsSync(doConfigFile)) {
    let content = fs.readFileSync(doConfigFile, 'utf8');
    
    // Remove Interswitch environment variables
    const interswitchLines = [
      /.*INTERSWITCH_CLIENT_ID.*\n/g,
      /.*INTERSWITCH_CLIENT_SECRET.*\n/g
    ];
    
    interswitchLines.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    fs.writeFileSync(doConfigFile, content, 'utf8');
    console.log('✅ Updated .do/app.yaml');
  }
  
  // Update API-only config too
  const apiOnlyConfig = path.join(process.cwd(), '.do', 'app-api-only.yaml');
  if (fs.existsSync(apiOnlyConfig)) {
    let content = fs.readFileSync(apiOnlyConfig, 'utf8');
    
    const interswitchLines = [
      /.*INTERSWITCH_CLIENT_ID.*\n/g,
      /.*INTERSWITCH_CLIENT_SECRET.*\n/g
    ];
    
    interswitchLines.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    fs.writeFileSync(apiOnlyConfig, content, 'utf8');
    console.log('✅ Updated .do/app-api-only.yaml');
  }
}

function updateDocumentation() {
  console.log('\n📚 Updating documentation...');
  
  const docFiles = [
    'README.md',
    '.github/copilot-instructions.md',
    'config/README.md'
  ];
  
  docFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update payment gateway references
      content = content.replace(/Flutterwave, Interswitch/g, 'Flutterwave (primary)');
      content = content.replace(/Flutterwave,?\s*Interswitch/g, 'Flutterwave');
      content = content.replace(/INTERSWITCH_\*\s*keys/g, 'INTERSWITCH_* keys (temporarily disabled)');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${file}`);
    }
  });
}

// =============================================================================
// 🚀 GIT AUTOMATION
// =============================================================================

function runGitCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { execSync } = require('child_process');
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return null;
  }
}

function commitChanges() {
  const { execSync } = require('child_process');
  
  try {
    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      execSync('git add .', { stdio: 'inherit' });
      
      const commitMessage = `Secure configuration and disable Interswitch temporarily

- Replaced real Flutterwave keys with secure placeholders
- Commented out Interswitch payment gateway integration
- Updated environment configuration interfaces
- Modified payment entities to use Flutterwave only
- Updated database constraints for single gateway
- Cleaned DigitalOcean deployment configurations
- Updated documentation to reflect current state

Security improvements:
- No real API keys in tracked files
- Placeholder values only in version control
- Production keys to be set via DigitalOcean dashboard`;

      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log('✅ Changes committed successfully');
      return true;
    } else {
      console.log('✅ No changes to commit');
      return true;
    }
  } catch (error) {
    console.error('❌ Git commit failed:', error.message);
    return false;
  }
}

// =============================================================================
// 🎯 DEPLOYMENT INSTRUCTIONS
// =============================================================================

function generateDeploymentInstructions() {
  console.log('\n📋 Generating deployment instructions...');
  
  const instructions = `
# 🚀 PowerPay Deployment Instructions

## ✅ Completed Automatically
- ✅ Secured environment configuration files
- ✅ Commented out Interswitch integration
- ✅ Updated payment entities and database schema
- ✅ Cleaned deployment configurations
- ✅ Updated documentation

## 🔑 Manual Steps Required

### 1. Set Real Keys in DigitalOcean (REQUIRED)
Go to your DigitalOcean App Platform dashboard and set these environment variables:

\`\`\`
FLUTTERWAVE_SECRET_KEY=YOUR_REAL_FLUTTERWAVE_SECRET_KEY
FLUTTERWAVE_PUBLIC_KEY=YOUR_REAL_FLUTTERWAVE_PUBLIC_KEY
JWT_SECRET=${generateSecureKey(32)}
ENCRYPTION_KEY=${generateSecureKey(16)}
WEBHOOK_SECRET=${generateSecureKey(32)}
\`\`\`

### 2. Deploy Application
\`\`\`bash
git push origin master
\`\`\`

### 3. Monitor Deployment
- Check DigitalOcean App Platform build logs
- Verify application starts successfully
- Test payment functionality with Flutterwave only

### 4. Test Payment Flow
- Create a test transaction
- Verify Flutterwave integration works
- Confirm no Interswitch references cause errors

## 🛡️ Security Notes
- ✅ No real API keys are stored in git
- ✅ All sensitive data is in DigitalOcean environment variables
- ✅ Placeholder values are safe to commit

## 🔄 To Re-enable Interswitch Later
1. Uncomment Interswitch code in the configuration files
2. Add Interswitch environment variables
3. Update database schema to include 'interswitch' in gateway constraint
4. Test integration thoroughly

---
Generated on: ${new Date().toISOString()}
`;

  fs.writeFileSync('DEPLOYMENT_INSTRUCTIONS.md', instructions, 'utf8');
  console.log('✅ Created DEPLOYMENT_INSTRUCTIONS.md');
}

// =============================================================================
// 🚀 MAIN EXECUTION
// =============================================================================

async function main() {
  console.log('\n🚀 Starting automation...');
  
  try {
    // 1. Security updates
    updateEnvironmentFiles();
    
    // 2. Configuration updates
    updateDigitalOceanConfig();
    
    // 3. Documentation updates
    updateDocumentation();
    
    // 4. Generate deployment instructions
    generateDeploymentInstructions();
    
    // 5. Commit all changes
    const commitSuccess = commitChanges();
    
    if (commitSuccess) {
      console.log('\n🎉 Automation completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. 🔑 Set real API keys in DigitalOcean dashboard');
      console.log('2. 🚀 Deploy: git push origin master');
      console.log('3. 🧪 Test the application');
      console.log('4. 📖 Read DEPLOYMENT_INSTRUCTIONS.md for details');
    } else {
      console.log('\n⚠️  Automation completed with warnings');
      console.log('   Please review the errors above');
    }
    
  } catch (error) {
    console.error('\n❌ Automation failed:', error.message);
    console.log('\n🔧 Manual recovery steps:');
    console.log('1. Review the error messages above');
    console.log('2. Fix any file permission or syntax issues');
    console.log('3. Run: git status to see current state');
    console.log('4. Commit changes manually if needed');
  }
}

// Run the automation
if (require.main === module) {
  main();
}

module.exports = {
  updateEnvironmentFiles,
  updateDigitalOceanConfig,
  updateDocumentation,
  commitChanges,
  generateDeploymentInstructions
};