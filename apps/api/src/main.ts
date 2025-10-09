import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      configService.get('FRONTEND_URL', 'https://powerpay.ng'),
      configService.get('ADMIN_URL', 'https://admin.powerpay.ng'),
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('PowerPay API')
    .setDescription('Electricity Payment Application API for Nigeria')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('meters', 'Meter management endpoints')
    .addTag('payments', 'Payment processing endpoints')
    .addTag('tokens', 'Token generation endpoints')
    .addTag('bills', 'Bill management endpoints')
    .addTag('notifications', 'Notification endpoints')
    .addTag('admin', 'Admin endpoints')
    .addTag('discos', 'DISCO integration endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Use PORT environment variable directly for DigitalOcean App Platform
  const port = process.env.PORT || configService.get('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 PowerPay API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();