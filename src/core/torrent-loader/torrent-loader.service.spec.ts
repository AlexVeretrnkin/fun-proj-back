import { Test, TestingModule } from '@nestjs/testing';
import { TorrentLoaderService } from './torrent-loader.service';

describe('TorrentLoaderService', () => {
  let service: TorrentLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TorrentLoaderService],
    }).compile();

    service = module.get<TorrentLoaderService>(TorrentLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
