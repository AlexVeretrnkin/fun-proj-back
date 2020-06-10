import { Controller, Get } from '@nestjs/common';

import { TitlePreviewEntity } from '../entity/title-preview-entity';

import { WebScrapingService } from '../core/web-scraping/web-scraping.service';
import { Observable } from 'rxjs';

@Controller('ongoings')
export class OngoingsController {

  constructor(
    private readonly webScrapingService: WebScrapingService
  ) {
  }

  @Get('')
  public getOngoings(): Observable<TitlePreviewEntity[]> {

    return this.webScrapingService.parseSite();
  }
}
