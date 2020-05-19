import { Test, TestingModule } from '@nestjs/testing';
import { PhotoComparingService } from './photo-comparing.service';

describe('PhotoComparingService', () => {
  let service: PhotoComparingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoComparingService],
    }).compile();

    service = module.get<PhotoComparingService>(PhotoComparingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
