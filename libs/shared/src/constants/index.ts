import { DiscoType } from '../types';

export const DISCO_INFO = {
  [DiscoType.IKEJA_ELECTRIC]: {
    name: 'Ikeja Electric',
    shortName: 'IE',
    regions: ['Lagos'],
    serviceUrl: 'https://api.ikejaelectric.com',
    states: ['Lagos State (Ikeja, Agege, Mushin, Oshodi, Shomolu)'],
  },
  [DiscoType.EKO_DISCO]: {
    name: 'Eko Electricity Distribution Company',
    shortName: 'EKEDC',
    regions: ['Lagos'],
    serviceUrl: 'https://api.ekoelectricity.com',
    states: ['Lagos State (Victoria Island, Lekki, Ajah, Ikoyi)'],
  },
  [DiscoType.ABUJA_DISCO]: {
    name: 'Abuja Electricity Distribution Company',
    shortName: 'AEDC',
    regions: ['North Central'],
    serviceUrl: 'https://api.abujaelectricity.com',
    states: ['FCT', 'Nasarawa', 'Niger', 'Kogi'],
  },
  [DiscoType.PHED]: {
    name: 'Port Harcourt Electricity Distribution Company',
    shortName: 'PHED',
    regions: ['South South'],
    serviceUrl: 'https://api.phed.ng',
    states: ['Rivers', 'Bayelsa', 'Cross River', 'Akwa Ibom'],
  },
  [DiscoType.KAEDC]: {
    name: 'Kaduna Electric',
    shortName: 'KAEDC',
    regions: ['North West'],
    serviceUrl: 'https://api.kadunaelectric.com',
    states: ['Kaduna', 'Kebbi', 'Sokoto', 'Zamfara'],
  },
  [DiscoType.AEDC]: {
    name: 'Abuja Electric',
    shortName: 'AEDC',
    regions: ['North Central'],
    serviceUrl: 'https://api.abujaelectric.com',
    states: ['FCT', 'Nasarawa', 'Niger', 'Kogi'],
  },
  [DiscoType.BEDC]: {
    name: 'Benin Electricity Distribution Company',
    shortName: 'BEDC',
    regions: ['South South'],
    serviceUrl: 'https://api.bedc.com',
    states: ['Edo', 'Delta', 'Ondo', 'Ekiti'],
  },
  [DiscoType.EEDC]: {
    name: 'Enugu Electricity Distribution Company',
    shortName: 'EEDC',
    regions: ['South East'],
    serviceUrl: 'https://api.eedcng.com',
    states: ['Enugu', 'Anambra', 'Abia', 'Imo', 'Ebonyi'],
  },
  [DiscoType.IBEDC]: {
    name: 'Ibadan Electricity Distribution Company',
    shortName: 'IBEDC',
    regions: ['South West'],
    serviceUrl: 'https://api.ibedc.com',
    states: ['Oyo', 'Ogun', 'Osun', 'Kwara (part)'],
  },
  [DiscoType.JEDC]: {
    name: 'Jos Electricity Distribution Company',
    shortName: 'JEDC',
    regions: ['North Central'],
    serviceUrl: 'https://api.jedc.com',
    states: ['Plateau', 'Bauchi', 'Gombe', 'Benue'],
  },
  [DiscoType.KEDCO]: {
    name: 'Kano Electricity Distribution Company',
    shortName: 'KEDCO',
    regions: ['North West'],
    serviceUrl: 'https://api.kedco.ng',
    states: ['Kano', 'Jigawa', 'Katsina'],
  },
};

export const PAYMENT_GATEWAYS = {
  FLUTTERWAVE: {
    name: 'Flutterwave',
    baseUrl: 'https://api.flutterwave.com/v3',
    supportedMethods: ['card', 'bank_transfer', 'ussd', 'wallet'],
    minAmount: 50,
    maxAmount: 5000000,
    fee: 1.4,
  },
  INTERSWITCH: {
    name: 'Interswitch',
    baseUrl: 'https://sandbox.interswitchng.com',
    supportedMethods: ['card', 'bank_transfer'],
    minAmount: 100,
    maxAmount: 5000000,
    fee: 1.2,
  },
};

export const NOTIFICATION_TEMPLATES = {
  PAYMENT_SUCCESS: {
    title: 'Payment Successful',
    sms: 'Your payment of ₦{amount} for meter {meterNumber} was successful. Token: {token}',
    email: 'payment-success',
    push: 'Payment successful! Your token has been generated.',
  },
  PAYMENT_FAILED: {
    title: 'Payment Failed',
    sms: 'Your payment of ₦{amount} for meter {meterNumber} failed. Reason: {reason}',
    email: 'payment-failed',
    push: 'Payment failed. Please try again.',
  },
  TOKEN_GENERATED: {
    title: 'Token Generated',
    sms: 'Token generated: {token}. Amount: ₦{amount}, Units: {units}kWh. Valid until {expiry}',
    email: 'token-generated',
    push: 'Your electricity token is ready!',
  },
  LOW_BALANCE: {
    title: 'Low Balance Alert',
    sms: 'Low balance alert for meter {meterNumber}. Current balance: ₦{balance}. Recharge now!',
    email: 'low-balance',
    push: 'Your meter balance is running low.',
  },
  BILL_REMINDER: {
    title: 'Bill Payment Reminder',
    sms: 'Bill reminder: ₦{amount} due for meter {meterNumber} on {dueDate}',
    email: 'bill-reminder',
    push: 'Your electricity bill is due soon.',
  },
  ACCOUNT_VERIFICATION: {
    title: 'Account Verification',
    sms: 'Your verification code is: {code}. Valid for 10 minutes.',
    email: 'account-verification',
    push: 'Please verify your account.',
  },
};

export const APP_CONSTANTS = {
  TOKEN_EXPIRY_DAYS: 30,
  OTP_EXPIRY_MINUTES: 10,
  PASSWORD_RESET_EXPIRY_HOURS: 24,
  MIN_RECHARGE_AMOUNT: 100,
  MAX_RECHARGE_AMOUNT: 50000,
  DEFAULT_TARIFF_RATE: 50, // ₦50 per kWh
  LOW_BALANCE_THRESHOLD: 1000, // ₦1000
  MAX_METERS_PER_USER: 10,
  SUPPORTED_CURRENCIES: ['NGN'],
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT'
];

export const ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  
  // Validation Errors
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_BVN: 'INVALID_BVN',
  INVALID_METER_NUMBER: 'INVALID_METER_NUMBER',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  
  // Payment Errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  GATEWAY_ERROR: 'GATEWAY_ERROR',
  DUPLICATE_TRANSACTION: 'DUPLICATE_TRANSACTION',
  
  // Meter Errors
  METER_NOT_FOUND: 'METER_NOT_FOUND',
  METER_INACTIVE: 'METER_INACTIVE',
  METER_LIMIT_EXCEEDED: 'METER_LIMIT_EXCEEDED',
  DISCO_ERROR: 'DISCO_ERROR',
  
  // Token Errors
  TOKEN_GENERATION_FAILED: 'TOKEN_GENERATION_FAILED',
  TOKEN_EXPIRED_ERROR: 'TOKEN_EXPIRED_ERROR',
  TOKEN_ALREADY_USED: 'TOKEN_ALREADY_USED',
  
  // System Errors
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};