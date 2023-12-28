import type { PieceData } from "~/components/Piece/types";
import { BlockType } from "../Block/types";

/**
 * Rotate a piece clockwise.
 * @param piece The piece to rotate
 * @param rotations The number of 90-degree rotations to perform
 */
export function rotatePiece(piece: PieceData, rotations = 1): PieceData {
  const intRotations = Math.floor(rotations);

  if (intRotations < 0 || 3 < intRotations) {
    return rotatePiece(piece, (intRotations % 4 + 4) % 4);
  } else if (intRotations == 0) {
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