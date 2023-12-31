import { BlockType } from '~/components/Block/types';
import { PieceData } from '~/components/Piece/types';
import type { BoardCellData } from './types';

export function getPieceBlockForCell(
  pieceData: PieceData,
  activeCell: BoardCellData,
  rowNum: number,
  colNum: number
): BlockType | undefined {
  const pieceRowNum = rowNum - activeCell.rowNum + pieceData.length - 1;

  return pieceData[pieceRowNum]?.[colNum - activeCell.colNum + pieceData[pieceRowNum].length - 1];
}
