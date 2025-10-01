import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [TokensModule],
})
export class TestAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(TestAppModule);
  
  // Enable CORS for testing
  app.enableCors();
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 PowerPay Token API is running on: http://localhost:${port}/api/v1`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST http://localhost:${port}/api/v1/tokens/generate`);
  console.log(`   GET  http://localhost:${port}/api/v1/tokens/health`);
  console.log(`   GET  http://localhost:${port}/api/v1/tokens/discos`);
  console.log(`   GET  http://localhost:${port}/api/v1/tokens/validate/:token`);
}

bootstrap().catch(err => {
  console.error('Failed to start test server:', err);
  process.exit(1);
});