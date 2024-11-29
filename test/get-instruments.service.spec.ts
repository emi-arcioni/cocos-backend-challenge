import { Test, TestingModule } from '@nestjs/testing';
import { GetInstrumentsService } from '../src/services/get-instruments.service';
import { InstrumentRepository } from '../src/repositories/instrument.repository';

describe('GetInstrumentsService', () => {
  let service: GetInstrumentsService;
  let mockInstrumentRepository: Partial<InstrumentRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    mockInstrumentRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    module = await Test.createTestingModule({
      providers: [
        GetInstrumentsService,
        {
          provide: InstrumentRepository,
          useValue: mockInstrumentRepository,
        },
      ],
    }).compile();

    service = module.get<GetInstrumentsService>(GetInstrumentsService);
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

    const result = await service.execute();
    expect(result).toEqual(mockInstruments);
    expect(mockInstrumentRepository.findAll).toHaveBeenCalled();
  });
});
