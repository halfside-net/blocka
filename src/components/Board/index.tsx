import './index.scss';
import { useDroppable } from '@dnd-kit/core';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import type { BoardState } from './types';

export default function Board(props: {
  cellRef?: React.MutableRefObject<HTMLDivElement | undefined>; // Reference to the first cell on the board
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
          <BoardCell
            blockType={blockType}
            cellRef={rowNum === 0 && colNum === 0 ? props.cellRef : undefined}
            id={`board-cell-${rowNum}-${colNum}`}
            key={`${rowNum},${colNum}`}
          />
        )))}
      </div>
    </div>
  );
}

function BoardCell(props: {
  blockType: BlockType;
  cellRef?: React.MutableRefObject<HTMLDivElement | undefined>;
  id: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div
      className="Board-cell"
      id={props.id}
      ref={(element) => {
        setNodeRef(element);

        if (props.cellRef) {
          props.cellRef.current = element ?? undefined;
        }
      }}
      style={{ outline: isOver ? '2px solid lime' : 'none' }} // TODO: Remove this
    >
      <Block
        type={props.blockType}
      />
    </div>
  );
}
