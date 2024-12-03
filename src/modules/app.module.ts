import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { InstrumentsModule } from './instruments.module';
import { typeOrmConfig } from '../config/dbconfig';
import { PortfoliosModule } from './portfolios.module';
import { OrdersModule } from './orders.module';
import { MarketDataModule } from './marketData.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
