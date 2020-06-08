import { Injectable } from '@nestjs/common';

import { Browser, launch, Page } from 'puppeteer';

import { TitlePreviewModel } from '../../models/title-preview.model';

@Injectable()
export class WebScrapingService {
  private readonly ongoingCell: string = 'goodcell';

  private infoData: TitlePreviewModel[] = [];

  public async parseSite(): Promise<TitlePreviewModel[]> {
    console.log(this.infoData);

    const browser: Browser = await launch();

    const page: Page = await browser.newPage();

    await page.goto('https://www.anilibria.tv/pages/schedule.php');

    this.infoData = await page.evaluate(() => {
      const infoItem: Record<string, any> = {};

      const info: Record<string, any>[] = [];

      [...document.getElementsByClassName('goodcell')]
        .forEach((item: HTMLLinkElement, idx: number) => {
            [...item.children].forEach((item: Element & HTMLImageElement) => {
              [...item.children].forEach((item: Element & HTMLImageElement) => {
                if (item.children[0]) {
                  infoItem.title = item.children[0].textContent;
                  infoItem.series = parseInt(item.children[1].textContent.charAt(item.children[1].textContent.length - 1));
                  infoItem.description = item.children[2].textContent;
                } else {
                  infoItem.imgUrl = item.src;
                }
              });
            });

            info.push({...infoItem})
          });

      return info;
    }) as TitlePreviewModel[];

    await browser.close();

    return this.infoData;
  }
}
