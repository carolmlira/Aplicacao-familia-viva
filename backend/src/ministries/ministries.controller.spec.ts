import { Test, TestingModule } from '@nestjs/testing';
import { MinistriesController } from './ministries.controller';

describe('MinistriesController', () => {
  let controller: MinistriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinistriesController],
    }).compile();

    controller = module.get<MinistriesController>(MinistriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
