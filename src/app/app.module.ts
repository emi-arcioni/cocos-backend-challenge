import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstrumentsModule } from '../instruments/instruments.module';
import { typeOrmConfig } from '../common/config/dbconfig';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { OrdersModule } from '../orders/orders.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { SyncPortfoliosCommand } from '../common/scripts/sync-portfolios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    InstrumentsModule,
    PortfoliosModule,
    OrdersModule,
    MarketDataModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SyncPortfoliosCommand],
})
export class AppModule {}
