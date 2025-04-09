import { Test, TestingModule } from '@nestjs/testing';
import { MinistriesService } from './ministries.service';

describe('MinistriesService', () => {
  let service: MinistriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinistriesService],
    }).compile();

    service = module.get<MinistriesService>(MinistriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
