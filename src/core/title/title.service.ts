import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { TitlePreviewEntity } from '../../entity/title-preview-entity';

import { PreviewModel } from '../../models/preview.model';
import { StatusEnum } from '../../models/status.enum';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitlePreviewEntity)
    private titlesRepository: Repository<TitlePreviewEntity>
  ) {
  }

  public addTitles(titles: TitlePreviewEntity[]): Observable<TitlePreviewEntity[]> {
    return fromPromise(this.titlesRepository.save(titles))
      .pipe(
        catchError(() => of([]))
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
}
