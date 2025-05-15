import { Test, TestingModule } from '@nestjs/testing';
import { SobreService } from './sobre.service';

describe('SobreService', () => {
  let service: SobreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SobreService],
    }).compile();

    service = module.get<SobreService>(SobreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
