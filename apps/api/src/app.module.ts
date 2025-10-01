import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MetersModule } from './meters/meters.module';
import { PaymentsModule } from './payments/payments.module';
import { TokensModule } from './tokens/tokens.module';
import { BillsModule } from './bills/bills.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { DiscosModule } from './discos/discos.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';

// Configuration
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import paymentConfig from './config/payment.config';
import notificationConfig from './config/notification.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [
        databaseConfig,
        authConfig,
        paymentConfig,
        notificationConfig,
        redisConfig,
      ],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url') || undefined,
        host: configService.get('database.url') ? undefined : configService.get('database.host'),
        port: configService.get('database.url') ? undefined : configService.get('database.port'),
        username: configService.get('database.url') ? undefined : configService.get('database.username'),
        password: configService.get('database.url') ? undefined : configService.get('database.password'),
        database: configService.get('database.url') ? undefined : configService.get('database.name'),
        ssl: configService.get('database.ssl')
          ? { rejectUnauthorized: false }
          : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Redis & Bull Queue (conditionally enabled)
    ...(process.env.QUEUES_ENABLED === 'false'
      ? []
      : [
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              redis: {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
                password: configService.get('redis.password'),
              },
            }),
            inject: [ConfigService],
          }),
        ]),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('RATE_LIMIT_WINDOW_MS', 900000),
        limit: configService.get('RATE_LIMIT_MAX_REQUESTS', 100),
      }),
      inject: [ConfigService],
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    CommonModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    MetersModule,
    PaymentsModule,
    TokensModule,
    BillsModule,
    NotificationsModule,
    AdminModule,
    DiscosModule,
  ],
})
export class AppModule {}