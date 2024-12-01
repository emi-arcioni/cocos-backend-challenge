import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MarketData } from './marketData.entity';
import { Order } from './order.entity';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  ticker: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  type: string;

  @OneToMany(() => MarketData, (marketData) => marketData.instrument)
  marketData: MarketData[];

  @OneToMany(() => Order, (order) => order.instrument)
  orders: Order[];
}
