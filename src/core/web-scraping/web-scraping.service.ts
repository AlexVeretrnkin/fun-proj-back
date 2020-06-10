import { Injectable } from '@nestjs/common';

import { Browser, launch, Page, SerializableOrJSHandle } from 'puppeteer';

import { TitlePreviewEntity } from '../../entity/title-preview-entity';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AnilibriaScrapingPreviewModel } from '../../models/scraping/anilibria-scraping-preview.model';
import { anilibriaScrapingPreviewConfig } from '../../models/scraping-config/anilibria-scraping-preview.config';
import { TitleService } from '../title/title.service';

@Injectable()
export class WebScrapingService {
  private readonly previewConfig: AnilibriaScrapingPreviewModel = anilibriaScrapingPreviewConfig;

  private browser: Browser;
  private page: Page;

  private test: TitlePreviewEntity = new TitlePreviewEntity();

  constructor(
    private readonly titleService: TitleService
  ) {
  }

  public parseSite(): Observable<TitlePreviewEntity[]> {
    return fromPromise(launch({headless: false}))
      .pipe(
        tap((browser: Browser) => this.browser = browser),
        switchMap(() => this.browser.newPage()),
        tap((page: Page) => this.page = page),
        switchMap((page: Page) => page.goto('https://www.anilibria.tv/pages/schedule.php')),
        switchMap(() => fromPromise(this.page.evaluate((config: AnilibriaScrapingPreviewModel) => {
                const infoItem: Record<string, any> = {};

                const info: Record<string, any>[] = [];

                [...document.getElementsByClassName(config.previewItemClassName)]
                  .forEach((item: HTMLLinkElement) => {
                    infoItem.titleLink = item.querySelectorAll('a').item(0).href;

                    infoItem.title = item.querySelectorAll(`span.${config.titleNameClassName}`)
                      .item(0).textContent;

                    infoItem.series = parseInt(
                      item.querySelectorAll(`span.${config.titleSeriesClassName}`)
                        .item(0).textContent
                        .match(/\d+/g)[1]
                    );

                    infoItem.description =
                      item.querySelectorAll(`span.${config.titleDescriptionClassName}`)
                        .item(0).textContent;

                    infoItem.imgUrl = item.querySelectorAll('a').item(0).href;

                    info.push({ ...infoItem });
                  });

                return info;
              }, this.previewConfig as unknown as SerializableOrJSHandle),
            )
        ),
        tap(() => this.browser.close()),
        tap(() => this.titleService.addTitles([
          new TitlePreviewEntity({
            id: 0,
            imgUrl: '',
            title: '',
            description: '',
            series: 1,
            totalSeries: 10,
            status: 1,
            titleLink: ''
          })]))
      ) as Observable<TitlePreviewEntity[]>;
  }
}
