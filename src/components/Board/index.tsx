import './index.scss';
import { useDroppable } from '@dnd-kit/core';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import { PieceData } from '~/components/Piece/types';
import { generateBoardState, getCellId, getPieceBlockForCell, pieceFitsOnBoard } from './helpers';
import type { BoardCellAddress, BoardCellOverlay, BoardState } from './types';

export default function Board(props: {
  activeCell?: BoardCellAddress | null;
  cellOverlays?: Set<BoardCellOverlay>;
  cellRef?: React.MutableRefObject<HTMLElement | undefined>; // Reference to the first cell on the board
  className?: string;
  activePiece?: PieceData | null;
  size: number;
  state?: BoardState;
}) {
  const boardState = generateBoardState(props.size, props.state);
  const cellIdToOverlays = Array.from(props.cellOverlays ?? [])
    .reduce<Record<string, BoardCellOverlay[]>>((acc, cellOverlay) => {
      (acc[getCellId(cellOverlay.rowNum, cellOverlay.colNum)] ??= []).push(cellOverlay);
      return acc;
    }, {});

  const activePieceFits = props.activePiece && props.activeCell && pieceFitsOnBoard(boardState, props.activePiece, props.activeCell);

  return (
    <div className={`Board ${props.className ?? ''}`}>
      <div className="Board-grid">
        {boardState.map((row, rowNum) => row.map((blockType, colNum) => {
          const id = getCellId(rowNum, colNum);
          const previewBlock = activePieceFits ? getPieceBlockForCell(props.activePiece!, props.activeCell!, rowNum, colNum) : undefined;
          const showPreview = previewBlock != null && previewBlock !== BlockType.EMPTY;

          return (
            <BoardCell
              blockType={showPreview ? previewBlock : blockType}
              cellRef={rowNum === 0 && colNum === 0 ? props.cellRef : undefined}
              colNum={colNum}
              id={id}
              isPreview={showPreview}
              key={`${rowNum},${colNum}`}
              overlays={cellIdToOverlays[id]}
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
  cellRef?: React.MutableRefObject<HTMLElement | undefined>;
  colNum: number;
  id: string;
  isPreview?: boolean;
  overlays?: BoardCellOverlay[];
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
        isPreview={props.isPreview}
        type={props.blockType}
      />
      {props.overlays?.map((overlay) => (
        <div
          className="Board-cellOverlay"
          key={overlay.key}
          style={{
            zIndex: overlay.zIndex
          }}
        >
          {overlay.content}
        </div>
      ))}
    </div>
  );
}
