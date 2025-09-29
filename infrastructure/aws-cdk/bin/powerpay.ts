#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PowerPayStack } from './lib/powerpay-stack';

const app = new cdk.App();

// Development Environment
new PowerPayStack(app, 'PowerPayDev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1', // or 'eu-west-1' for closer to Nigeria
  },
  stage: 'dev',
  domainName: 'dev.powerpay.ng',
});

// Production Environment
new PowerPayStack(app, 'PowerPayProd', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  stage: 'prod',
  domainName: 'powerpay.ng',
});