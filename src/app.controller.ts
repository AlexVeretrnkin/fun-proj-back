import { Controller, Get, Query } from '@nestjs/common';

import { PhotoComparingService } from './core/photo-comparing/photo-comparing.service';
import { TorrentLoaderService } from './core/torrent-loader/torrent-loader.service';

@Controller()
export class AppController {
  constructor(
    private readonly photoComparingService: PhotoComparingService,
    private readonly torrentService: TorrentLoaderService
  ) {
  }

  @Get()
  public getHello(): string {
    return 'Hello!!!'
  }

  @Get('/torrent')
  public getTorrent(@Query('torrentId') torrentId: string): void {
    this.torrentService.downloadTorrent(torrentId);
    // console.log(this.torrentService.getFileStoragePath());

    this.torrentService.getTorrentStatus().subscribe((status: number) => console.log('Downloaded -', status));
  }
}
