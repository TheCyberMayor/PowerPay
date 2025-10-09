import { registerAs } from '@nestjs/config';
import { jwtConfig, getEnvVar } from '../../../../config/environment';

export default registerAs('auth', () => ({
  jwtSecret: getEnvVar('JWT_SECRET') || process.env.JWT_SECRET || 'default-secret',
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN') || process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: getEnvVar('JWT_REFRESH_SECRET') || process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
  jwtRefreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN') || process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(getEnvVar('BCRYPT_ROUNDS') || process.env.BCRYPT_ROUNDS || '12', 10),
  encryptionKey: getEnvVar('ENCRYPTION_KEY') || process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars',
}));