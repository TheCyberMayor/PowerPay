import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

export interface TokenRequest {
  meterNumber: string;
  amount: number;
  disco: string;
  meterType: 'prepaid' | 'postpaid';
}

export interface TokenResponse {
  success: boolean;
  token?: string;
  units?: number;
  amount: number;
  disco: string;
  meterNumber: string;
  transactionId: string;
  expiresAt?: Date;
  error?: string;
}

@Injectable()
export class TokensService {
  private readonly VAT_RATE = 0.075; // 7.5% VAT in Nigeria
  private readonly SERVICE_CHARGE = 100; // ₦100 service charge

  async generateToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      // Validate meter number (should be 11 digits for most DISCOs)
      if (!this.isValidMeterNumber(request.meterNumber)) {
        return {
          success: false,
          amount: request.amount,
          disco: request.disco,
          meterNumber: request.meterNumber,
          transactionId: this.generateTransactionId(),
          error: 'Invalid meter number format'
        };
      }

      // For prepaid meters, generate token
      if (request.meterType === 'prepaid') {
        return this.generatePrepaidToken(request);
      } else {
        return {
          success: false,
          amount: request.amount,
          disco: request.disco,
          meterNumber: request.meterNumber,
          transactionId: this.generateTransactionId(),
          error: 'Postpaid meters do not require tokens'
        };
      }
    } catch (error) {
      return {
        success: false,
        amount: request.amount,
        disco: request.disco,
        meterNumber: request.meterNumber,
        transactionId: this.generateTransactionId(),
        error: `Token generation failed: ${error.message}`
      };
    }
  }

  private generatePrepaidToken(request: TokenRequest): TokenResponse {
    const transactionId = this.generateTransactionId();
    
    // Calculate units (kWh) - Different DISCOs have different rates
    const unitsPerNaira = this.getUnitsPerNaira(request.disco);
    const effectiveAmount = request.amount - this.SERVICE_CHARGE;
    const amountBeforeVAT = effectiveAmount / (1 + this.VAT_RATE);
    const units = Math.round((amountBeforeVAT * unitsPerNaira) * 100) / 100;

    // Generate 20-digit token (standard for Nigerian prepaid meters)
    const token = this.generate20DigitToken(request.meterNumber, request.amount, transactionId);

    return {
      success: true,
      token,
      units,
      amount: request.amount,
      disco: request.disco,
      meterNumber: request.meterNumber,
      transactionId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
  }

  private generate20DigitToken(meterNumber: string, amount: number, transactionId: string): string {
    // Create a seed from meter number, amount, and transaction ID
    const seed = `${meterNumber}-${amount}-${transactionId}-${Date.now()}`;
    const hash = createHash('sha256').update(seed).digest('hex');
    
    // Extract 20 digits from the hash
    let token = '';
    for (let i = 0; i < hash.length && token.length < 20; i++) {
      if (/\d/.test(hash[i])) {
        token += hash[i];
      }
    }
    
    // If we don't have enough digits, pad with more from a different part of hash
    while (token.length < 20) {
      const extraHash = createHash('md5').update(seed + token.length).digest('hex');
      for (let i = 0; i < extraHash.length && token.length < 20; i++) {
        if (/\d/.test(extraHash[i])) {
          token += extraHash[i];
        }
      }
    }
    
    return token.substring(0, 20);
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = randomBytes(4).toString('hex').toUpperCase();
    return `PP${timestamp.slice(-8)}${random}`;
  }

  private isValidMeterNumber(meterNumber: string): boolean {
    // Most Nigerian meter numbers are 11 digits
    return /^\d{11}$/.test(meterNumber);
  }

  private getUnitsPerNaira(disco: string): number {
    // Different DISCOs have different tariff rates
    // These are approximate rates for demonstration
    const rates = {
      'IKEDC': 0.0851, // Ikeja Electric
      'EKEDC': 0.0789, // Eko Electric
      'AEDC': 0.0623, // Abuja Electric
      'PHED': 0.0734, // Port Harcourt Electric
      'KEDCO': 0.0456, // Kano Electric
      'KAEDCO': 0.0567, // Kaduna Electric
      'JEDC': 0.0612, // Jos Electric
      'YEDC': 0.0534, // Yola Electric
      'BEDC': 0.0645, // Benin Electric
      'EEDC': 0.0678, // Enugu Electric
      'default': 0.0650 // Average rate
    };

    return rates[disco.toUpperCase()] || rates.default;
  }

  // Method to validate a token (for testing purposes)
  validateToken(token: string): boolean {
    return /^\d{20}$/.test(token);
  }

  // Get supported DISCOs
  getSupportedDiscos(): string[] {
    return [
      'IKEDC', 'EKEDC', 'AEDC', 'PHED', 'KEDCO', 
      'KAEDCO', 'JEDC', 'YEDC', 'BEDC', 'EEDC'
    ];
  }
}