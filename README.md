# PowerPay - Electricity Payment Application

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/YOUR_USERNAME/PowerPay/tree/main)

A comprehensive electricity payment solution for Nigeria, enabling users to purchase prepaid tokens and pay postpaid electricity bills with seamless integration to Nigerian DISCOs and payment providers.

## 🚀 Quick Deploy to DigitalOcean

This repository is configured for one-click deployment to DigitalOcean App Platform.

### Prerequisites
- GitHub account
- DigitalOcean account  
- Nigerian payment gateway API keys (Flutterwave)

### 🎯 One-Click Deploy
1. Click the "Deploy to DigitalOcean" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

Your PowerPay application will be live in 5-10 minutes.

## 🏗️ Architecture

### Frontend Applications
- **Mobile App**: React Native (iOS/Android)
- **Web App**: React.js with TypeScript
- **Admin Dashboard**: React.js with advanced analytics

### Backend Services
- **API Gateway**: NestJS with microservices architecture
- **Authentication Service**: JWT/OAuth2.0 with BVN integration
- **Payment Service**: Multi-gateway payment processing
- **Notification Service**: SMS, Email, and Push notifications
- **DISCO Integration Service**: Real-time meter data and token generation

### Database & Caching
- **Primary Database**: PostgreSQL with encrypted storage
- **Cache Layer**: Redis for session management and API caching
- **File Storage**: AWS S3 for receipts and documents

## 🚀 Features

### User Features
- ✅ Account registration/login with BVN verification
- ✅ Multiple meter management (prepaid/postpaid)
- ✅ Instant token generation for prepaid meters
- ✅ Postpaid bill payment processing
- ✅ Payment history and receipt downloads
- ✅ Real-time notifications (SMS/Email/Push)
- ✅ Secure payment with multiple gateways

### Admin Features
- ✅ Transaction monitoring and dispute resolution
- ✅ DISCO integration management
- ✅ User management and KYC verification
- ✅ Revenue and usage analytics
- ✅ Tariff and penalty management

### Integration Features
- ✅ Payment Gateways: Flutterwave, Remita, Interswitch
- ✅ DISCO APIs: Ikeja Electric, Eko Disco, Abuja Disco, PHED
- ✅ Notification Services: Termii SMS, SendGrid Email

## 🛠️ Tech Stack

- **Frontend**: React Native, React.js, TypeScript
- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL, Redis
- **Authentication**: JWT, OAuth2.0, Passport.js
- **Payments**: Flutterwave, Remita APIs
- **Notifications**: Firebase, Termii, SendGrid
- **Cloud**: AWS (EC2, RDS, S3, Lambda)
- **Monitoring**: Winston, Prometheus, Grafana

## 📦 Project Structure

```
powerpay/
├── apps/
│   ├── mobile/                 # React Native mobile app
│   ├── web/                    # React.js web application
│   ├── admin/                  # Admin dashboard
│   └── api/                    # NestJS backend API
├── libs/
│   ├── shared/                 # Shared utilities and types
│   ├── ui-components/          # Reusable UI components
│   └── database/               # Database schemas and migrations
├── infrastructure/
│   ├── docker/                 # Docker configurations
│   ├── k8s/                    # Kubernetes manifests
│   └── terraform/              # Infrastructure as code
└── docs/                       # Documentation
```

## 🔧 Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)
- React Native CLI
- Docker & Docker Compose

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd powerpay

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development services
docker-compose up -d postgres redis

# Run database migrations
npm run migrate

# Start development servers
npm run dev
```

## 🔒 Security & Compliance

- **PCI DSS Compliant**: Secure payment processing
- **AES-256 Encryption**: Data encryption at rest and in transit
- **TLS 1.3**: Secure API communications
- **CBN Compliance**: Nigerian banking regulations
- **NDPR Compliance**: Data protection regulations
- **MFA Support**: Multi-factor authentication
- **Fraud Detection**: Real-time transaction monitoring

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker-compose up --build
```

## 📊 Performance Requirements

- **Concurrent Transactions**: 1000+ per second
- **Uptime**: 99.9% availability
- **Response Time**: <200ms for API calls
- **Token Generation**: <5 seconds
- **Payment Processing**: <30 seconds

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📞 Support

For technical support, contact: support@powerpay.ng
For business inquiries, contact: business@powerpay.ng