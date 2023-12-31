import './index.scss';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import { useRef, useState } from 'react';
import { ReactComponent as TrophySVG } from '~/assets/images/trophy.svg';
import Board from '~/components/Board';
import { generateBoardState, pieceFitsOnBoard } from '~/components/Board/helpers';
import type { BoardCellAddress, BoardCellOverlay } from '~/components/Board/types';
import Block from '~/components/Block';
import { BlockType } from '~/components/Block/types';
import Piece from '~/components/Piece';
import { pieceScore } from '~/components/Piece/helpers';
import type { PieceData } from '~/components/Piece/types';
import { boardSize, numPieces, piecePool } from './constants';
import { newGameDataSeed, getPieces, newGameData } from './helpers';
import type { GameData } from './types';

const maxPieceSize = Math.max(...piecePool.map(pieceData => Math.max(pieceData.length, ...pieceData.map(row => row.length))));

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

  const activePieceBlockOffset = activePiece ? (activePiece[0].length - 1) * (boardCellRef.current?.offsetWidth ?? 0) / 2 : 0;

  function clearActivePiece() {
    setActiveCell(null);
    setActivePiece(null);
    setActivePieceIndex(null);
  }

  return (
    <div
      className="Game"
      style={{
        ['--board-size' as string]: boardSize,
        ['--num-pieces' as string]: numPieces
      }}
    >
      <div className="Game-header">
        <div className="Game-scores">
          <div className="Game-score Game-score--current">
            <span className="Game-scoreValue">
              {(props.gameData?.score ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
          </div>
          <div className="Game-score Game-score--best">
            <TrophySVG
              className="Game-scoreIcon"
              title="High Score"
            />
            <span className="Game-scoreValue">
              {(props.gameData?.highScore ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
          </div>
        </div>
      </div>
      <DndContext
        onDragCancel={clearActivePiece}
        onDragEnd={event => {
          if (activePiece && event.over?.data.current) {
            const boardState = generateBoardState(boardSize, props.gameData?.boardState);
            const placedBlocks: BoardCellAddress[] = [];

            // Place the piece on the board if it fits
            if (pieceFitsOnBoard(boardState, activePiece, {
              colNum: event.over.data.current.colNum,
              rowNum: event.over.data.current.rowNum
            })) {
              activePiece.forEach((pieceRow, pieceRowNum) =>
                pieceRow.forEach((block, pieceColNum) => {
                  if (block !== BlockType.EMPTY) {
                    const rowNum = event.over!.data.current!.rowNum - activePiece.length + pieceRowNum + 1;
                    const colNum = event.over!.data.current!.colNum - pieceRow.length + pieceColNum + 1;

                    boardState[rowNum][colNum] = block;
                    placedBlocks.push({ colNum, rowNum });
                  }
                })
              );

              // Update piecesUsed and refresh if all are used
              const piecesUsed = Array.from({ length: numPieces }, (_, i) => !!props.gameData?.piecesUsed?.[i] || i === activePieceIndex);
              const allPiecesUsed = piecesUsed.every(used => used);
              const seed = allPiecesUsed || props.gameData?.seed == null ? newGameDataSeed(props.gameData?.seed) : props.gameData.seed;

              // Update score
              const score = (props.gameData?.score ?? 0) + pieceScore(activePiece);

              // Clear any rows or columns that are full
              const clearedRows = boardState
                .map((row, rowNum) => ({ row, rowNum }))
                .filter(({ row }) => row.every(block => block !== BlockType.EMPTY))
                .map(({ rowNum }) => rowNum);
              const clearedCols = boardState[0]
                .map((_, colNum) => ({ col: boardState.map(row => (row[colNum])), colNum }))
                .filter(({ col }) => col.every(block => block !== BlockType.EMPTY))
                .map(({ colNum }) => colNum);
              const placedBlocksInClearedRows = placedBlocks.filter(({ rowNum }) => clearedRows.includes(rowNum));
              const placedBlocksInClearedCols = placedBlocks.filter(({ colNum }) => clearedCols.includes(colNum));
              const clearedBlocks: BoardCellAddress[] = [];
              const clearedBlockOverlays: BoardCellOverlay[] = [];

              clearedRows.forEach(rowNum => {
                clearedBlocks.push(...boardState[rowNum].map((_, colNum) => ({ rowNum, colNum })));
              });
              clearedCols.forEach(colNum => boardState.forEach((row, rowNum) => {
                if (!clearedRows.includes(rowNum)) {
                  clearedBlocks.push({ rowNum, colNum });
                }
              }));

              clearedBlocks.forEach(({ rowNum, colNum }) => {
                if (!props.disableAnimations) {
                  const nearestClearedPlacedBlockDistance = Math.min(
                    ...placedBlocksInClearedRows
                      .filter(({ rowNum: placedRowNum }) => rowNum === placedRowNum)
                      .map(({ colNum: placedColNum }) => Math.abs(colNum - placedColNum)),
                    ...placedBlocksInClearedCols
                      .filter(({ colNum: placedColNum }) => colNum === placedColNum)
                      .map(({ rowNum: placedRowNum }) => Math.abs(rowNum - placedRowNum))
                  );

                  clearedBlockOverlays.push({
                    colNum,
                    content: (
                      <div
                        className="Game-clearedBlockOverlay"
                        style={{
                          animationDelay: `${nearestClearedPlacedBlockDistance * 0.1}s`
                        }}
                      >
                        <Block
                          type={boardState[rowNum][colNum]}
                        />
                      </div>
                    ),
                    key: `${rowNum},${colNum},${activePieceIndex},${seed}`,
                    rowNum
                  });
                }

                boardState[rowNum][colNum] = BlockType.EMPTY;
              });

              if (clearedBlockOverlays.length) {
                setCellOverlays(new Set([
                  // TODO: Make cleared block overlays remove themselves after the animation so that this doesn't need to clear all existing overlays
                  // ...cellOverlays,
                  ...clearedBlockOverlays
                ]));
              }

              // Save game data
              const gameData = {
                boardState,
                highScore: Math.max(props.gameData?.highScore ?? 0, score),
                piecesUsed: allPiecesUsed ? Array.from({ length: numPieces }, () => false) : piecesUsed,
                score,
                seed
              };

              props.onSave?.(gameData);

              // Loss detection
              const pieces = getPieces(numPieces, gameData.seed);

              if (pieces.every((piece, i) =>
                gameData.piecesUsed[i] || boardState.every((row, rowNum) => row.every((_, colNum) =>
                  !pieceFitsOnBoard(boardState, piece, { rowNum, colNum })
                ))
              )) {
                window.setTimeout(() => {
                  if (window.confirm('No more moves! Start a new game?')) {
                    props.onSave?.(newGameData(gameData));
                  }
                }, 500);
              }
            }
          }

          clearActivePiece();
        }}
        onDragOver={event => setActiveCell(event.over?.data.current ? {
          colNum: event.over.data.current.colNum,
          rowNum: event.over.data.current.rowNum
        } : null)}
        onDragStart={event => {
          setActivePiece(event.active.data.current?.pieceData ?? null)
          setActivePieceIndex(event.active.data.current?.pieceIndex ?? null)
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
              className="Game-activePieceWrapper"
              style={{
                left: `calc(${activePieceBlockOffset}px * (1 + var(--block-gap-ratio)) - 50%)`,
              }}
            >
              <Piece
                blockSize={boardCellRef.current?.offsetWidth}
                className="Game-activePiece"
                pieceData={activePiece}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
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
  const pieces = props.gameData?.seed ? getPieces(numPieces, props.gameData.seed) : [];

  return (
    <div className="Game-main">
      <Board
        activeCell={props.activeCell}
        cellOverlays={props.boardCellOverlays}
        cellRef={props.boardCellRef}
        className="Game-board"
        activePiece={props.activePiece}
        size={boardSize}
        state={props.gameData?.boardState}
      />
      <div className="Game-pieces">
        {Array.from({ length: numPieces }, (_, i) => {
          return props.gameData?.seed && pieces[i] && (
            <GamePieceSlot
              boardCellRef={props.boardCellRef}
              id={`piece-${i}-${props.gameData.seed}`}
              key={i}
              pieceData={pieces[i]}
              pieceIndex={i}
              used={props.gameData?.piecesUsed?.[i]}
            />
          );
        })}
      </div>
    </div>
  );
}

function GamePieceSlot(props: {
  boardCellRef: React.MutableRefObject<HTMLElement | undefined>;
  id: string;
  pieceData: PieceData;
  pieceIndex: number;
  used?: boolean;
}) {

  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    attributes: {
      roleDescription: 'Draggable piece'
    },
    data: {
      pieceData: props.pieceData,
      pieceIndex: props.pieceIndex,
    },
    id: props.id
  });

  return (
    <div className="Game-pieceSlot">
      {!props.used && (
        <div
          className="Game-pieceWrapper"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          <div
            className="Game-pieceDragAnchor"
            ref={setNodeRef}
            style={{
              height: props.boardCellRef.current?.offsetHeight,
              width: props.boardCellRef.current?.offsetWidth
            }}
          />
          {!isDragging && (
            <Piece
              className="Game-piece"
              gridSize={maxPieceSize}
              pieceData={props.pieceData}
            />
          )}
        </div>
      )}
    </div>
  );
}
