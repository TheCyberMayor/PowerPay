/**
 * PowerPay Environment Configuration (TypeScript)
 * 
 * This is the central configuration file for all environment variables.
 * Update your keys here and all other files will inherit from this source.
 * 
 * IMPORTANT: Keep this file secure and never commit real production keys to version control!
 */

export interface EnvironmentConfig {
  // Security & Authentication
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  ENCRYPTION_KEY: string;
  SESSION_SECRET: string;
  WEBHOOK_SECRET: string;
  BCRYPT_ROUNDS: string;

  // Payment Gateways
  FLUTTERWAVE_SECRET_KEY: string;
  FLUTTERWAVE_PUBLIC_KEY: string;
  INTERSWITCH_CLIENT_ID: string;
  INTERSWITCH_CLIENT_SECRET: string;

  // DISCO APIs
  IKEJA_ELECTRIC_API_KEY: string;
  IKEJA_ELECTRIC_BASE_URL: string;
  EKO_DISCO_API_KEY: string;
  EKO_DISCO_BASE_URL: string;
  ABUJA_DISCO_API_KEY: string;
  ABUJA_DISCO_BASE_URL: string;

  // Notifications
  TERMII_API_KEY: string;
  TERMII_SENDER_ID: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  SENDGRID_FROM_NAME: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;

  // BVN Verification
  BVN_VERIFICATION_API_KEY: string;
  BVN_VERIFICATION_BASE_URL: string;

  // Admin
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;

  // System
  NODE_ENV: string;
  PORT: string;
  DATABASE_SSL: string;
  QUEUES_ENABLED: string;
}

/**
 * Central environment configuration
 * 🔑 UPDATE YOUR KEYS HERE 🔑
 */
export const environment: EnvironmentConfig = {
  // =============================================================================
  // 🔐 SECURITY & AUTHENTICATION - CHANGE THESE FIRST!
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
  // 💳 PAYMENT GATEWAYS - GET THESE FROM YOUR PAYMENT PROVIDERS
  // =============================================================================
  
  // Flutterwave (Primary) - Get from https://dashboard.flutterwave.com
  FLUTTERWAVE_SECRET_KEY: "FLWSECK-your-flutterwave-secret-key",
  FLUTTERWAVE_PUBLIC_KEY: "FLWPUBK-your-flutterwave-public-key",
  
  // Interswitch - Get from https://developer.interswitchng.com
  INTERSWITCH_CLIENT_ID: "your_interswitch_client_id",
  INTERSWITCH_CLIENT_SECRET: "your_interswitch_client_secret",

  // =============================================================================
  // ⚡ DISCO API INTEGRATIONS - GET FROM EACH DISCO
  // =============================================================================
  
  // Ikeja Electric - Contact: developer@ikejaelectric.com
  IKEJA_ELECTRIC_API_KEY: "your_ikeja_electric_api_key",
  IKEJA_ELECTRIC_BASE_URL: "https://api.ikejaelectric.com",
  
  // Eko Disco - Contact: api@ekoelectricity.com
  EKO_DISCO_API_KEY: "your_eko_disco_api_key", 
  EKO_DISCO_BASE_URL: "https://api.ekoelectricity.com",
  
  // Abuja Disco - Contact: developer@abujaelectricity.com
  ABUJA_DISCO_API_KEY: "your_abuja_disco_api_key",
  ABUJA_DISCO_BASE_URL: "https://api.abujaelectricity.com",

  // =============================================================================
  // 📱 NOTIFICATION SERVICES
  // =============================================================================
  
  // Termii SMS - Get from https://termii.com
  TERMII_API_KEY: "your_termii_api_key",
  TERMII_SENDER_ID: "PowerPay",
  
  // SendGrid Email - Get from https://sendgrid.com
  SENDGRID_API_KEY: "your_sendgrid_api_key",
  SENDGRID_FROM_EMAIL: "noreply@powerpay.ng",
  SENDGRID_FROM_NAME: "PowerPay",
  
  // Firebase Push Notifications - Get from https://console.firebase.google.com
  FIREBASE_PROJECT_ID: "your_firebase_project_id",
  FIREBASE_PRIVATE_KEY: "your_firebase_private_key",
  FIREBASE_CLIENT_EMAIL: "your_firebase_client_email",

  // =============================================================================
  // 🔍 BVN VERIFICATION - GET FROM BVN SERVICE PROVIDER
  // =============================================================================
  BVN_VERIFICATION_API_KEY: "your_bvn_verification_api_key",
  BVN_VERIFICATION_BASE_URL: "https://api.bvnverification.com",

  // =============================================================================
  // 👨‍💼 ADMIN CONFIGURATION - CHANGE THESE!
  // =============================================================================
  SUPER_ADMIN_EMAIL: "admin@powerpay.ng",
  SUPER_ADMIN_PASSWORD: "SuperSecurePassword123!", // Change this immediately!

  // =============================================================================
  // 📊 SYSTEM CONFIGURATION
  // =============================================================================
  NODE_ENV: "production",
  PORT: "3000",
  DATABASE_SSL: "true",
  QUEUES_ENABLED: "false"
};

/**
 * Get environment variable with fallback to central config
 */
export function getEnvVar(key: keyof EnvironmentConfig, required: boolean = false): string {
  const value = process.env[key] || environment[key];
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set!`);
  }
  
  if (value && (value.includes('your_') || value.includes('change-this'))) {
    console.warn(`⚠️  WARNING: ${key} appears to be using a placeholder value!`);
  }
  
  return value;
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): boolean {
  const required: (keyof EnvironmentConfig)[] = [
    'JWT_SECRET',
    'FLUTTERWAVE_SECRET_KEY', 
    'FLUTTERWAVE_PUBLIC_KEY',
    'ENCRYPTION_KEY'
  ];
  
  const missing: string[] = [];
  
  for (const key of required) {
    try {
      getEnvVar(key, true);
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
export function generateSecureKeys() {
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
// 🚀 CONVENIENT CONFIG OBJECTS
// =============================================================================

export const databaseConfig = {
  url: getEnvVar('DATABASE_URL' as any) || process.env.DATABASE_URL,
  ssl: getEnvVar('DATABASE_SSL') === 'true'
};

export const jwtConfig = {
  secret: getEnvVar('JWT_SECRET'),
  expiresIn: getEnvVar('JWT_EXPIRES_IN'),
  refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
  refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN')
};

export const flutterwaveConfig = {
  secretKey: getEnvVar('FLUTTERWAVE_SECRET_KEY'),
  publicKey: getEnvVar('FLUTTERWAVE_PUBLIC_KEY')
};

export const notificationConfig = {
  termii: {
    apiKey: getEnvVar('TERMII_API_KEY'),
    senderId: getEnvVar('TERMII_SENDER_ID')
  },
  sendgrid: {
    apiKey: getEnvVar('SENDGRID_API_KEY'),
    fromEmail: getEnvVar('SENDGRID_FROM_EMAIL'),
    fromName: getEnvVar('SENDGRID_FROM_NAME')
  }
};