import { Test, TestingModule } from '@nestjs/testing';
import { TitleVideoService } from './title-video.service';

describe('TitleVideoService', () => {
  let service: TitleVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleVideoService],
    }).compile();

    service = module.get<TitleVideoService>(TitleVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
