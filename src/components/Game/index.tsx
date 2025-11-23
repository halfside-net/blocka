import { DndContext, DragOverlay, useDraggable } from "@dnd-kit/core";
import { useRef, useState } from "react";
import TrophySVG from "../../assets/images/trophy.svg?react";
import Block from "../../components/Block";
import Board from "../../components/Board";
import { boardGridGapSize } from "../../components/Board/constants";
import {
  generateBoardState,
  pieceFitsOnBoard,
} from "../../components/Board/helpers";
import {
  BoardCellAddress,
  BoardCellOverlay,
} from "../../components/Board/types";
import Piece from "../../components/Piece";
import { pieceScore } from "../../components/Piece/helpers";
import { PieceData } from "../../components/Piece/types";
import { BlockType } from "../../schema/BlockType";
import { GameData } from "../../schema/GameData";
import { boardSize, numPieces, piecePool } from "./constants";
import { createNewGameData, getNextSeed, getPieces } from "./helpers";
import s from "./index.module.scss";

const gameCssVars: Record<string, string | number> = {
  "--board-size": boardSize,
  "--num-pieces": numPieces,
};

const maxPieceSize = Math.max(
  ...piecePool.map((pieceData) =>
    Math.max(pieceData.length, ...pieceData.map((row) => row.length))
  )
);

