import { Injectable, Scope } from '@nestjs/common';
import { writeFileSync } from 'fs'

import * as WebTorrent from 'webtorrent'
import { interval, Subscription } from 'rxjs';

@Injectable({scope: Scope.REQUEST})
export class TorrentLoaderService {
  public downloadTorrent(torrentLing: string, downloadPath = 'src/core/photo-comparing/file.mp4'): void {
    console.log(WebTorrent);

    const client: WebTorrent = new WebTorrent();

    client.add(torrentLing, {path: downloadPath}, (torrent) => {

      const subscription: Subscription = interval(5000).subscribe(
        () => console.log('Progress', torrent.progress * 100)
      );

      torrent.on('done', () => {
         console.log('torrent download finished')

        const file = torrent.files.find((item) => item.name.endsWith('.mp4'));

        file.getBuffer((err, buffer) => {
          if (err) console.log('BOroda!');

          console.log(buffer);

          writeFileSync(`src/core/photo-comparing/${file.name}`, buffer);
        });


        subscription.unsubscribe();
      })
   });
  }
}
