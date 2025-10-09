import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Meter } from './meter.entity';
import { Token } from './token.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  USSD = 'ussd',
  WALLET = 'wallet',
}

export enum PaymentGateway {
  FLUTTERWAVE = 'flutterwave',
  REMITA = 'remita',
  INTERSWITCH = 'interswitch',
}

export enum PaymentType {
  PREPAID_RECHARGE = 'prepaid_recharge',
  POSTPAID_BILL = 'postpaid_bill',
}

@Entity('payments')
@Index(['reference'])
@Index(['userId', 'status'])
@Index(['meterId', 'status'])
@Index(['gateway', 'gatewayReference'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  reference: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gatewayReference: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
  })
  gateway: PaymentGateway;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  type: PaymentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  channel: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  failureReason: string;

  @Column({ type: 'boolean', default: false })
  isRefunded: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  meterId: string;

  @ManyToOne(() => Meter, (meter) => meter.payments)
  @JoinColumn({ name: 'meterId' })
  meter: Meter;

  @OneToMany(() => Token, (token) => token.payment)
  tokens: Token[];

  // Virtual properties
  get isSuccessful(): boolean {
    return this.status === PaymentStatus.SUCCESSFUL;
  }

  get isPending(): boolean {
    return this.status === PaymentStatus.PENDING || this.status === PaymentStatus.PROCESSING;
  }

  get isFailed(): boolean {
    return this.status === PaymentStatus.FAILED || this.status === PaymentStatus.CANCELLED;
  }

  get netAmount(): number {
    return this.amount - this.fee;
  }
}