import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { BoardState } from './types';

export default function Board(props: {
  className?: string;
  size: number;
  state?: BoardState;
}) {
  const boardState = Array.from({ length: props.size }, (_, row) =>
    Array.from({ length: props.size }, (_, col) => props.state?.[row]?.[col] ?? BlockType.EMPTY)
  );

  return (
    <div className={`Board ${props.className ?? ''}`}>
      <div className="Board-grid">
        {boardState.map((row, rowNum) => row.map((blockType, colNum) => (
          <div
            className="Board-cell"
            key={`${rowNum},${colNum}`}
          >
            <Block
              type={blockType}
            />
          </div>
        )))}
      </div>
    </div>
  );
}
