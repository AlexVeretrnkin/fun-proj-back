import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';

import { TitlePreviewEntity } from '../../entity/title-preview-entity';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitlePreviewEntity)
    private usersRepository: Repository<TitlePreviewEntity>
  ) {
  }

  public addTitles(titles: TitlePreviewEntity[]): Observable<TitlePreviewEntity[]> {
    return fromPromise(this.usersRepository.save(titles));
  }
}
