import './index.scss';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import { useRef, useState } from 'react';
import { ReactComponent as TrophySVG } from '~/assets/images/trophy.svg';
import { mulberry32Generator } from '~/ts/helpers';
import Board from '~/components/Board';
import { generateBoardState, pieceFitsOnBoard } from '~/components/Board/helpers';
import { BoardCellData } from '~/components/Board/types';
import Piece from '~/components/Piece';
import { pieceScore } from '~/components/Piece/helpers';
import type { PieceData } from '~/components/Piece/types';
import { boardSize, numPieces, piecePool } from './constants';
import type { GameData } from './types';

const maxPieceSize = Math.max(...piecePool.map(pieceData => Math.max(pieceData.length, ...pieceData.map(row => row.length))));

export default function Game(props: {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}) {
  const [activeCell, setActiveCell] = useState<BoardCellData | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<PieceData | null>(null);
  const [draggingPieceIndex, setDraggingPieceIndex] = useState<number | null>(null);

  const boardCellRef = useRef<HTMLDivElement>();

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
        onDragEnd={event => {
          if (draggingPiece && event.over?.data.current) {
            const boardState = generateBoardState(boardSize, props.gameData?.boardState);

            if (pieceFitsOnBoard(boardState, draggingPiece, {
              colNum: event.over.data.current.colNum,
              rowNum: event.over.data.current.rowNum
            })) {
              draggingPiece.forEach((row, rowNum) =>
                row.forEach((block, colNum) => {
                  boardState[event.over!.data.current!.rowNum - draggingPiece.length + rowNum + 1][event.over!.data.current!.colNum - row.length + colNum + 1] = block;
                })
              );

              let piecesUsed = Array.from({ length: numPieces }, (_, i) => !!props.gameData?.piecesUsed?.[i] || i == draggingPieceIndex);

              props.onSave({
                ...props.gameData,
                boardState,
                piecesUsed,
                score: (props.gameData?.score ?? 0) + pieceScore(draggingPiece)
              });
            }
          }

          setActiveCell(null);
          setDraggingPiece(null);
          setDraggingPieceIndex(null);
        }}
        onDragOver={event => setActiveCell(event.over?.data.current ? {
          colNum: event.over.data.current.colNum,
          rowNum: event.over.data.current.rowNum
        } : null)}
        onDragStart={event => {
          setDraggingPiece(event.active.data.current?.pieceData ?? null)
          setDraggingPieceIndex(event.active.data.current?.pieceIndex ?? null)
        }}
      >
        <GameMain
          activeCell={activeCell}
          boardCellRef={boardCellRef}
          draggingPiece={draggingPiece}
          gameData={props.gameData}
        />
        <DragOverlay
          style={{
            height: boardCellRef.current?.offsetHeight,
            width: boardCellRef.current?.offsetWidth
          }}
        >
          {draggingPiece && (
            <div className="Game-draggingPieceWrapper">
              <Piece
                blockSize={boardCellRef.current?.offsetHeight}
                className="Game-draggingPiece"
                pieceData={draggingPiece}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function GameMain(props: {
  activeCell: BoardCellData | null;
  boardCellRef: React.MutableRefObject<HTMLDivElement | undefined>;
  draggingPiece: PieceData | null;
  gameData: GameData;
}) {
  const rng = props.gameData.seed ? mulberry32Generator(props.gameData.seed, 91661749) : null;

  return (
    <div className="Game-main">
      <Board
        activeCell={props.activeCell}
        cellRef={props.boardCellRef}
        className="Game-board"
        draggingPiece={props.draggingPiece}
        size={boardSize}
        state={props.gameData?.boardState}
      />
      <div className="Game-pieces">
        {Array.from({ length: numPieces }, (_, i) => {
          return rng && (
            <GamePieceSlot
              id={`piece-${i}`}
              key={i}
              pieceData={piecePool[Math.floor(rng() * piecePool.length)]}
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
      pieceIndex: props.pieceIndex
    },
    id: props.id
  });

  return (
    <div className="Game-pieceSlot">
      {!props.used && !isDragging && (
        <div
          className="Game-pieceWrapper"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          <Piece
            className="Game-piece"
            gridSize={maxPieceSize}
            pieceData={props.pieceData}
            setRef={setNodeRef}
          />
        </div>
      )}
    </div>
  );
}
