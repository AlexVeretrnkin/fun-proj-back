import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { combineLatest, from, Observable } from 'rxjs';

import { TitlePreviewEntity } from '../../entity/title-preview.entity';

import { PreviewModel } from '../../models/preview.model';
import { StatusEnum } from '../../models/status.enum';


@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitlePreviewEntity)
    private titlesRepository: Repository<TitlePreviewEntity>
  ) {
  }

  public getTitleById(titleId: number): Observable<TitlePreviewEntity> {
    return from(this.titlesRepository.findOne({id: titleId}));
  }

  public addTitles(titles: TitlePreviewEntity[]): Observable<(TitlePreviewEntity | UpdateResult)[]> {
    console.log('addTitles', titles);

    return combineLatest(
      titles.map((title: TitlePreviewEntity) => this.insertOrUpdateTitle(title))
    );
  }

  public getOngoings(): Observable<PreviewModel[]> {
    return fromPromise(this.titlesRepository.find({status: StatusEnum.ongoing}))
      .pipe(
        map((res: TitlePreviewEntity[]) =>
          res.map((item: TitlePreviewEntity) => new PreviewModel(item))
        )
      );
  }

  private updateTitle(title: TitlePreviewEntity): Observable<UpdateResult> {
    return fromPromise(
      this.titlesRepository.update(title.id, title)
    );
  }

  private insertOrUpdateTitle(title: TitlePreviewEntity): Observable<TitlePreviewEntity | UpdateResult> {
    return fromPromise(
      this.titlesRepository.save(title)
    )
      .pipe(
        catchError((e: Error) => {
          if (e.name !== 'QueryFailedError') console.error(e);

          return this.updateTitle(title);
        })
      );
  }
}
