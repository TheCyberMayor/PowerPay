import { DiscoType, MeterType } from '../types';
import { DISCO_INFO, APP_CONSTANTS, NIGERIAN_STATES } from '../constants';

export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    // Nigerian phone number validation
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
    return phoneRegex.test(phone);
  }

  static validateBVN(bvn: string): boolean {
    // BVN is 11 digits
    const bvnRegex = /^\d{11}$/;
    return bvnRegex.test(bvn);
  }

  static validateMeterNumber(meterNumber: string): boolean {
    // Meter numbers are typically 10-12 digits
    const meterRegex = /^\d{10,12}$/;
    return meterRegex.test(meterNumber);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidAmount(amount: number): boolean {
    return (
      amount >= APP_CONSTANTS.MIN_RECHARGE_AMOUNT &&
      amount <= APP_CONSTANTS.MAX_RECHARGE_AMOUNT &&
      Number.isFinite(amount)
    );
  }

  static isValidState(state: string): boolean {
    return NIGERIAN_STATES.includes(state);
  }
}

export class FormatUtils {
  static formatCurrency(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  static formatPhoneNumber(phone: string): string {
    // Convert to international format
    let formatted = phone.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '234' + formatted.substring(1);
    } else if (!formatted.startsWith('234')) {
      formatted = '234' + formatted;
    }
    
    return '+' + formatted;
  }

  static formatMeterNumber(meterNumber: string): string {
    // Format meter number as XXXX-XXXX-XXXX
    return meterNumber.replace(/(\d{4})(?=\d)/g, '$1-');
  }

  static formatTokenCode(tokenCode: string): string {
    // Format token code as XXXX-XXXX-XXXX-XXXX
    return tokenCode.replace(/(.{4})/g, '$1-').slice(0, -1);
  }

  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  static maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  static formatDate(date: Date | string, format: string = 'MMM DD, YYYY'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Simple date formatting (you might want to use a library like moment.js or date-fns)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    
    if (format.includes('HH:mm')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }
    
    return dateObj.toLocaleDateString('en-US', options);
  }

  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export class CalculationUtils {
  static calculateUnits(amount: number, tariff: number = APP_CONSTANTS.DEFAULT_TARIFF_RATE): number {
    // Calculate electricity units based on amount and tariff rate
    return Math.floor((amount / tariff) * 100) / 100;
  }

  static calculateFee(amount: number, feePercentage: number = 1.5): number {
    const fee = (amount * feePercentage) / 100;
    return Math.max(fee, 50); // Minimum fee of ₦50
  }

  static calculateTotalAmount(amount: number, fee?: number): number {
    const calculatedFee = fee ?? this.calculateFee(amount);
    return amount + calculatedFee;
  }

  static calculateDiscount(originalAmount: number, discountPercentage: number): number {
    return (originalAmount * discountPercentage) / 100;
  }

  static calculateTax(amount: number, taxRate: number = 7.5): number {
    // VAT in Nigeria is 7.5%
    return (amount * taxRate) / 100;
  }
}

export class StringUtils {
  static generateReference(prefix: string = 'PWP'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  static generateTokenCode(): string {
    // Generate a 16-digit token code
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += Math.floor(Math.random() * 10).toString();
    }
    return token;
  }

  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }
}

export class ArrayUtils {
  static chunks<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

export class DateUtils {
  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  static addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 3600000);
  }

  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 86400000);
  }

  static isExpired(date: Date): boolean {
    return new Date() > date;
  }

  static daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  static isThisWeek(date: Date): boolean {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= weekStart && date <= weekEnd;
  }

  static isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }
}

export class DiscoUtils {
  static getDiscoInfo(disco: DiscoType) {
    return DISCO_INFO[disco];
  }

  static getDiscoByState(state: string): DiscoType[] {
    const discos: DiscoType[] = [];
    
    Object.entries(DISCO_INFO).forEach(([disco, info]) => {
      if (info.states.some(s => s.toLowerCase().includes(state.toLowerCase()))) {
        discos.push(disco as DiscoType);
      }
    });
    
    return discos;
  }

  static validateMeterForDisco(meterNumber: string, disco: DiscoType): boolean {
    // Basic validation - in real implementation, this would call DISCO APIs
    return this.validateMeterNumber(meterNumber);
  }

  private static validateMeterNumber(meterNumber: string): boolean {
    return /^\d{10,12}$/.test(meterNumber);
  }
}

export class ApiUtils {
  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }

  static parseError(error: any): { message: string; code?: string } {
    if (error?.response?.data?.message) {
      return {
        message: error.response.data.message,
        code: error.response.data.code,
      };
    }
    
    if (error?.message) {
      return { message: error.message };
    }
    
    return { message: 'An unexpected error occurred' };
  }

  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    return operation().catch((error) => {
      if (maxRetries <= 0) {
        throw error;
      }
      
      return this.delay(delay).then(() =>
        this.retryOperation(operation, maxRetries - 1, delay * 2)
      );
    });
  }
}