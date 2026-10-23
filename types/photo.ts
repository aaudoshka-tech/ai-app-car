export interface SelectedPhoto {
  id: string;
  uri: string;
  width: number;
  height: number;
}

export interface RankedPhoto extends SelectedPhoto {
  rank: number;
  score: number;
  coverScore: number;
  isCover: boolean;
  reason: string;
}
