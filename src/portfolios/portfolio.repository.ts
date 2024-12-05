import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectRepository(Portfolio)
    private portfolios: Repository<Portfolio>,
  ) {}

  findOneByAccountNumber(accountNumber: string): Promise<Portfolio> {
    return this.portfolios.findOne({
      where: {
        user: {
          accountNumber,
        },
      },
      relations: { user: true },
    });
  }

  save(portfolio: Portfolio): Promise<Portfolio> {
    return this.portfolios.save(portfolio);
  }

  async upsert(
    portfolio: Portfolio,
    entityManager?: EntityManager,
  ): Promise<Portfolio> {
    const repo = entityManager?.getRepository(Portfolio) || this.portfolios;
    return repo.save(portfolio);
  }
}
