import { Module } from '@nestjs/common';

import { PhotoComparingService } from './photo-comparing/photo-comparing.service';
import { TorrentLoaderService } from './torrent-loader/torrent-loader.service';
import { WebScrapingService } from './web-scraping/web-scraping.service';
import { TitleService } from './title/title.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitlePreviewEntity } from '../entity/title-preview.entity';
import { VideoFileService } from './file/video-file.service';
import { TitleVideoService } from './title-video/title-video.service';
import { TitleVideoEntity } from '../entity/title-video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TitlePreviewEntity,
      TitleVideoEntity
    ])
  ],
  providers: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService,
    TitleService,
    VideoFileService,
    TitleVideoService
  ],
  exports: [
    PhotoComparingService,
    TorrentLoaderService,
    WebScrapingService,
    TitleService,
    VideoFileService,
    TitleVideoService
  ]
})
export class CoreModule {}
