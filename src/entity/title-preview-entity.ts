import { Column, Entity, PrimaryColumn } from 'typeorm';

import { StatusEnum } from '../models/status.enum';

@Entity()
export class TitlePreviewEntity {
  @Column()
  @PrimaryColumn()
  public id: number;

  @Column()
  public imgUrl: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public series: number;

  @Column()
  public totalSeries: number;

  @Column()
  public status: StatusEnum;

  @Column()
  public titleLink: string;

  constructor(title?: TitlePreviewEntity) {
    if (title) {
      this.id = title.id;
      this.imgUrl = title.imgUrl;
      this.title = title.title;
      this.description = title.description;
      this.series = title.series;
      this.totalSeries = title.totalSeries;
      this.status = title.status;
      this.titleLink = title.titleLink;
    }
  }
}
