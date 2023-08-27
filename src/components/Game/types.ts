import { BoardState } from '~/components/Board/types';

export interface GameData {
  boardState?: BoardState;
  piecesUsed?: boolean[];
  score?: number;
  seed?: number;
}
