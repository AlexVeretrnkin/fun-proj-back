import { Controller, Get, Param, Query } from '@nestjs/common';

import { PhotoComparingService } from './core/photo-comparing/photo-comparing.service';
import { TorrentLoaderService } from './core/torrent-loader/torrent-loader.service';

@Controller()
export class AppController {
  constructor(
    private readonly photoComparingService: PhotoComparingService,
    private readonly torrentService: TorrentLoaderService
  ) {}

  @Get()
  public getHello(): void {
    return this.photoComparingService.compareTwoImages('src/core/photo-comparing/downloadTorrent.png', 'src/core/photo-comparing/downloadTorrent.png');
  }

  @Get('/torrent')
  public getTorrent(@Query('torrentId') torrentId: string): void {
    this.torrentService.downloadTorrent(torrentId);
  }
}
