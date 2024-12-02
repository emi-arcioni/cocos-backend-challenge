import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsController } from '../controllers/instruments.controller';
import { GetInstrumentsService } from '../services/get-instruments.service';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentRepository } from '../repositories/instrument.repository';
import { GetInstrumentService } from '../services/get-instrument.service';
import { IsValidTickerConstraint } from 'src/validators/is-valid-ticker.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentsController],
  providers: [
    GetInstrumentsService,
    GetInstrumentService,
    InstrumentRepository,
    IsValidTickerConstraint,
  ],
  exports: [
    GetInstrumentsService,
    GetInstrumentService,
    InstrumentRepository,
    IsValidTickerConstraint,
  ],
})
export class InstrumentsModule {}
