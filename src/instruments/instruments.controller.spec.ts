import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';

describe('InstrumentsController', () => {
  let controller: InstrumentsController;
  let mockInstrumentsService: Partial<InstrumentsService>;
  let module: TestingModule;

  beforeEach(async () => {
    mockInstrumentsService = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    module = await Test.createTestingModule({
      controllers: [InstrumentsController],
      providers: [
        {
          provide: InstrumentsService,
          useValue: mockInstrumentsService,
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
    mockInstrumentsService.findAll = jest
      .fn()
      .mockResolvedValue(mockInstruments);

    const result = await controller.findAll();
    expect(result).toEqual(mockInstruments);
    expect(mockInstrumentsService.findAll).toHaveBeenCalled();
  });
});
