import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
  },
  remita: {
    merchantId: process.env.REMITA_MERCHANT_ID,
    apiKey: process.env.REMITA_API_KEY,
    apiToken: process.env.REMITA_API_TOKEN,
  },
  interswitch: {
    clientId: process.env.INTERSWITCH_CLIENT_ID,
    clientSecret: process.env.INTERSWITCH_CLIENT_SECRET,
  },
  webhookSecret: process.env.WEBHOOK_SECRET,
}));