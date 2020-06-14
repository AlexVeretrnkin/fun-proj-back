import { AnilibriaScrapingPreviewModel } from '../scraping/anilibria-scraping-preview.model';

export const anilibriaScrapingPreviewConfig: AnilibriaScrapingPreviewModel = {
  previewItemClassName: 'goodcell',
  titleLinkUrlClassName: '',
  titleDescriptionClassName: 'schedule-description',
  titleSeriesClassName: 'schedule-series',
  titleNameClassName: 'schedule-runame',
  titleImageClassName: '',
  titleIdRegexpSource: '\\?(\\d+)'
};
