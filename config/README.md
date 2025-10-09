# PowerPay Configuration Management

This folder contains the centralized configuration system for PowerPay environment variables.

## 📁 Files

### `environment.js` / `environment.ts`
**The single source of truth for all environment variables.**

- Update your API keys and secrets here
- All other files inherit from this configuration
- Available in both JavaScript and TypeScript versions

### `sync-env.js`
**Automated sync script that updates all config files from the central environment.**

```bash
# Run the sync script
node config/sync-env.js
```

## 🚀 Quick Start

### 1. Update Your Keys
Edit `config/environment.js` or `config/environment.ts`:

```javascript
// Change these placeholder values to your real keys
JWT_SECRET: "your-super-secure-jwt-secret-key-change-this-in-production",
FLUTTERWAVE_SECRET_KEY: "FLWSECK-your-real-flutterwave-key",
FLUTTERWAVE_PUBLIC_KEY: "FLWPUBK-your-real-flutterwave-key",
// ... add other keys
```

### 2. Sync to All Files
```bash
node config/sync-env.js
```

### 3. Deploy
```bash
git add .
git commit -m "Update environment configuration"
git push origin master
```

## 🔐 Security Priority

**Immediate (Required for basic functionality):**
- `JWT_SECRET`
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_PUBLIC_KEY`
- `ENCRYPTION_KEY`

**High Priority (Core features):**
- `TERMII_API_KEY` (SMS notifications)
- `SENDGRID_API_KEY` (Email notifications)
- `WEBHOOK_SECRET` (Payment callbacks)

**Medium Priority (Additional payment gateways):**
- `INTERSWITCH_*` keys

**Low Priority (DISCO integrations):**
- `IKEJA_ELECTRIC_API_KEY`
- `EKO_DISCO_API_KEY`
- `ABUJA_DISCO_API_KEY`

## 🎯 Where to Get Keys

| Service | Website | Key Type |
|---------|---------|----------|
| Flutterwave | https://dashboard.flutterwave.com | Secret + Public Key |
| Termii SMS | https://termii.com | API Key |
| SendGrid | https://sendgrid.com | API Key |
| Interswitch | https://developer.interswitchng.com | Client ID + Secret |

## 🔧 Usage in Code

### NestJS Config Files
```typescript
import { getEnvVar } from '../../../config/environment';

export default registerAs('auth', () => ({
  jwtSecret: getEnvVar('JWT_SECRET'),
  // ... other config
}));
```

### Direct Usage
```typescript
import { environment, flutterwaveConfig } from '../config/environment';

// Use specific config objects
const secretKey = flutterwaveConfig.secretKey;

// Or access directly
const apiKey = environment.TERMII_API_KEY;
```

## ⚠️ Important Notes

1. **Never commit real production keys** to version control
2. **Always use placeholder values** in the repository
3. **Set real keys in production** via environment variables or DigitalOcean dashboard
4. **Run sync-env.js** after updating the central configuration
5. **Validate keys** before deploying to production

## 🔄 Sync Process

The `sync-env.js` script automatically updates:
- `.do/app.yaml` (DigitalOcean configuration)
- `.env.example` (Development template)
- Any other configuration files

This ensures all files stay in sync with your central configuration.