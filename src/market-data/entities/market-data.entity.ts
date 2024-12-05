import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Instrument } from '../../instruments/entities/instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  @Index()
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

  @Column('timestamp')
  @Index()
  date: Date;
}
