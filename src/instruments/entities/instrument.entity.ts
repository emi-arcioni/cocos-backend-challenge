import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { MarketData } from '../../market-data/entities/market-data.entity';
import { Order } from '../../orders/entities/order.entity';
import { InstrumentType } from '../types/instruments';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  @Index({ unique: true })
  ticker: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'enum', enum: Object.values(InstrumentType) })
  @Index()
  type: InstrumentType;

  @OneToMany(() => MarketData, (marketData) => marketData.instrument)
  marketData: MarketData[];

  @OneToMany(() => Order, (order) => order.instrument)
  orders: Order[];
}
