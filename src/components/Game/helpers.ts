import { BlockType } from '~/components/Block/constants';
import type { PieceData } from '~/components/Piece/types';
import { mulberry32Generator } from '~/ts/helpers';
import { piecePool } from './constants';
import type { GameData } from './types';

export function getPieces(numPieces: number, seed: number): PieceData[] {
  const rng = mulberry32Generator(seed, 60454930);

  return Array.from({ length: numPieces }, () => piecePool[Math.floor(rng() * piecePool.length)]);
}

export function newGameData(data?: GameData): GameData {
  return {
    highScore: data?.highScore,
    seed: newGameDataSeed()
  };
}

export function newGameDataSeed(currentSeed?: number): number {
  return mulberry32Generator(currentSeed ?? Math.floor(Math.random() * 4294967296), 34729475)() * 4294967296;
}

/**
 * Rotate a piece clockwise.
 * @param piece The piece to rotate
 * @param rotations The number of 90-degree rotations to perform
 */
export function rotatePiece(piece: PieceData, rotations = 1): PieceData {
  const intRotations = Math.floor(rotations);

  if (intRotations < 0 || 3 < intRotations) {
    return rotatePiece(piece, (intRotations % 4 + 4) % 4);
  } else if (intRotations === 0) {
    return piece;
  }

  const rotatedHeight = Math.max(...piece.map(row => row.length));
  const rotatedPiece: PieceData = [];

  for (let i = 0; i < rotatedHeight; i++) {
    rotatedPiece.push([]);

    for (let j = 0; j < piece.length; j++) {
      rotatedPiece[i].push(piece[piece.length - j - 1][i] ?? BlockType.EMPTY);
    }
  }

  return rotatePiece(rotatedPiece, intRotations - 1);
}
