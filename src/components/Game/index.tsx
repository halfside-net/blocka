import './index.scss';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import { useRef, useState } from 'react';
import { ReactComponent as TrophySVG } from '~/assets/images/trophy.svg';
import { mulberry32Generator } from '~/ts/helpers';
import Board from '~/components/Board';
import Piece from '~/components/Piece';
import type { PieceData } from '~/components/Piece/types';
import { boardSize, numPieces, piecePool } from './constants';
import type { GameData } from './types';

const maxPieceSize = Math.max(...piecePool.map(pieceData => Math.max(pieceData.length, ...pieceData.map(row => row.length))));

export default function Game(props: {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}) {
  const [draggingPieceData, setDraggingPieceData] = useState<PieceData | null>(null);

  const boardCellRef = useRef<HTMLDivElement>(null);

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
        onDragStart={event => {
          setDraggingPieceData(event.active.data.current?.pieceData ?? null)
        }}
      >
        <GameMain
          {...props}
          boardCellRef={boardCellRef}
        />
        <DragOverlay
          style={{
            height: boardCellRef.current?.offsetHeight,
            width: boardCellRef.current?.offsetWidth
          }}
        >
          {draggingPieceData && (
            <div className="Game-draggingPieceWrapper">
              <Piece
                blockSize={boardCellRef.current?.offsetHeight}
                className="Game-draggingPiece"
                pieceData={draggingPieceData}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function GameMain(props: {
  boardCellRef?: React.RefObject<HTMLDivElement>;
  gameData: GameData;
}) {
  const rng = props.gameData.seed ? mulberry32Generator(props.gameData.seed, 91661749) : null;

  return (
    <div className="Game-main">
      <Board
        cellRef={props.boardCellRef}
        className="Game-board"
        size={boardSize}
        state={props.gameData?.boardState}
      />
      <div className="Game-pieces">
        {Array.from({ length: numPieces }, (_, i) => {
          return rng && !props.gameData?.piecesUsed?.[i] && (
            <GamePieceSlot
              id={`piece-${i}`}
              key={i}
              pieceData={piecePool[Math.floor(rng() * piecePool.length)]}
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
}) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    attributes: {
      roleDescription: 'Draggable piece'
    },
    data: {
      pieceData: props.pieceData
    },
    id: props.id
  });

  return (
    <div className="Game-pieceSlot">
      {!isDragging && (
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
