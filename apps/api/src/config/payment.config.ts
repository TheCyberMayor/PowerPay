import { registerAs } from '@nestjs/config';
import { getEnvVar, flutterwaveConfig } from '../../../../config/environment';

export default registerAs('payment', () => ({
  flutterwave: {
    secretKey: getEnvVar('FLUTTERWAVE_SECRET_KEY') || process.env.FLUTTERWAVE_SECRET_KEY,
    publicKey: getEnvVar('FLUTTERWAVE_PUBLIC_KEY') || process.env.FLUTTERWAVE_PUBLIC_KEY,
  },
  interswitch: {
    clientId: getEnvVar('INTERSWITCH_CLIENT_ID') || process.env.INTERSWITCH_CLIENT_ID,
    clientSecret: getEnvVar('INTERSWITCH_CLIENT_SECRET') || process.env.INTERSWITCH_CLIENT_SECRET,
  },
  webhookSecret: getEnvVar('WEBHOOK_SECRET') || process.env.WEBHOOK_SECRET,
}));