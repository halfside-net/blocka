import './index.scss';
import { useDroppable } from '@dnd-kit/core';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import { PieceData } from '~/components/Piece/types';
import { getPieceBlockForCell } from './helpers';
import type { BoardCellData, BoardState } from './types';

export default function Board(props: {
  activeCell?: BoardCellData | null;
  cellRef?: React.MutableRefObject<HTMLDivElement | undefined>; // Reference to the first cell on the board
  className?: string;
  draggingPiece?: PieceData | null;
  size: number;
  state?: BoardState;
}) {
  const boardState = Array.from({ length: props.size }, (_, row) =>
    Array.from({ length: props.size }, (_, col) => props.state?.[row]?.[col] ?? BlockType.EMPTY)
  );

  const draggingPieceFits = props.activeCell && props.draggingPiece?.every((row, rowNum) =>
    row.every((block, colNum) => block == BlockType.EMPTY ||
      boardState[props.activeCell!.rowNum - props.draggingPiece!.length + 1 + rowNum]?.[props.activeCell!.colNum - row.length + 1 + colNum] == BlockType.EMPTY)
  );

  return (
    <div className={`Board ${props.className ?? ''}`}>
      <div className="Board-grid">
        {boardState.map((row, rowNum) => row.map((blockType, colNum) => {
          const previewBlock = draggingPieceFits ? getPieceBlockForCell(props.draggingPiece!, props.activeCell!, rowNum, colNum) : undefined;

          return (
            <BoardCell
              blockType={previewBlock ?? blockType}
              cellRef={rowNum === 0 && colNum === 0 ? props.cellRef : undefined}
              colNum={colNum}
              id={`board-cell-${rowNum}-${colNum}`}
              key={`${rowNum},${colNum}`}
              preview={previewBlock != null}
              rowNum={rowNum}
            />
          );
        }))}
      </div>
    </div>
  );
}

function BoardCell(props: {
  blockType: BlockType;
  cellRef?: React.MutableRefObject<HTMLDivElement | undefined>;
  colNum: number;
  id: string;
  preview?: boolean;
  rowNum: number;
}) {
  const { setNodeRef } = useDroppable({
    data: {
      colNum: props.colNum,
      rowNum: props.rowNum
    },
    id: props.id
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
    >
      <Block
        preview={props.preview}
        type={props.blockType}
      />
    </div>
  );
}
