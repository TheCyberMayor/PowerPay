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
import { Payment } from './payment.entity';
import { Token } from './token.entity';

export enum MeterType {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export enum MeterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DISCONNECTED = 'disconnected',
}

export enum DiscoType {
  IKEJA_ELECTRIC = 'ikeja_electric',
  EKO_DISCO = 'eko_disco',
  ABUJA_DISCO = 'abuja_disco',
  PHED = 'phed',
  KAEDC = 'kaedc',
  AEDC = 'aedc',
  BEDC = 'bedc',
  EEDC = 'eedc',
  IBEDC = 'ibedc',
  JEDC = 'jedc',
  KEDCO = 'kedco',
}

@Entity('meters')
@Index(['meterNumber'])
@Index(['userId', 'status'])
export class Meter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  meterNumber: string;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({
    type: 'enum',
    enum: MeterType,
  })
  type: MeterType;

  @Column({
    type: 'enum',
    enum: MeterStatus,
    default: MeterStatus.ACTIVE,
  })
  status: MeterStatus;

  @Column({
    type: 'enum',
    enum: DiscoType,
  })
  disco: DiscoType;

  @Column({ type: 'varchar', length: 100 })
  tariffCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lastRechargeAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastRechargeDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalConsumption: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageMonthlyUsage: number;

  @Column({ type: 'jsonb', nullable: true })
  meterData: any;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.meters)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.meter)
  payments: Payment[];

  @OneToMany(() => Token, (token) => token.meter)
  tokens: Token[];

  // Virtual properties
  get needsRecharge(): boolean {
    return this.type === MeterType.PREPAID && this.currentBalance < 1000;
  }

  get discoName(): string {
    const discoNames = {
      [DiscoType.IKEJA_ELECTRIC]: 'Ikeja Electric',
      [DiscoType.EKO_DISCO]: 'Eko Electricity Distribution Company',
      [DiscoType.ABUJA_DISCO]: 'Abuja Electricity Distribution Company',
      [DiscoType.PHED]: 'Port Harcourt Electricity Distribution Company',
      [DiscoType.KAEDC]: 'Kaduna Electric',
      [DiscoType.AEDC]: 'Abuja Electric',
      [DiscoType.BEDC]: 'Benin Electricity Distribution Company',
      [DiscoType.EEDC]: 'Enugu Electricity Distribution Company',
      [DiscoType.IBEDC]: 'Ibadan Electricity Distribution Company',
      [DiscoType.JEDC]: 'Jos Electricity Distribution Company',
      [DiscoType.KEDCO]: 'Kano Electricity Distribution Company',
    };
    return discoNames[this.disco] || this.disco;
  }
}