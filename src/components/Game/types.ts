import { BoardState } from '~/components/Board/types';

export interface GameData {
  boardState?: BoardState;
  highScore?: number;
  piecesUsed?: boolean[];
  score?: number;
  seed: number;
}
