import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { PieceData } from './types';

export default function Piece(props: {
  pieceData: PieceData;
}) {
  const numRows = props.pieceData.length;
  const numCols = Math.max(...props.pieceData.map(row => row.length));
  const pieceData = Array.from({ length: numRows }, (_, row) =>
    Array.from({ length: numCols }, (_, col) => props.pieceData[row][col] ?? BlockType.EMPTY)
  );

  return (
    <div
      className="Piece"
      style={{
        aspectRatio: `calc(${numCols} + ${numCols - 1} * var(--piece-dbr)) / calc(${numRows} + ${numRows - 1} * var(--piece-dbr))`,
        gridTemplateColumns: `repeat(${pieceData[0].length}, 1fr)`,
        [numRows > numCols ? 'height' : 'width']: '100%'
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
