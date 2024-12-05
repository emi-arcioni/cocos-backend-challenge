import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { User } from '../users/entities/user.entity';
import { MarketData } from '../market-data/entities/market-data.entity';
import { Order } from '../orders/entities/order.entity';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioRepository } from './portfolio.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, MarketData, Portfolio]),
    forwardRef(() => OrdersModule),
    UsersModule,
    MarketDataModule,
  ],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfolioRepository],
  exports: [PortfoliosService, PortfolioRepository],
})
export class PortfoliosModule {}
