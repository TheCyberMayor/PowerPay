import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
  generateUUID(): string {
    return uuidv4();
  }

  generateReference(prefix: string = 'PWP'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  generateTokenCode(): string {
    // Generate a 16-digit token code
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += Math.floor(Math.random() * 10).toString();
    }
    return token;
  }

  formatPhoneNumber(phone: string): string {
    // Convert to international format
    let formatted = phone.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '234' + formatted.substring(1);
    } else if (!formatted.startsWith('234')) {
      formatted = '234' + formatted;
    }
    
    return '+' + formatted;
  }

  calculateUnits(amount: number, tariff: number = 50): number {
    // Calculate electricity units based on amount and tariff rate
    return Math.floor((amount / tariff) * 100) / 100;
  }

  addMinutes(date: Date, minutes: number): Date {
    return moment(date).add(minutes, 'minutes').toDate();
  }

  addDays(date: Date, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }

  isExpired(date: Date): boolean {
    return moment().isAfter(date);
  }

  formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment(date).format(format);
  }

  maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  calculateFee(amount: number, feePercentage: number = 1.5): number {
    const fee = (amount * feePercentage) / 100;
    return Math.max(fee, 50); // Minimum fee of ₦50
  }

  parseAmount(amount: string | number): number {
    if (typeof amount === 'string') {
      return parseFloat(amount.replace(/[^\d.]/g, ''));
    }
    return amount;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  chunks<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}