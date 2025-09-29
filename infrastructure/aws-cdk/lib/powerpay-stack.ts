import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

export interface PowerPayStackProps extends cdk.StackProps {
  stage: string;
  domainName: string;
}

export class PowerPayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PowerPayStackProps) {
    super(scope, id, props);

    // VPC for all resources
    const vpc = new ec2.Vpc(this, 'PowerPayVPC', {
      maxAzs: 2,
      natGateways: 1, // Cost optimization for dev
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // RDS PostgreSQL Database
    const database = new rds.DatabaseInstance(this, 'PowerPayDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4,
      }),
      instanceType: props.stage === 'prod' 
        ? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)
        : ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      multiAz: props.stage === 'prod',
      backupRetention: cdk.Duration.days(7),
      deletionProtection: props.stage === 'prod',
      databaseName: 'powerpay',
      credentials: rds.Credentials.fromGeneratedSecret('powerpay-admin'),
    });

    // ElastiCache Redis
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis',
      subnetIds: vpc.isolatedSubnets.map(subnet => subnet.subnetId),
    });

    const redis = new elasticache.CfnCacheCluster(this, 'PowerPayRedis', {
      cacheNodeType: props.stage === 'prod' ? 'cache.t3.small' : 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    });

    // ECS Cluster for API
    const cluster = new ecs.Cluster(this, 'PowerPayCluster', {
      vpc,
      containerInsights: true,
    });

    // Task Definition for API
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'PowerPayApiTask', {
      memoryLimitMiB: props.stage === 'prod' ? 2048 : 1024,
      cpu: props.stage === 'prod' ? 1024 : 512,
    });

    const container = taskDefinition.addContainer('PowerPayApi', {
      image: ecs.ContainerImage.fromAsset('../apps/api'),
      environment: {
        NODE_ENV: props.stage === 'prod' ? 'production' : 'development',
        DATABASE_HOST: database.instanceEndpoint.hostname,
        DATABASE_PORT: '5432',
        DATABASE_NAME: 'powerpay',
        REDIS_HOST: redis.attrRedisEndpointAddress,
        REDIS_PORT: '6379',
      },
      secrets: {
        DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(database.secret!, 'password'),
        JWT_SECRET: ecs.Secret.fromSecretsManager(
          new cdk.aws_secretsmanager.Secret(this, 'JwtSecret', {
            generateSecretString: {
              secretStringTemplate: JSON.stringify({ username: 'powerpay' }),
              generateStringKey: 'password',
              excludeCharacters: '"@/\\',
            },
          })
        ),
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'powerpay-api',
        logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      }),
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
      },
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // ECS Service
    const service = new ecs.FargateService(this, 'PowerPayApiService', {
      cluster,
      taskDefinition,
      desiredCount: props.stage === 'prod' ? 2 : 1,
      assignPublicIp: false,
    });

    // Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'PowerPayALB', {
      vpc,
      internetFacing: true,
    });

    const listener = alb.addListener('PowerPayListener', {
      port: 443,
      open: true,
    });

    listener.addTargets('PowerPayApiTargets', {
      port: 3000,
      targets: [service],
      healthCheckPath: '/health',
      healthCheckInterval: cdk.Duration.seconds(30),
    });

    // S3 Buckets for Frontend Apps
    const webAppBucket = new s3.Bucket(this, 'PowerPayWebApp', {
      bucketName: `powerpay-web-${props.stage}-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const adminBucket = new s3.Bucket(this, 'PowerPayAdmin', {
      bucketName: `powerpay-admin-${props.stage}-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront Distributions
    const webAppDistribution = new cloudfront.Distribution(this, 'PowerPayWebDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(webAppBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    const adminDistribution = new cloudfront.Distribution(this, 'PowerPayAdminDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(adminBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Lambda Functions for Background Jobs
    const tokenGeneratorFunction = new lambda.Function(this, 'TokenGenerator', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda/token-generator'),
      environment: {
        DATABASE_HOST: database.instanceEndpoint.hostname,
        REDIS_HOST: redis.attrRedisEndpointAddress,
      },
      timeout: cdk.Duration.minutes(5),
      vpc,
    });

    // SQS Queue for Background Jobs
    const jobQueue = new sqs.Queue(this, 'PowerPayJobQueue', {
      queueName: `powerpay-jobs-${props.stage}`,
      visibilityTimeout: cdk.Duration.minutes(5),
    });

    // SNS Topic for Notifications
    const notificationTopic = new sns.Topic(this, 'PowerPayNotifications', {
      topicName: `powerpay-notifications-${props.stage}`,
    });

    // Outputs
    new cdk.CfnOutput(this, 'WebAppURL', {
      value: `https://${webAppDistribution.distributionDomainName}`,
      description: 'PowerPay Web App URL',
    });

    new cdk.CfnOutput(this, 'AdminURL', {
      value: `https://${adminDistribution.distributionDomainName}`,
      description: 'PowerPay Admin Dashboard URL',
    });

    new cdk.CfnOutput(this, 'ApiURL', {
      value: `https://${alb.loadBalancerDnsName}`,
      description: 'PowerPay API URL',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
      description: 'RDS PostgreSQL Endpoint',
    });
  }
}