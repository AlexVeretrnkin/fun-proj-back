import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { TitlePreviewEntity } from './title-preview.entity';

@Entity('title_video')
export class TitleVideoEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  @ManyToOne(() => TitlePreviewEntity, title => title.id)
  public titleId: number;

  @Unique(['fileLocation'])
  @Column()
  public fileLocation: string;

  @Column()
  public series: number;


  constructor(titleVideo?: TitleVideoEntity) {
    if (titleVideo) {
      this.titleId = titleVideo.titleId;
      this.fileLocation = titleVideo.fileLocation;
      this.series = titleVideo.series;
    }
  }
}
