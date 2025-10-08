# PowerPay AWS Deployment Guide

## Option 1: AWS App Runner (Simplest - Similar to DigitalOcean)

### Create apprunner.yaml
```yaml
version: 1.0
runtime: nodejs16
build:
  commands:
    build:
      - cd apps/api
      - npm install
      - npm run build
run:
  runtime-version: 16
  command: cd apps/api && npm run start:prod
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
    - name: DATABASE_URL
      value: postgresql://username:password@your-rds-endpoint:5432/powerpay
    - name: DATABASE_SSL
      value: "true"
    - name: QUEUES_ENABLED
      value: "false"
```

### Deployment Commands:
```bash
# Create App Runner service
aws apprunner create-service \
  --service-name powerpay-api \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "public.ecr.aws/aws-app-runner/hello-app-runner:latest",
      "ImageConfiguration": {
        "Port": "3000"
      },
      "ImageRepositoryType": "ECR_PUBLIC"
    },
    "AutoDeploymentsEnabled": true
  }'
```

## Option 2: AWS ECS with Fargate (Production-ready)

### Create Dockerfile for API
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install --only=production
COPY apps/api/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Create docker-compose.aws.yml
```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - DATABASE_SSL=true
      - QUEUES_ENABLED=false
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=powerpay
      - POSTGRES_USER=powerpay
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Option 3: AWS CDK (Infrastructure as Code)

### Update existing CDK files
The CDK files in `/infrastructure/aws-cdk/` can be used for full infrastructure deployment.

## Estimated Costs:
- **DigitalOcean**: ~$35/month (current setup)
- **AWS App Runner**: ~$25-40/month
- **AWS ECS Fargate**: ~$30-50/month
- **AWS Lambda**: ~$5-15/month (serverless option)

## Recommendation:
1. **Try DigitalOcean fix first** (current deployment should work now)
2. **If you prefer AWS**, use App Runner for simplicity
3. **For production**, consider ECS Fargate