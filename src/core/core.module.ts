import { Module } from '@nestjs/common';

import { PhotoComparingService } from './photo-comparing/photo-comparing.service';
import { TorrentLoaderService } from './torrent-loader/torrent-loader.service';
import { WebScrapingService } from './web-scraping/web-scraping.service';

@Module({
  providers: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService
  ],
  exports: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService
  ]
})
export class CoreModule {}
