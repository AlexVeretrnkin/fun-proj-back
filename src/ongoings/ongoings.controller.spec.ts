import { Test, TestingModule } from '@nestjs/testing';
import { OngoingsController } from './ongoings.controller';

describe('Ongoings Controller', () => {
  let controller: OngoingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OngoingsController],
    }).compile();

    controller = module.get<OngoingsController>(OngoingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
