import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { Response, Request } from 'express';

import { VideoFileService } from '../core/file/video-file.service';
import { TitleService } from '../core/title/title.service';
import { catchError, filter, mergeMap, switchMap, tap } from 'rxjs/operators';
import { TitlePreviewEntity } from '../entity/title-preview.entity';
import { TorrentLoaderService } from '../core/torrent-loader/torrent-loader.service';
import { VideoFileQueryModel } from '../models/file/video-file-query.model';
import { TitleVideoService } from '../core/title-video/title-video.service';
import { iif, Observable, of, throwError } from 'rxjs';
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
      .subscribe((fileLocation: string) => {
        if (!fileLocation) res.status(HttpStatus.NOT_FOUND).send( {error: 'No such file' });
        else this.videoFileService.getVideo(req, res, fileLocation);
      });
  }

  @Get('test')
  public getTitleVideoTest(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath)
    ffmpeg('F:\\fun-proj-back\\static\\Sword Art Online Alicization - War of Underworld 2nd Season - AniLibria.TV [WEBRip 1080p]\\Sword_Art_Online_Alicization_-_War_of_Underworld_2nd_Season_[01]_[AniLibria_TV]_[WEBRip_1080p].mkv')
      .output('./test.mp4')
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', function(err) {
        if(!err) { console.log('conversion Done', new Date()) }
      })
      .on('error', function(err){
        console.log('error: ', err)
      }).run();
  }

  @Get('video/test')
  public getTest(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log('???');

    this.videoFileService.getVideo(req, res, './Uzaki-chan_wa_Asobitai!_[01]_[AniLibria_TV]_[WEBRip_1080p_HEVC].mkv')
  }

  @Post('download')
  public downloadTitle(@Body('titleId') titleId: number): void {
    let title: TitlePreviewEntity;

    console.log(`Download started ${titleId}`);

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

  @Delete('delete-video')
  public deleteTitleVideo(
    @Query('titleId') titleId: number
  ): Observable<string[]> {
    return this.titleVideoService.getAllVideoFileLocations(titleId)
      .pipe(
        tap((videoPaths: string[]) => this.videoFileService.removeVideoFiles(videoPaths))
      )
  }
}
