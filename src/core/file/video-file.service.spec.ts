import { Test, TestingModule } from '@nestjs/testing';
import { VideoFileService } from './video-file.service';

describe('VideoFileService', () => {
  let service: VideoFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoFileService],
    }).compile();

    service = module.get<VideoFileService>(VideoFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
