import './index.scss';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { BoardState } from './types';

export default function Board(props: {
  className?: string;
  height: number;
  state?: BoardState;
  width: number;
}) {
  const boardState = Array.from({ length: props.height }, (_, row) =>
    Array.from({ length: props.width }, (_, col) => props.state?.[row]?.[col] ?? BlockType.EMPTY)
  );

  return (
    <div
      className={`Board ${props.className ?? ''}`}
      style={{
        aspectRatio: `calc(${props.width} + ${props.width + 1} * var(--board-dbr) + 2 * var(--board-pbr)) / calc(${props.height} + ${props.height + 1} * var(--board-dbr) + 2 * var(--board-pbr))`,
        maxHeight: `calc((100vw - 2 * var(--game-padding-side)) * (${props.height} + ${props.height + 1} * var(--board-dbr) + 2 * var(--board-pbr)) / (${props.width} + ${props.width + 1} * var(--board-dbr) + 2 * var(--board-pbr)))`,
        padding: `calc(100% * var(--board-pbr) / (${props.width} + ${props.width + 1} * var(--board-dbr) + 2 * var(--board-pbr)))`,
      }}
    >
      <div
        className="Board-grid"
        style={{
          columnGap: `calc(100% * var(--board-dbr) / (${props.width} + ${props.width + 1} * var(--board-dbr)))`,
          gridTemplateColumns: `repeat(${props.width}, 1fr)`,
          padding: `calc(100% * var(--board-dbr) / (${props.width} + ${props.width + 1} * var(--board-dbr)))`,
          rowGap: `calc(100% * var(--board-dbr) / (${props.height} + ${props.height + 1} * var(--board-dbr)))`
        }}
      >
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
