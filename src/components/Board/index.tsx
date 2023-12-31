import './index.scss';
import { useDroppable } from '@dnd-kit/core';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import { PieceData } from '~/components/Piece/types';
import { generateBoardState, getPieceBlockForCell, pieceFitsOnBoard } from './helpers';
import type { BoardCellData, BoardState } from './types';

export default function Board(props: {
  activeCell?: BoardCellData | null;
  cellRef?: React.MutableRefObject<HTMLDivElement | undefined>; // Reference to the first cell on the board
  className?: string;
  draggingPiece?: PieceData | null;
  size: number;
  state?: BoardState;
}) {
  const boardState = generateBoardState(props.size, props.state);
  const draggingPieceFits = props.draggingPiece && props.activeCell && pieceFitsOnBoard(boardState, props.draggingPiece, props.activeCell);

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
