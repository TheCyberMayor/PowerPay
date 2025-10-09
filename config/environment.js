/**
 * PowerPay Environment Configuration
 * 
 * This is the central configuration file for all environment variables.
 * Update your keys here and all other files will inherit from this source.
 * 
 * IMPORTANT: Keep this file secure and never commit real production keys to version control!
 */

const environment = {
  // =============================================================================
  // 🔐 SECURITY & AUTHENTICATION
  // =============================================================================
  JWT_SECRET: "your-super-secure-jwt-secret-key-change-this-in-production",
  JWT_EXPIRES_IN: "24h",
  JWT_REFRESH_SECRET: "your-super-secure-refresh-secret-key-change-this-too", 
  JWT_REFRESH_EXPIRES_IN: "7d",
  ENCRYPTION_KEY: "your-32-character-encryption-key", // Must be exactly 32 characters
  SESSION_SECRET: "your-session-secret-key-for-express-sessions",
  WEBHOOK_SECRET: "your-webhook-secret-for-payment-callbacks",
  BCRYPT_ROUNDS: "12",

  // =============================================================================
  // 💳 PAYMENT GATEWAYS
  // =============================================================================
  
  // Flutterwave (Primary)
  FLUTTERWAVE_SECRET_KEY: "FLWSECK-your-flutterwave-secret-key",
  FLUTTERWAVE_PUBLIC_KEY: "FLWPUBK-your-flutterwave-public-key",
  
  // Interswitch
  INTERSWITCH_CLIENT_ID: "your_interswitch_client_id",
  INTERSWITCH_CLIENT_SECRET: "your_interswitch_client_secret",

  // =============================================================================
  // ⚡ DISCO API INTEGRATIONS
  // =============================================================================
  
  // Ikeja Electric
  IKEJA_ELECTRIC_API_KEY: "your_ikeja_electric_api_key",
  IKEJA_ELECTRIC_BASE_URL: "https://api.ikejaelectric.com",
  
  // Eko Disco
  EKO_DISCO_API_KEY: "your_eko_disco_api_key", 
  EKO_DISCO_BASE_URL: "https://api.ekoelectricity.com",
  
  // Abuja Disco
  ABUJA_DISCO_API_KEY: "your_abuja_disco_api_key",
  ABUJA_DISCO_BASE_URL: "https://api.abujaelectricity.com",

  // =============================================================================
  // 📱 NOTIFICATION SERVICES
  // =============================================================================
  
  // Termii SMS
  TERMII_API_KEY: "your_termii_api_key",
  TERMII_SENDER_ID: "PowerPay",
  
  // SendGrid Email
  SENDGRID_API_KEY: "your_sendgrid_api_key",
  SENDGRID_FROM_EMAIL: "noreply@powerpay.ng",
  SENDGRID_FROM_NAME: "PowerPay",
  
  // Firebase Push Notifications
  FIREBASE_PROJECT_ID: "your_firebase_project_id",
  FIREBASE_PRIVATE_KEY: "your_firebase_private_key",
  FIREBASE_CLIENT_EMAIL: "your_firebase_client_email",

  // =============================================================================
  // 🔍 BVN VERIFICATION
  // =============================================================================
  BVN_VERIFICATION_API_KEY: "your_bvn_verification_api_key",
  BVN_VERIFICATION_BASE_URL: "https://api.bvnverification.com",

  // =============================================================================
  // 👨‍💼 ADMIN CONFIGURATION
  // =============================================================================
  SUPER_ADMIN_EMAIL: "admin@powerpay.ng",
  SUPER_ADMIN_PASSWORD: "SuperSecurePassword123!", // Change this immediately!

  // =============================================================================
  // 🛠️ OPTIONAL SERVICES
  // =============================================================================
  
  // AWS (Optional - for file uploads)
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "your_aws_access_key",
  AWS_SECRET_ACCESS_KEY: "your_aws_secret_key", 
  AWS_S3_BUCKET: "powerpay-documents",
  
  // Monitoring (Optional)
  SENTRY_DSN: "your_sentry_dsn",
  NEW_RELIC_LICENSE_KEY: "your_new_relic_license_key",

  // =============================================================================
  // 📊 SYSTEM CONFIGURATION
  // =============================================================================
  NODE_ENV: "production",
  PORT: "3000",
  DATABASE_SSL: "true",
  QUEUES_ENABLED: "false",
  RATE_LIMIT_WINDOW_MS: "900000",
  RATE_LIMIT_MAX_REQUESTS: "100",
  LOG_LEVEL: "debug",
  LOG_FILE_PATH: "logs/app.log"
};

// =============================================================================
// 🔧 HELPER FUNCTIONS
// =============================================================================

/**
 * Get environment variable with validation
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @param {boolean} required - Whether this variable is required
 */
function getEnvVar(key, defaultValue = null, required = false) {
  const value = process.env[key] || environment[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set!`);
  }
  
  if (value && value.includes('your_') || value.includes('change-this')) {
    console.warn(`⚠️  WARNING: ${key} appears to be using a placeholder value!`);
  }
  
  return value;
}

/**
 * Validate all required environment variables
 */
function validateEnvironment() {
  const required = [
    'JWT_SECRET',
    'FLUTTERWAVE_SECRET_KEY', 
    'FLUTTERWAVE_PUBLIC_KEY',
    'ENCRYPTION_KEY'
  ];
  
  const missing = [];
  
  for (const key of required) {
    try {
      getEnvVar(key, null, true);
    } catch (error) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  console.log('✅ All required environment variables are configured');
  return true;
}

/**
 * Generate secure random keys
 */
function generateSecureKeys() {
  const crypto = require('crypto');
  
  return {
    JWT_SECRET: crypto.randomBytes(64).toString('hex'),
    JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('hex'),
    ENCRYPTION_KEY: crypto.randomBytes(16).toString('hex'), // 32 chars
    SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
    WEBHOOK_SECRET: crypto.randomBytes(32).toString('hex')
  };
}

// =============================================================================
// 🚀 EXPORTS
// =============================================================================

module.exports = {
  environment,
  getEnvVar,
  validateEnvironment,
  generateSecureKeys,
  
  // Quick access to common configs
  database: {
    url: getEnvVar('DATABASE_URL'),
    ssl: getEnvVar('DATABASE_SSL') === 'true'
  },
  
  redis: {
    host: getEnvVar('REDIS_HOST', 'localhost'),
    port: getEnvVar('REDIS_PORT', '6379'),
    password: getEnvVar('REDIS_PASSWORD', '')
  },
  
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d')
  },
  
  flutterwave: {
    secretKey: getEnvVar('FLUTTERWAVE_SECRET_KEY'),
    publicKey: getEnvVar('FLUTTERWAVE_PUBLIC_KEY')
  },
  
  notifications: {
    termii: {
      apiKey: getEnvVar('TERMII_API_KEY'),
      senderId: getEnvVar('TERMII_SENDER_ID', 'PowerPay')
    },
    sendgrid: {
      apiKey: getEnvVar('SENDGRID_API_KEY'),
      fromEmail: getEnvVar('SENDGRID_FROM_EMAIL', 'noreply@powerpay.ng'),
      fromName: getEnvVar('SENDGRID_FROM_NAME', 'PowerPay')
    }
  }
};