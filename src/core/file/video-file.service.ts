import { HttpStatus, Injectable } from '@nestjs/common';

import * as fs from 'fs';

import { OutgoingHttpHeaders } from 'http2';

import { VideoFileResponseModel } from '../../models/file/video-file-response.model';
import { Response, Request } from 'express';

@Injectable()
export class VideoFileService {
  public getVideo(request: Request, response: Response, videoLocation: string): void {
    const videoStatus: VideoFileResponseModel = this.getVideoFileHeaders(videoLocation, request.headers.range);

    response.writeHead(videoStatus.status, videoStatus.header);
    fs.createReadStream(
      videoLocation,
      videoStatus.start ? {start: videoStatus.start, end: videoStatus.end} : null
    ).pipe(response);
  }

  public getVideoFileHeaders(filePath: string, range?: string): VideoFileResponseModel {
    const stat = fs.statSync(filePath);

    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');

      const start = parseInt(parts[0], 10);

      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;

      const head: OutgoingHttpHeaders = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4'
      };

      return new VideoFileResponseModel({
        status: HttpStatus.PARTIAL_CONTENT,
        header: head,
        start,
        end
      });
    } else {
      const head: OutgoingHttpHeaders = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };

      return new VideoFileResponseModel({
        status: HttpStatus.OK,
        header: head
      });
    }
  }
}
