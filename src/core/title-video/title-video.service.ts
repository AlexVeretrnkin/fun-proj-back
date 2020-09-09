import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

import { TitleVideoEntity } from '../../entity/title-video.entity';
import { VideoFileQueryModel } from '../../models/file/video-file-query.model';

@Injectable()
export class TitleVideoService {
  constructor(
    @InjectRepository(TitleVideoEntity)
    private titlesVideoRepository: Repository<TitleVideoEntity>
  ) {
  }

  public getVideoFileLocation(videoQuery: VideoFileQueryModel): Observable<string> {
    return fromPromise(this.titlesVideoRepository.findOne({
      ...videoQuery
    })).pipe(
      map((video: TitleVideoEntity) => video ? video.fileLocation : null),
      take(1)
    );
  }

  public getAllVideoFileLocations(titleId: number): Observable<string[]> {
    return fromPromise(this.titlesVideoRepository.find({
      titleId
    })).pipe(
      map((video: TitleVideoEntity[]) => video.map((item: TitleVideoEntity) => item.fileLocation)),
      take(1)
    );
  }

  public addVideoFile(titleId: number, fileLocations: string[]): Observable<TitleVideoEntity[]> {
    const videoFiles: TitleVideoEntity[] = fileLocations.map((item: string, index : number) => {
      return new TitleVideoEntity(
        {
          titleId: titleId,
          series: index + 1,
          fileLocation: item
        });
    });

    return this.saveInsert(videoFiles).pipe(take(1));
  }

  private saveInsert(videoFiles: TitleVideoEntity[]): Observable<TitleVideoEntity[]> {
    return from(this.titlesVideoRepository.save(videoFiles))
      .pipe(
        catchError(() => of(null))
      );
  }
}
