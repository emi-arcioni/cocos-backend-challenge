import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';
import { OrderStatus, OrderType, OrderSide } from '../types/orders';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  size: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: ['MARKET', 'LIMIT'] })
  type: OrderType;

  @Column({ type: 'enum', enum: ['BUY', 'SELL', 'CASH_IN', 'CASH_OUT'] })
  side: OrderSide;

  @Column({ type: 'enum', enum: ['NEW', 'FILLED', 'REJECTED', 'CANCELLED'] })
  status: OrderStatus;

  @Column()
  datetime: Date;
}
