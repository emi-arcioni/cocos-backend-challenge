import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { Instrument } from './entities/instrument.entity';
import { InstrumentRepository } from './instrument.repository';
import { IsValidTickerConstraint } from './validators/is-valid-ticker.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentsController],
  providers: [
    InstrumentsService,
    InstrumentRepository,
    IsValidTickerConstraint,
  ],
  exports: [InstrumentsService, InstrumentRepository, IsValidTickerConstraint],
})
export class InstrumentsModule {}
