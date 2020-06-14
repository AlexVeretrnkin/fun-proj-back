import { StatusEnum } from './status.enum';

export class PreviewModel {
  public id: number;
  public imgUrl: string;
  public title: string;
  public description: string;
  public series: number;
  public totalSeries: number;
  public status: StatusEnum;

  constructor(preview: PreviewModel) {
    this.id = preview.id;
    this.imgUrl = preview.imgUrl;
    this.title = preview.title;
    this.description = preview.description;
    this.series = preview.series;
    this.totalSeries = preview.totalSeries;
    this.status = preview.status;
  }
}
