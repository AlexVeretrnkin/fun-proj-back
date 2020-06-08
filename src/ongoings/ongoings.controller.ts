import { Controller, Get } from '@nestjs/common';

import { TitlePreviewModel } from '../models/title-preview.model';

import { WebScrapingService } from '../core/web-scraping/web-scraping.service';

@Controller('ongoings')
export class OngoingsController {

  constructor(
    private readonly webScrapingService: WebScrapingService
  ) {
  }

  @Get('')
  public async getOngoings(): Promise<TitlePreviewModel[]> {

    return this.webScrapingService.parseSite();
  }
}
