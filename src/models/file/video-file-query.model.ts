import { IsNotEmpty } from 'class-validator';

export class VideoFileQueryModel {
  @IsNotEmpty()
  public titleId: number;

  @IsNotEmpty()
  public series: number;
}
