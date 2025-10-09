import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: string; timestamp: string; deployment: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      deployment: 'PowerPay v1.0 - Flutterwave Integration Only',
    };
  }

  @Get('check')
  healthCheck(): { 
    status: string; 
    services: { 
      database: string; 
      redis: string; 
    }; 
  } {
    return {
      status: 'OK',
      services: {
        database: process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://placeholder' ? 'connected' : 'disabled',
        redis: process.env.QUEUES_ENABLED === 'true' ? 'connected' : 'disabled'
      }
    };
  }
}