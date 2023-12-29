import './index.scss';
import { useDroppable } from '@dnd-kit/core';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { BoardState } from './types';

export default function Board(props: {
  cellRef?: React.RefObject<HTMLDivElement>; // Reference to the first cell on the board
  className?: string;
  size: number;
  state?: BoardState;
}) {
  const boardState = Array.from({ length: props.size }, (_, row) =>
    Array.from({ length: props.size }, (_, col) => props.state?.[row]?.[col] ?? BlockType.EMPTY)
  );

  const { isOver, setNodeRef } = useDroppable({
    id: 'board-grid',
  });

  return (
    <div className={`Board ${props.className ?? ''}`}>
      <div
        className="Board-grid"
        ref={setNodeRef}
        style={{ outline: isOver ? '2px solid lime' : 'none' }} // TODO: Remove this
      >
        {boardState.map((row, rowNum) => row.map((blockType, colNum) => (
          <div
            className="Board-cell"
            key={`${rowNum},${colNum}`}
            ref={rowNum == 0 && colNum == 0 ? props.cellRef : undefined}
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
