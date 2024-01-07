import './index.scss';
import { boardGridGapSize } from '~/components/Board/constants';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/constants';
import type { PieceData } from './types';

export default function Piece(props: {
  additionalProperties?: Record<string, unknown>;
  additionalStyles?: React.CSSProperties;
  blockSize ?: number;
  className?: string;
  gridSize?: number;
  pieceData: PieceData;
}) {
  const numRows = props.pieceData.length;
  const numCols = Math.max(...props.pieceData.map(row => row.length));
  const pieceData = Array.from({ length: numRows }, (_, row) =>
    Array.from({ length: numCols }, (_, col) => props.pieceData[row][col] ?? BlockType.EMPTY)
  );

  const gridSize = props.gridSize ?? Math.max(numRows, numCols);

  return (
    <div
      {...props.additionalProperties}
      className={`Piece ${props.className ?? ''}`}
      style={{
        ...props.additionalStyles,
        gap: `${100 / (numRows / boardGridGapSize + numRows - 1)}% ${100 / (numCols / boardGridGapSize + numCols - 1)}%`,
        gridTemplate: `repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr)`,
        height: props.blockSize ? `${props.blockSize * (numRows + (numRows - 1) * boardGridGapSize)}px` : `${100 * (numRows + (numRows - 1) * boardGridGapSize) / (gridSize + (gridSize - 1) * boardGridGapSize)}%`,
        width: props.blockSize ? `${props.blockSize * (numCols + (numCols - 1) * boardGridGapSize)}px` : `${100 * (numCols + (numCols - 1) * boardGridGapSize) / (gridSize + (gridSize - 1) * boardGridGapSize)}%`
      }}
    >
      {pieceData.map((row, rowNum) => row.map((blockType, colNum) => (
        <div
          className="Piece-cell"
          key={`${rowNum},${colNum}`}
        >
          <Block
            type={blockType}
          />
        </div>
      )))}
    </div>
  );
}
