import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL', 'info'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'powerpay-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: this.configService.get('LOG_FILE_PATH', 'logs/app.log'),
        }),
      ],
    });
  }

  log(message: string, context?: string, data?: any) {
    this.logger.info(message, { context, data });
  }

  error(message: string, trace?: string, context?: string, data?: any) {
    this.logger.error(message, { context, trace, data });
  }

  warn(message: string, context?: string, data?: any) {
    this.logger.warn(message, { context, data });
  }

  debug(message: string, context?: string, data?: any) {
    this.logger.debug(message, { context, data });
  }

  verbose(message: string, context?: string, data?: any) {
    this.logger.verbose(message, { context, data });
  }
}