import { HttpStatus } from '@nestjs/common';

import { OutgoingHttpHeaders } from "http2";

export class VideoFileResponseModel {
  public status: HttpStatus;
  public header: OutgoingHttpHeaders;
  public start?: number;
  public end?: number;

  constructor(status?: VideoFileResponseModel) {
    if (status) {
      this.status = status.status;
      this.header = status.header;
      this.start = status.start;
      this.end = status.end;
    }
  }
}
