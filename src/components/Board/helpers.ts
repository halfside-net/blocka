import { PieceData } from "../../components/Piece/types";
import { BlockType } from "../../schema/BlockType";
import { BoardState } from "../../schema/GameData";
import { BoardCellAddress } from "./types";

export function generateBoardState(size: number, initialState?: BoardState) {
  return Array.from({ length: size }, (_, row) =>
    Array.from(
      { length: size },
      (_, col) => initialState?.[row]?.[col] ?? BlockType.EMPTY
    )
  );
}

export function getCellId(rowNum: number, colNum: number) {
  return `board-cell-${rowNum}-${colNum}`;
}

export function getPieceBlockForCell(
  pieceData: PieceData,
  activeCell: BoardCellAddress,
  rowNum: number,
  colNum: number
): BlockType | undefined {
  const pieceRowNum = rowNum - activeCell.rowNum + pieceData.length - 1;

  return pieceData[pieceRowNum]?.[
    colNum - activeCell.colNum + pieceData[pieceRowNum].length - 1
  ];
}

export function pieceFitsOnBoard(
  boardState: BoardState,
  pieceData: PieceData,
  activeCell: BoardCellAddress
) {
  return pieceData.every((row, rowNum) =>
    row.every((block, colNum) => {
      const boardBlock =
        boardState[activeCell.rowNum - pieceData.length + rowNum + 1]?.[
          activeCell.colNum - row.length + colNum + 1
        ];

      return block === BlockType.EMPTY || boardBlock === BlockType.EMPTY;
    })
  );
}
