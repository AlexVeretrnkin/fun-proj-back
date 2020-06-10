import { Module } from '@nestjs/common';

import { PhotoComparingService } from './photo-comparing/photo-comparing.service';
import { TorrentLoaderService } from './torrent-loader/torrent-loader.service';
import { WebScrapingService } from './web-scraping/web-scraping.service';
import { TitleService } from './title/title.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitlePreviewEntity } from '../entity/title-preview-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TitlePreviewEntity])
  ],
  providers: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService,
    TitleService
  ],
  exports: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService,
    TitleService
  ]
})
export class CoreModule {}
