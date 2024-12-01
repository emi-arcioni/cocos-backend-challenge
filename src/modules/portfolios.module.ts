import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from '../controllers/portfolios.controller';
import { GetPortfolioService } from '../services/get-portfolio.service';
import { User } from '../entities/user.entity';
import { MarketData } from '../entities/marketData.entity';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from '../entities/order.entity';
import { MarketDataRepository } from '../repositories/marketData.repository';
import { UserGuard } from '../guards/user.guard';
import { IsUserService } from '../services/is-user.service';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, MarketData])],
  controllers: [PortfoliosController],
  providers: [
    GetPortfolioService,
    IsUserService,
    UserRepository,
    OrderRepository,
    MarketDataRepository,
    UserGuard,
  ],
})
export class PortfoliosModule {}
