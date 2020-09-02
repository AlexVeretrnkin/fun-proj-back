import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';

import { Response, Request } from 'express';

import { VideoFileService } from '../core/file/video-file.service';
import { TitleService } from '../core/title/title.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TitlePreviewEntity } from '../entity/title-preview.entity';
import { TorrentLoaderService } from '../core/torrent-loader/torrent-loader.service';
import { VideoFileQueryModel } from '../models/file/video-file-query.model';
import { TitleVideoService } from '../core/title-video/title-video.service';
import { Observable, of } from 'rxjs';
import { WebScrapingService } from '../core/web-scraping/web-scraping.service';
import { Torrent } from '../models/torrent/torrent';

@Controller('title')
export class TitleController {
  constructor(
    private readonly videoFileService: VideoFileService,
    private readonly titleService: TitleService,
    private readonly torrentLoaderService: TorrentLoaderService,
    private readonly titleVideoService: TitleVideoService,
    private readonly webScrapingService: WebScrapingService
  ) {
  }

  @Get()
  public getTitleInfo(
    @Query('titleId') titleId: number
  ): Observable<TitlePreviewEntity> {
    return this.titleService.getTitleById(titleId);
  }

  @Get('video')
  @UsePipes(new ValidationPipe())
  public getTitleVideo(
    @Res() res: Response,
    @Req() req: Request,
    @Query() titleSeries: VideoFileQueryModel
  ) {
    this.titleVideoService.getVideoFileLocation(titleSeries)
      .subscribe((fileLocation: string) =>
        this.videoFileService.getVideo(req, res, fileLocation)
      );
  }

  @Post('download')
  public downloadTitle(@Body('titleId') titleId: number): void {
    let title: TitlePreviewEntity;

    //todo improve
    of(null)
      .pipe(
        switchMap(() => this.titleService.getTitleById(titleId)),
        tap((foundedTitle: TitlePreviewEntity) => title = foundedTitle),
        switchMap((title: TitlePreviewEntity) =>
          this.torrentLoaderService.downloadTorrentRx(title)
        ),
        catchError((_err: Error, caught: Observable<Torrent>) => {
            console.log(_err);

            return this.webScrapingService.updateCurrentTitle(title)
              .pipe(
                switchMap(() => caught)
              );
          }
        )
      ).subscribe(
      () => console.log('Success!!!!'),
      (err) => console.log('Fail(((((', err),
    );
  }
}
