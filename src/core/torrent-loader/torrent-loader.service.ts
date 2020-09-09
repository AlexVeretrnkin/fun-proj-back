import { Injectable, Logger, Scope } from '@nestjs/common';

import * as path from 'path';

import * as WebTorrent from 'webtorrent';

import { BehaviorSubject, interval, Observable, Observer, throwError } from 'rxjs';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { TitleVideoService } from '../title-video/title-video.service';
import { TorrentFileModel } from '../../models/torrent/torrent-file';
import { Torrent } from '../../models/torrent/torrent';
import { TorrentClient } from '../../models/torrent/torrent-client';
import { WebScrapingService } from '../web-scraping/web-scraping.service';
import { TitlePreviewEntity } from '../../entity/title-preview.entity';
import * as fs from 'fs';

@Injectable({ scope: Scope.REQUEST })
export class TorrentLoaderService {
  private logger: Logger = new Logger();

  private torrentDownloaded$: BehaviorSubject<number>;

  private readonly updateStatusInterval: number = 1000;

  constructor(
    private readonly titleVideoService: TitleVideoService,
    private readonly webScrapingService: WebScrapingService
  ) {
  }

  public getTorrentStatus(): Observable<number> {
    return this.torrentDownloaded$.asObservable();
  }

  public downloadTorrent(torrentLink: string, downloadPath = this.getFileStoragePath()): void {
    const client: TorrentClient = new WebTorrent();

    this.torrentDownloaded$ = new BehaviorSubject<number>(0);

    client.on('error', (err) => {
      console.log('Error!!!');

      return throwError(err);
    });

    client.add(torrentLink, { path: downloadPath }, (torrent) => {
      torrent.deselect(0, torrent.pieces.length - 1, 0);

      this.sortByFileName(torrent.files);

      torrent.files.forEach(f => f.select());

      this.titleVideoService.addVideoFile(
        1595243830,
        torrent.files.map(f => this.getFileStoragePath(f.path))
      );

      interval(this.updateStatusInterval)
        .pipe(
          takeWhile(() => torrent.progress !== 1),
          tap(() => {
            console.log(torrent.files.map(f => f.progress));
          })
        )
        .subscribe(
          () => this.torrentDownloaded$.next(torrent.progress * 100)
        );

      torrent.on('error', () => {
        throw new Error('err');
      });

      torrent.on('done', () => {
        this.logger.log('torrent download finished');

        this.torrentDownloaded$.next(torrent.progress * 100);

        this.torrentDownloaded$.unsubscribe();

        torrent.destroy();

        client.destroy();
      });
    });
  }

  public downloadTorrentRx(title: TitlePreviewEntity, downloadPath = this.getFileStoragePath()): Observable<null> {
    const client: TorrentClient = new WebTorrent();

    this.torrentDownloaded$ = new BehaviorSubject<number>(0);

    return this.torrentClientAdd(client, title.torrentLink, { path: downloadPath })
      .pipe(
        tap((torrent: Torrent) => {
          torrent.deselect(0, torrent.pieces.length - 1, 0);

          this.sortByFileName(torrent.files);

          torrent.files.forEach(f => f.select());
        }),
        switchMap((torrent: Torrent) =>
          this.titleVideoService.addVideoFile(
            title.id,
            torrent.files.map(f => this.getFileStoragePath(f.path))
          )
            .pipe(
              map(() => torrent)
            )
        ),
        tap((torrent: Torrent) => {
          interval(this.updateStatusInterval)
            .pipe(
              takeWhile(() => torrent.progress !== 1),
              tap(() => {
                this.convertFiles(torrent.files.map(f => f.path), title.id);

                console.log(torrent.files.map(f => f.progress));
              })
            )
            .subscribe(
              () => this.torrentDownloaded$.next(torrent.progress * 100)
            );
        }),
        switchMap(this.onTorrentDone),
        tap((torrent: Torrent) => {
          this.logger.log('torrent download finished');

          this.torrentDownloaded$.next(torrent.progress * 100);

          this.torrentDownloaded$.unsubscribe();

          torrent.destroy();

          client.destroy();
        }),
        map(() => null)
      );
  }

  public torrentClientAdd(client: TorrentClient, torrentLink: string, options?: any): Observable<Torrent> {
    return new Observable<Torrent>(
      (observer: Observer<Torrent>) => {
        client.on('error', (err: Error) => observer.error(err));

        client.add(torrentLink, options, (torrent: Torrent) => {
          observer.next(torrent);
        });
      });
  }

  public onTorrentDone(torrent: Torrent): Observable<Torrent> {
    return new Observable<Torrent>(
      (observer: Observer<Torrent>) => {
        torrent.on('done', () => {
          observer.next(torrent);
        });
      }
    );
  }

  private convertFiles(filePaths: string[], titleId: number): void {
    filePaths.forEach((path: string) => {
      if (
        fs.existsSync(this.getFileStoragePath(path)) &&
        !fs.existsSync(this.getFileStoragePath(this.renameFile(path)))
      ) {
        this.convertToMp4Format(this.getFileStoragePath(path), titleId)
      }
    });
  }

  private renameFile(fileName: string): string {
    return fileName.replace(/\.[a-z]*$/, '.mp4')
  }

  public convertToMp4Format(pathToFile: string, titleId: number): void {
    console.log('convertToMp4Format');

    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath)

    ffmpeg(pathToFile)
      .output(
        this.renameFile(pathToFile)
      )
      .on('progress', (progress) => {
        console.log(progress);
      })
      .on('end', (err) => {
        if(!err) {
          console.log('conversion Done', pathToFile);

          this.titleVideoService.addVideoFile(
            titleId,
            [this.getFileStoragePath(this.renameFile(pathToFile))]
          )

          fs.unlinkSync(pathToFile);
        }
      })
      .on('error', function(err){
        console.log('error: ', err)
      }).run();
  }

  private sortByFileName(files: TorrentFileModel[]): void {
    files.sort((prev, curr) => {
      if (prev.name > curr.name) return 1;
      if (prev.name < curr.name) return -1;
      return 0;
    });
  }

  public getFileStoragePath(filePath?: string): string {
    return path.resolve(`static/${filePath ? filePath : ''}`);
  }
}
