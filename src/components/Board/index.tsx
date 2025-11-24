import { useDroppable } from "@dnd-kit/core";
import c from "classnames";
import Block from "../../components/Block";
import { PieceData } from "../../components/Piece/types";
import { BlockType } from "../../schema/BlockType";
import { BoardState } from "../../schema/GameData";
import s from "./Board.module.scss";
import { boardGridGapSize } from "./constants";
import {
  generateBoardState,
  getCellId,
  getPieceBlockForCell,
  pieceFitsOnBoard,
} from "./helpers";
import { BoardCellAddress, BoardCellOverlay } from "./types";

export default function Board(props: {
  activeCell?: BoardCellAddress | null;
  cellOverlays?: Set<BoardCellOverlay>;
  /**
   * Reference to the first cell on the board
   */
  cellRef?: React.MutableRefObject<HTMLElement | undefined>;
  className?: string;
  activePiece?: PieceData | null;
  size: number;
  state?: BoardState;
}) {
  const boardGapAsPercent = `${
    100 / (1 + props.size * (1 + 1 / boardGridGapSize))
  }%`;
  const boardState = generateBoardState(props.size, props.state);
  const cellIdToOverlays = Array.from(props.cellOverlays ?? []).reduce<
    Record<string, BoardCellOverlay[]>
  >((acc, cellOverlay) => {
    (acc[getCellId(cellOverlay.rowNum, cellOverlay.colNum)] ??= []).push(
      cellOverlay
    );
    return acc;
  }, {});

  const activePieceFits =
    props.activePiece &&
    props.activeCell &&
    pieceFitsOnBoard(boardState, props.activePiece, props.activeCell);

  return (
    <div className={c(s.Board, props.className)}>
      <div
        className={s.Board_grid}
        style={{
          gap: boardGapAsPercent,
          gridTemplateColumns: `repeat(${props.size}, 1fr)`,
          padding: boardGapAsPercent,
        }}
      >
        {boardState.map((row, rowNum) =>
          row.map((blockType, colNum) => {
            const id = getCellId(rowNum, colNum);
            const previewBlock = activePieceFits
              ? getPieceBlockForCell(
                  props.activePiece!,
                  props.activeCell!,
                  rowNum,
                  colNum
                )
              : undefined;
            const showPreview =
              previewBlock != null && previewBlock !== BlockType.EMPTY;

            return (
              <BoardCell
                blockType={showPreview ? previewBlock : blockType}
                cellRef={
                  rowNum === 0 && colNum === 0 ? props.cellRef : undefined
                }
                colNum={colNum}
                id={id}
                isPreview={showPreview}
                key={`${rowNum},${colNum}`}
                overlays={cellIdToOverlays[id]}
                rowNum={rowNum}
              />
            );
          })
        )}
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
      rowNum: props.rowNum,
    },
    id: props.id,
  });

  return (
    <div
      className={s.Board_cell}
      id={props.id}
      ref={(element) => {
        setNodeRef(element);

        if (props.cellRef) {
          props.cellRef.current = element ?? undefined;
        }
      }}
    >
      <Block isPreview={props.isPreview} type={props.blockType} />
      {props.overlays?.map((overlay) => (
        <div
          className={c(s.Board_cellOverlay, overlay.className)}
          key={overlay.key}
          style={{
            zIndex: overlay.zIndex,
          }}
        >
          {overlay.content}
        </div>
      ))}
    </div>
  );
}
