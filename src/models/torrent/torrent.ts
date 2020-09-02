import { TorrentFileModel } from './torrent-file';

export interface Torrent {
  files: TorrentFileModel[];
  progress: number;
  pieces: Array<any>;

  deselect(start: number, end: number, priority: number): void;
  on(event: string, callBack: () => void): void;

  destroy(): void;
}
