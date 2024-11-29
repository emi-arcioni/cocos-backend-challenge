import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
