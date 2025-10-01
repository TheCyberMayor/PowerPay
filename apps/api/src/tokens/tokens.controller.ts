import { Controller, Post, Body, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { TokensService, TokenRequest, TokenResponse } from './tokens.service';

export class GenerateTokenDto {
  meterNumber: string;
  amount: number;
  disco: string;
  meterType: 'prepaid' | 'postpaid';
}

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('generate')
  async generateToken(@Body() generateTokenDto: GenerateTokenDto): Promise<TokenResponse> {
    // Validate input
    if (!generateTokenDto.meterNumber || !generateTokenDto.amount || !generateTokenDto.disco) {
      throw new HttpException(
        'Missing required fields: meterNumber, amount, and disco are required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (generateTokenDto.amount < 100) {
      throw new HttpException(
        'Minimum amount is ₦100',
        HttpStatus.BAD_REQUEST
      );
    }

    if (generateTokenDto.amount > 200000) {
      throw new HttpException(
        'Maximum amount is ₦200,000',
        HttpStatus.BAD_REQUEST
      );
    }

    // Default to prepaid if not specified
    const request: TokenRequest = {
      ...generateTokenDto,
      meterType: generateTokenDto.meterType || 'prepaid'
    };

    return await this.tokensService.generateToken(request);
  }

  @Get('validate/:token')
  validateToken(@Param('token') token: string): { valid: boolean; message: string } {
    const isValid = this.tokensService.validateToken(token);
    return {
      valid: isValid,
      message: isValid ? 'Token format is valid' : 'Invalid token format'
    };
  }

  @Get('discos')
  getSupportedDiscos(): { discos: string[] } {
    return {
      discos: this.tokensService.getSupportedDiscos()
    };
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'Token service is running',
      timestamp: new Date().toISOString()
    };
  }
}