import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
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
        gap: `calc(100% / (${numRows} / var(--block-gap-ratio) + ${numRows - 1})) calc(100% / (${numCols} / var(--block-gap-ratio) + ${numCols - 1}))`,
        gridTemplate: `repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr)`,
        height: props.blockSize ? `calc(${numRows * props.blockSize}px + ${(numRows - 1) * props.blockSize}px * var(--block-gap-ratio))` : `calc(100% * (${numRows} + ${numRows - 1} * var(--block-gap-ratio)) / (${gridSize} + ${gridSize - 1} * var(--block-gap-ratio)))`,
        width: props.blockSize ? `calc(${numCols * props.blockSize}px + ${(numCols - 1) * props.blockSize}px * var(--block-gap-ratio))` : `calc(100% * (${numCols} + ${numCols - 1} * var(--block-gap-ratio)) / (${gridSize} + ${gridSize - 1} * var(--block-gap-ratio)))`
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
