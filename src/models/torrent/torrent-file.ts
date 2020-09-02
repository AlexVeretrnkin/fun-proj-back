export interface TorrentFileModel {
  name: string;
  path: string;
  progress: number;

  select(): void;
}
