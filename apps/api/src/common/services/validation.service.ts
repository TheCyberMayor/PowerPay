import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    // Nigerian phone number validation
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
    return phoneRegex.test(phone);
  }

  validateBVN(bvn: string): boolean {
    // BVN is 11 digits
    const bvnRegex = /^\d{11}$/;
    return bvnRegex.test(bvn);
  }

  validateMeterNumber(meterNumber: string): boolean {
    // Meter numbers are typically 10-12 digits
    const meterRegex = /^\d{10,12}$/;
    return meterRegex.test(meterNumber);
  }

  validatePassword(password: string): {
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

  sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  isValidAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
  }

  formatCurrency(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}