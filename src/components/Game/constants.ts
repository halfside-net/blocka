import { BlockType } from "~/components/Block/types";
import type { PieceData } from "~/components/Piece/types";
import { rotatePiece } from "./helpers";

// Board Configuration

export const boardHeight = 10;
export const boardWidth = 10;
export const numPieces = 3;

// Piece Shapes

export const square1: PieceData = [
  [BlockType.NORMAL]
];

export const square2: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL],
  [BlockType.NORMAL, BlockType.NORMAL]
];

export const square3: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL],
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL],
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL]
];

export const straight2: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL]
];

export const straight3: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL]
];

export const straight4: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL]
];

export const straight5: PieceData = [
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL]
];

export const l2: PieceData = [
  [BlockType.NORMAL, BlockType.EMPTY],
  [BlockType.NORMAL, BlockType.NORMAL]
];

export const l3: PieceData = [
  [BlockType.NORMAL, BlockType.EMPTY, BlockType.EMPTY],
  [BlockType.NORMAL, BlockType.EMPTY, BlockType.EMPTY],
  [BlockType.NORMAL, BlockType.NORMAL, BlockType.NORMAL]
];

// Piece Pool

// Each piece has an equal chance of being selected.
// To increase probablity of a piece, include it multiple times.
export const piecePool: PieceData[] = [
  square1,
  square2,
  square3,
  straight2,
  rotatePiece(straight2),
  straight3,
  rotatePiece(straight3),
  straight4,
  rotatePiece(straight4),
  straight5,
  rotatePiece(straight5),
  l2,
  rotatePiece(l2),
  rotatePiece(l2, 2),
  rotatePiece(l2, 3),
  l3,
  rotatePiece(l3),
  rotatePiece(l3, 2),
  rotatePiece(l3, 3)
];
