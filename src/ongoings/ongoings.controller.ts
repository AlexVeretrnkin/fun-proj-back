import { Controller, Get } from '@nestjs/common';

import { Observable } from 'rxjs';

import { TitlePreviewEntity } from '../entity/title-preview.entity';

import { PreviewModel } from '../models/preview.model';

import { WebScrapingService } from '../core/web-scraping/web-scraping.service';
import { TitleService } from '../core/title/title.service';

@Controller('ongoings')
export class OngoingsController {

  constructor(
    private readonly webScrapingService: WebScrapingService,
    private titleService: TitleService
  ) {
  }

  @Get('')
  public getOngoings(): Observable<PreviewModel[]> {
    return this.titleService.getOngoings();
  }

  @Get('test')
  public testOngoings(): Observable<TitlePreviewEntity[]> {

    return this.webScrapingService.parseSite();
  }
}
