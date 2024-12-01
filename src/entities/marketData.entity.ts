import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instrumentId: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @Column('numeric', { precision: 10, scale: 2 })
  high: number;

  @Column('numeric', { precision: 10, scale: 2 })
  low: number;

  @Column('numeric', { precision: 10, scale: 2 })
  open: number;

  @Column('numeric', { precision: 10, scale: 2 })
  close: number;

  @Column('numeric', { precision: 10, scale: 2 })
  previousClose: number;

  @Column()
  date: Date;
}
