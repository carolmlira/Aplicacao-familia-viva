import { Test, TestingModule } from '@nestjs/testing';
import { SobreController } from './sobre.controller';

describe('SobreController', () => {
  let controller: SobreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SobreController],
    }).compile();

    controller = module.get<SobreController>(SobreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
