// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bvn?: string;
  address?: string;
  city?: string;
  state?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBvnVerified: boolean;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark';
  language: string;
}

// Meter Types
export interface Meter {
  id: string;
  meterNumber: string;
  customerName: string;
  address: string;
  type: MeterType;
  status: MeterStatus;
  disco: DiscoType;
  tariffCode: string;
  currentBalance: number;
  lastRechargeAmount: number;
  lastRechargeDate?: Date;
  totalConsumption: number;
  averageMonthlyUsage: number;
  meterData?: any;
  isActive: boolean;
  lastSyncAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MeterType {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export enum MeterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DISCONNECTED = 'disconnected',
}

export enum DiscoType {
  IKEJA_ELECTRIC = 'ikeja_electric',
  EKO_DISCO = 'eko_disco',
  ABUJA_DISCO = 'abuja_disco',
  PHED = 'phed',
  KAEDC = 'kaedc',
  AEDC = 'aedc',
  BEDC = 'bedc',
  EEDC = 'eedc',
  IBEDC = 'ibedc',
  JEDC = 'jedc',
  KEDCO = 'kedco',
}

// Payment Types
export interface Payment {
  id: string;
  reference: string;
  gatewayReference?: string;
  amount: number;
  fee: number;
  totalAmount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  gateway: PaymentGateway;
  type: PaymentType;
  description?: string;
  channel?: string;
  currency?: string;
  ipAddress?: string;
  gatewayResponse?: any;
  metadata?: any;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  isRefunded: boolean;
  refundedAmount: number;
  refundedAt?: Date;
  userId: string;
  meterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  USSD = 'ussd',
  WALLET = 'wallet',
}

export enum PaymentGateway {
  FLUTTERWAVE = 'flutterwave',
  INTERSWITCH = 'interswitch',
}

export enum PaymentType {
  PREPAID_RECHARGE = 'prepaid_recharge',
  POSTPAID_BILL = 'postpaid_bill',
}

// Token Types
export interface Token {
  id: string;
  tokenCode: string;
  amount: number;
  units: number;
  status: TokenStatus;
  expiresAt: Date;
  usedAt?: Date;
  discoResponse?: any;
  discoReference?: string;
  instructions?: string;
  userId: string;
  meterId: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TokenStatus {
  GENERATED = 'generated',
  USED = 'used',
  EXPIRED = 'expired',
  INVALID = 'invalid',
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  category: NotificationCategory;
  recipient?: string;
  data?: any;
  metadata?: any;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  externalId?: string;
  retryCount: number;
  maxRetries: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read',
}

export enum NotificationCategory {
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  TOKEN_GENERATED = 'token_generated',
  LOW_BALANCE = 'low_balance',
  BILL_REMINDER = 'bill_reminder',
  ACCOUNT_VERIFICATION = 'account_verification',
  SECURITY_ALERT = 'security_alert',
  PROMOTION = 'promotion',
  SYSTEM_UPDATE = 'system_update',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Payment Request Types
export interface PaymentRequest {
  meterId: string;
  amount: number;
  method: PaymentMethod;
  gateway: PaymentGateway;
  type: PaymentType;
}

export interface PaymentInitializeResponse {
  reference: string;
  authorizationUrl: string;
  accessCode?: string;
}

// DISCO Types
export interface DiscoInfo {
  code: DiscoType;
  name: string;
  shortName: string;
  regions: string[];
  tariffs: DiscoTariff[];
}

export interface DiscoTariff {
  code: string;
  name: string;
  rate: number;
  description: string;
  meterType: MeterType;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  totalTokensGenerated: number;
  todayTransactions: number;
  todayRevenue: number;
  activeUsers: number;
  failedTransactions: number;
}

export interface TransactionStats {
  date: string;
  transactions: number;
  revenue: number;
  success_rate: number;
}

// Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    bvnVerification: boolean;
    biometricAuth: boolean;
    pushNotifications: boolean;
  };
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;
}