export default function Game(props: {
  disableAnimations?: boolean;
  gameData?: GameData;
  onSave?: (savedData: GameData) => void;
}) {
  const [activeCell, setActiveCell] = useState<BoardCellAddress | null>(null);
  const [activePiece, setActivePiece] = useState<PieceData | null>(null);
  const [activePieceIndex, setActivePieceIndex] = useState<number | null>(null);
  const [cellOverlays, setCellOverlays] = useState(new Set<BoardCellOverlay>());

  const boardCellRef = useRef<HTMLElement>();

  const activePieceBlockOffset = activePiece
    ? ((activePiece[0].length - 1) * (boardCellRef.current?.offsetWidth ?? 0)) /
      2
    : 0;

  function clearActivePiece() {
    setActiveCell(null);
    setActivePiece(null);
    setActivePieceIndex(null);
  }

  return (
    <div className={s.Game} style={gameCssVars}>
      <div className={s.Game_header}>
        <div className={s.Game_scores}>
          <div className={s.Game_score}>
            {(props.gameData?.score ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className={s.Game_score}>
            <TrophySVG className={s.Game_scoreIcon} title="High Score" />
            {(props.gameData?.highScore ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </div>
      <div className={s.Game_main}>
        <DndContext
          onDragCancel={clearActivePiece}
          onDragEnd={(event) => {
            const cell = event.over?.data.current;

            if (activePiece && cell) {
              const boardState = generateBoardState(
                boardSize,
                props.gameData?.boardState
              );
              const placedBlocks: BoardCellAddress[] = [];

              // Place the piece on the board if it fits
              if (
                pieceFitsOnBoard(boardState, activePiece, {
                  colNum: cell.colNum,
                  rowNum: cell.rowNum,
                })
              ) {
                activePiece.forEach((pieceRow, pieceRowNum) =>
                  pieceRow.forEach((block, pieceColNum) => {
                    if (block !== BlockType.EMPTY) {
                      const rowNum =
                        cell.rowNum - activePiece.length + pieceRowNum + 1;
                      const colNum =
                        cell.colNum - pieceRow.length + pieceColNum + 1;

                      boardState[rowNum][colNum] = block;
                      placedBlocks.push({ colNum, rowNum });
                    }
                  })
                );

                // Update piecesUsed and refresh if all are used
                const piecesUsed = Array.from(
                  { length: numPieces },
                  (_, i) =>
                    !!props.gameData?.piecesUsed?.[i] || i === activePieceIndex
                );
                const allPiecesUsed = piecesUsed.every((used) => used);
                const seed =
                  allPiecesUsed || props.gameData?.seed == null
                    ? getNextSeed(props.gameData?.seed)
                    : props.gameData.seed;

                // Update score
                const score =
                  (props.gameData?.score ?? 0) + pieceScore(activePiece);

                // Clear any rows or columns that are full
                const clearedRows = boardState
                  .map((row, rowNum) => ({ row, rowNum }))
                  .filter(({ row }) =>
                    row.every((block) => block !== BlockType.EMPTY)
                  )
                  .map(({ rowNum }) => rowNum);
                const clearedCols = boardState[0]
                  .map((_, colNum) => ({
                    col: boardState.map((row) => row[colNum]),
                    colNum,
                  }))
                  .filter(({ col }) =>
                    col.every((block) => block !== BlockType.EMPTY)
                  )
                  .map(({ colNum }) => colNum);
                const placedBlocksInClearedRows = placedBlocks.filter(
                  ({ rowNum }) => clearedRows.includes(rowNum)
                );
                const placedBlocksInClearedCols = placedBlocks.filter(
                  ({ colNum }) => clearedCols.includes(colNum)
                );
                const clearedBlocks: BoardCellAddress[] = [];
                const clearedBlockOverlays: BoardCellOverlay[] = [];

                for (const rowNum of clearedRows) {
                  for (
                    let colNum = 0;
                    colNum < boardState[rowNum].length;
                    colNum++
                  ) {
                    clearedBlocks.push({ rowNum, colNum });
                  }
                }

                for (const colNum of clearedCols) {
                  for (let rowNum = 0; rowNum < boardState.length; rowNum++) {
                    if (!clearedRows.includes(rowNum)) {
                      clearedBlocks.push({ rowNum, colNum });
                    }
                  }
                }

                for (const { rowNum, colNum } of clearedBlocks) {
                  if (!props.disableAnimations) {
                    const nearestClearedPlacedBlockDistance = Math.min(
                      ...placedBlocksInClearedRows
                        .filter((block) => rowNum === block.rowNum)
                        .map((block) => Math.abs(colNum - block.colNum)),
                      ...placedBlocksInClearedCols
                        .filter((block) => colNum === block.colNum)
                        .map((block) => Math.abs(rowNum - block.rowNum))
                    );

                    clearedBlockOverlays.push({
                      colNum,
                      content: (
                        <div
                          className={s.Game_clearedBlockOverlay}
                          style={{
                            animationDelay: `${
                              nearestClearedPlacedBlockDistance * 0.1
                            }s`,
                          }}
                        >
                          <Block type={boardState[rowNum][colNum]} />
                        </div>
                      ),
                      key: `${rowNum},${colNum},${activePieceIndex},${seed}`,
                      rowNum,
                    });
                  }

                  boardState[rowNum][colNum] = BlockType.EMPTY;
                }

                if (clearedBlockOverlays.length) {
                  setCellOverlays(
                    new Set([
                      // TODO: Make cleared block overlays remove themselves after the animation so that this doesn't need to clear all existing overlays
                      // ...cellOverlays,
                      ...clearedBlockOverlays,
                    ])
                  );
                }

                // Save game data
                const gameData = {
                  boardState,
                  highScore: Math.max(props.gameData?.highScore ?? 0, score),
                  piecesUsed: allPiecesUsed
                    ? Array.from({ length: numPieces }, () => false)
                    : piecesUsed,
                  score,
                  seed,
                } satisfies GameData;

                props.onSave?.(gameData);

                // Loss detection
                if (
                  getPieces(numPieces, gameData.seed).every(
                    (piece, i) =>
                      gameData.piecesUsed[i] ||
                      boardState.every((row, rowNum) =>
                        row.every(
                          (_, colNum) =>
                            !pieceFitsOnBoard(boardState, piece, {
                              rowNum,
                              colNum,
                            })
                        )
                      )
                  )
                ) {
                  window.setTimeout(() => {
                    if (window.confirm("No more moves! Start a new game?")) {
                      props.onSave?.(createNewGameData(gameData));
                    }
                  }, 1500);
                }
              }
            }

            clearActivePiece();
          }}
          onDragOver={(event) =>
            setActiveCell(
              event.over?.data.current
                ? {
                    colNum: event.over.data.current.colNum,
                    rowNum: event.over.data.current.rowNum,
                  }
                : null
            )
          }
          onDragStart={(event) => {
            setActivePiece(event.active.data.current?.pieceData ?? null);
            setActivePieceIndex(event.active.data.current?.pieceIndex ?? null);
          }}
        >
          <GameMain
            activeCell={activeCell}
            boardCellOverlays={cellOverlays}
            boardCellRef={boardCellRef}
            activePiece={activePiece}
            gameData={props.gameData}
          />
          <DragOverlay
            dropAnimation={props.disableAnimations ? null : undefined}
          >
            {activePiece && boardCellRef.current && (
              <div
                className={s.Game_activePieceWrapper}
                style={{
                  left: `calc(${
                    activePieceBlockOffset + boardGridGapSize
                  }px - 50%)`,
                }}
              >
                <Piece
                  blockSize={boardCellRef.current?.offsetWidth}
                  className={s.Game_activePiece}
                  pieceData={activePiece}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function GameMain(props: {
  activeCell: BoardCellAddress | null;
  boardCellOverlays: Set<BoardCellOverlay>;
  boardCellRef: React.MutableRefObject<HTMLElement | undefined>;
  activePiece: PieceData | null;
  gameData?: GameData;
}) {
  const pieces =
    props.gameData?.seed != null
      ? getPieces(numPieces, props.gameData.seed)
      : [];

  return (
    <>
      <Board
        activeCell={props.activeCell}
        cellOverlays={props.boardCellOverlays}
        cellRef={props.boardCellRef}
        className={s.Game_board}
        activePiece={props.activePiece}
        size={boardSize}
        state={props.gameData?.boardState}
      />
      <div className={s.Game_pieces}>
        {Array.from(
          { length: numPieces },
          (_, i) =>
            props.gameData?.seed != null &&
            pieces[i] && (
              <GamePieceSlot
                boardCellRef={props.boardCellRef}
                id={`piece-${i}-${props.gameData.seed}`}
                key={i}
                pieceData={pieces[i]}
                pieceIndex={i}
                used={props.gameData?.piecesUsed?.[i]}
              />
            )
        )}
      </div>
    </>
  );
}

function GamePieceSlot(props: {
  boardCellRef: React.MutableRefObject<HTMLElement | undefined>;
  id: string;
  pieceData: PieceData;
  pieceIndex: number;
  used?: boolean;
}) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } =
    useDraggable({
      attributes: {
        roleDescription: "Draggable piece",
      },
      data: {
        pieceData: props.pieceData,
        pieceIndex: props.pieceIndex,
      },
      id: props.id,
    });

  return (
    <div className={s.Game_pieceSlot}>
      {!props.used && (
        <div
          className={s.Game_pieceWrapper}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          <div
            className={s.Game_pieceDragAnchor}
            ref={setNodeRef}
            style={{
              height: props.boardCellRef.current?.offsetHeight,
              width: props.boardCellRef.current?.offsetWidth,
            }}
          />
          {!isDragging && (
            <Piece
              className={s.Game_piece}
              gridSize={maxPieceSize}
              pieceData={props.pieceData}
            />
          )}
        </div>
      )}
    </div>
  );
}
