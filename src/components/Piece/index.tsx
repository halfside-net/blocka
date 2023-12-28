import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { PieceData } from './types';

export default function Piece(props: {
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
  const gridRows = gridSize % 2 == numRows % 2 ? `repeat(${gridSize}, 1fr)` : `0.5fr repeat(${gridSize - 1}, 1fr) 0.5fr`;
  const gridCols = gridSize % 2 == numCols % 2 ? `repeat(${gridSize}, 1fr)` : `0.5fr repeat(${gridSize - 1}, 1fr) 0.5fr`;
  const rowStart = Math.ceil((gridSize - numRows) / 2) + 1;
  const colStart = Math.ceil((gridSize - numCols) / 2) + 1;

  return (
    <div
      className={`Piece ${props.className ?? ''}`}
      style={{
        ['--piece-grid-size' as string]: gridSize,
        gridTemplate: `${gridRows} / ${gridCols}`
      }}
    >
      {pieceData.map((row, rowNum) => row.map((blockType, colNum) => (
        <div
          className="Piece-cell"
          key={`${rowNum},${colNum}`}
          style={{
            gridArea: `${rowStart + rowNum} / ${colStart + colNum}`
          }}
        >
          <Block
            type={blockType}
          />
        </div>
      )))}
    </div>
  );
}
