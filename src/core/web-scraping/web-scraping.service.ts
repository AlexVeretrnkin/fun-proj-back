import { Injectable } from '@nestjs/common';

import { Browser, launch, Page, SerializableOrJSHandle } from 'puppeteer';

import { TitlePreviewEntity } from '../../entity/title-preview-entity';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, retry, retryWhen, switchMap, tap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

import { TitleService } from '../title/title.service';

import { AnilibriaScrapingPreviewModel } from '../../models/scraping/anilibria-scraping-preview.model';
import { anilibriaScrapingPreviewConfig } from '../../models/scraping-config/anilibria-scraping-preview.config';
import { AnilibriaScrapingTitlePageModel } from '../../models/scraping/anilibria-scraping-title-page.model';
import { anilibriaScrapingTitlePageConfig } from '../../models/scraping-config/anilibria-scraping-title-page.config';

@Injectable()
export class WebScrapingService {
  private readonly previewConfig: AnilibriaScrapingPreviewModel = anilibriaScrapingPreviewConfig;
  private readonly titlePageConfig: AnilibriaScrapingTitlePageModel = anilibriaScrapingTitlePageConfig;

  private browser: Browser;
  private page: Page;

  private test: TitlePreviewEntity[] = []

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
        switchMap((page: Page) => fromPromise(page.goto('https://www.anilibria.tv/pages/schedule.php'))),
        switchMap(() => fromPromise(this.page.evaluate((config: AnilibriaScrapingPreviewModel) => {
                const infoItem: Record<string, any> = {};

                const info: Record<string, any>[] = [];

                infoItem.status = 0;

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

                    infoItem.imgUrl = item.querySelectorAll('img').item(0).src;

                    infoItem.id = infoItem.imgUrl.match(RegExp(config.titleIdRegexpSource))[1];

                    info.push({ ...infoItem });
                  });

                return info;
              },
            this.previewConfig as unknown as SerializableOrJSHandle),
          )
        ),
        tap((info: TitlePreviewEntity[]) => this.test = info),
        switchMap(() => {
            return combineLatest(
              [
                ...this.test.map((item: TitlePreviewEntity) => {
                  return fromPromise(this.browser.newPage())
                    .pipe(
                      switchMap((page: Page) =>
                        fromPromise(page.goto(item.titleLink, {waitUntil: 'domcontentloaded'}))
                          .pipe(
                            switchMap(() => this.parseTitleInfo(item, page)),
                            tap(() => fromPromise(page.close()))
                          )
                      )
                    );
                }),
              ],
            );
          }
        ),
        switchMap((info: TitlePreviewEntity[]) => this.titleService.addTitles(info)),
        tap(() => this.closeBrowser()),
      ) as Observable<TitlePreviewEntity[]>;
  }

  public closeBrowser(): Observable<void> {
    return fromPromise(this.browser.close());
  }

  private parseTitleInfo(title: TitlePreviewEntity, page: Page): Observable<TitlePreviewEntity> {
    return fromPromise(page.evaluate((config: AnilibriaScrapingTitlePageModel, title: TitlePreviewEntity) => {
      title.totalSeries = parseInt(
        document.getElementById(config.descriptionId).textContent.match(config.seriesRegexpSource)[1]
      );

      return title;
      }, this.titlePageConfig as unknown as SerializableOrJSHandle, title as unknown as SerializableOrJSHandle)
    );
  }
}
