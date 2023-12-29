import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { PieceData } from './types';

export default function Piece(props: {
  additionalProperties?: Record<string, unknown>;
  className?: string;
  gridSize?: number;
  pieceData: PieceData;
  setRef?: (ref: HTMLElement | null) => void;
  transform?: string;
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
      ref={props.setRef}
      style={{
        gap: `calc(100% / (${numRows} / var(--piece-gbr) + ${numRows - 1})) calc(100% / (${numCols} / var(--piece-gbr) + ${numCols - 1}))`,
        gridTemplate: `repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr)`,
        height: `calc(100% * (${numRows} + ${numRows - 1} * var(--piece-gbr)) / (${gridSize} + ${gridSize - 1} * var(--piece-gbr)))`,
        width: `calc(100% * (${numCols} + ${numCols - 1} * var(--piece-gbr)) / (${gridSize} + ${gridSize - 1} * var(--piece-gbr)))`,
        transform: props.transform,
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
