import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { OrderStatus, OrderType, OrderSide } from '../types/orders';

type OrderInit = Partial<Order>;

@Entity('orders')
export class Order {
  constructor(init?: OrderInit) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  @Index()
  instrument: Instrument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user: User;

  @Column()
  size: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: Object.values(OrderType) })
  type: OrderType;

  @Column({ type: 'enum', enum: Object.values(OrderSide) })
  side: OrderSide;

  @Column({ type: 'enum', enum: Object.values(OrderStatus) })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datetime: Date;
}
