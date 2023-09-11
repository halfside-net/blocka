import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { BoardState } from './types';

export default function Board(props: {
  height: number;
  state?: BoardState;
  width: number;
}) {
  const boardState = Array.from({ length: props.height }, (_, row) =>
    Array.from({ length: props.width }, (_, col) => props.state?.[row]?.[col] ?? BlockType.EMPTY)
  );

  return (
    <div className="Board">
      <div
        className="Board-grid"
        style={{
          gridTemplateColumns: `repeat(${props.width}, 1fr)`
        }}
      >
        {boardState.map((row, rowNum) => row.map((blockType, colNum) => (
          <div className="Board-cell">
            <Block
              key={`${rowNum},${colNum}`}
              type={blockType}
            />
          </div>
        )))}
      </div>
    </div>
  );
}
