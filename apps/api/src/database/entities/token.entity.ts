import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Meter } from './meter.entity';
import { Payment } from './payment.entity';

export enum TokenStatus {
  GENERATED = 'generated',
  USED = 'used',
  EXPIRED = 'expired',
  INVALID = 'invalid',
}

@Entity('tokens')
@Index(['tokenCode'])
@Index(['meterId', 'status'])
@Index(['paymentId'])
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  tokenCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  units: number;

  @Column({
    type: 'enum',
    enum: TokenStatus,
    default: TokenStatus.GENERATED,
  })
  status: TokenStatus;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  discoResponse: any;

  @Column({ type: 'varchar', length: 100, nullable: true })
  discoReference: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  meterId: string;

  @ManyToOne(() => Meter, (meter) => meter.tokens)
  @JoinColumn({ name: 'meterId' })
  meter: Meter;

  @Column({ type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.tokens)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return this.status === TokenStatus.GENERATED && !this.isExpired;
  }

  get formattedTokenCode(): string {
    // Format token code as XXXX-XXXX-XXXX-XXXX
    return this.tokenCode.replace(/(.{4})/g, '$1-').slice(0, -1);
  }
}