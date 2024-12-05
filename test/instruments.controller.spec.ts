import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsController } from '../src/instruments/instruments.controller';
import { GetInstrumentsService } from '../src/services/get-instruments.service';

describe('InstrumentsController', () => {
  let controller: InstrumentsController;
  let mockGetInstrumentsService: Partial<GetInstrumentsService>;
  let module: TestingModule;

  beforeEach(async () => {
    mockGetInstrumentsService = {
      execute: jest.fn().mockResolvedValue([]),
    };

    module = await Test.createTestingModule({
      controllers: [InstrumentsController],
      providers: [
        {
          provide: GetInstrumentsService,
          useValue: mockGetInstrumentsService,
        },
      ],
    }).compile();

    controller = module.get<InstrumentsController>(InstrumentsController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all instruments', async () => {
    const mockInstruments = [
      { id: 1, ticker: 'ALUA', name: 'Aluar Aluminio Argentino S.A.I.C.' },
      { id: 64, ticker: 'HAVA', name: 'Havanna Holding' },
    ];
    mockGetInstrumentsService.execute = jest
      .fn()
      .mockResolvedValue(mockInstruments);

    const result = await controller.findAll();
    expect(result).toEqual(mockInstruments);
    expect(mockGetInstrumentsService.execute).toHaveBeenCalled();
  });
});
