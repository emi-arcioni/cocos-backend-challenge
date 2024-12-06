import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsService } from './instruments.service';
import { InstrumentRepository } from './instrument.repository';

describe('InstrumentsService', () => {
  let service: InstrumentsService;
  let mockInstrumentRepository: Partial<InstrumentRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    mockInstrumentRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    module = await Test.createTestingModule({
      providers: [
        InstrumentsService,
        {
          provide: InstrumentRepository,
          useValue: mockInstrumentRepository,
        },
      ],
    }).compile();

    service = module.get<InstrumentsService>(InstrumentsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all instruments', async () => {
    const mockInstruments = [
      { id: 1, ticker: 'ALUA', name: 'Aluar Aluminio Argentino S.A.I.C.' },
      { id: 64, ticker: 'HAVA', name: 'Havanna Holding' },
    ];
    mockInstrumentRepository.findAll = jest
      .fn()
      .mockResolvedValue(mockInstruments);

    const result = await service.findAll();
    expect(result).toEqual(mockInstruments);
    expect(mockInstrumentRepository.findAll).toHaveBeenCalled();
  });
});
