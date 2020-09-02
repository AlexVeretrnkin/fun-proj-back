export interface TorrentClient {
  on(event: string, callBack: (eventData) => void): void;
  add(torrentLink: string, options: any, callBack: (eventData) => void):void;
  destroy(): void;
}
