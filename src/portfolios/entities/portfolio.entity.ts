import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PortfolioOverview } from '../types/PortfolioOverview.type';

type PortfolioInit = Partial<Portfolio>;

@Entity('portfolios')
export class Portfolio {
  constructor(init?: PortfolioInit) {
    Object.assign(this, init);
  }
  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @Index({ unique: true })
  user: User;

  @Column('decimal', { precision: 15, scale: 2 })
  balance: number;

  @Column('jsonb')
  overview: PortfolioOverview[];
}
