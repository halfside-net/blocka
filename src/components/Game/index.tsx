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
import { newGameDataSeed } from './helpers';
import type { GameData } from './types';

const maxPieceSize = Math.max(...piecePool.map(pieceData => Math.max(pieceData.length, ...pieceData.map(row => row.length))));

export default function Game(props: {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}) {
  const [activeCell, setActiveCell] = useState<BoardCellData | null>(null);
  const [activePiece, setActivePiece] = useState<PieceData | null>(null);
  const [activePieceIndex, setActivePieceIndex] = useState<number | null>(null);

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
          if (activePiece && event.over?.data.current) {
            const boardState = generateBoardState(boardSize, props.gameData?.boardState);

            if (pieceFitsOnBoard(boardState, activePiece, {
              colNum: event.over.data.current.colNum,
              rowNum: event.over.data.current.rowNum
            })) {
              activePiece.forEach((row, rowNum) =>
                row.forEach((block, colNum) => {
                  boardState[event.over!.data.current!.rowNum - activePiece.length + rowNum + 1][event.over!.data.current!.colNum - row.length + colNum + 1] = block;
                })
              );

              const piecesUsed = Array.from({ length: numPieces }, (_, i) => !!props.gameData?.piecesUsed?.[i] || i == activePieceIndex);
              const allPiecesUsed = piecesUsed.every(used => used);
              const score = (props.gameData?.score ?? 0) + pieceScore(activePiece);

              props.onSave({
                boardState,
                highScore: Math.max(props.gameData?.highScore ?? 0, score),
                piecesUsed: allPiecesUsed ? Array.from({ length: numPieces }, () => false) : piecesUsed,
                score,
                seed: allPiecesUsed ? newGameDataSeed(props.gameData?.seed) : props.gameData?.seed,
              });
            }
          }

          setActiveCell(null);
          setActivePiece(null);
          setActivePieceIndex(null);
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
          boardCellRef={boardCellRef}
          activePiece={activePiece}
          gameData={props.gameData}
        />
        <DragOverlay
          style={{
            height: boardCellRef.current?.offsetHeight,
            width: boardCellRef.current?.offsetWidth
          }}
        >
          {activePiece && (
            <div className="Game-activePieceWrapper">
              <Piece
                blockSize={boardCellRef.current?.offsetHeight}
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
  activeCell: BoardCellData | null;
  boardCellRef: React.MutableRefObject<HTMLDivElement | undefined>;
  activePiece: PieceData | null;
  gameData: GameData;
}) {
  const rng = props.gameData.seed ? mulberry32Generator(props.gameData.seed, 91661749) : null;

  return (
    <div className="Game-main">
      <Board
        activeCell={props.activeCell}
        cellRef={props.boardCellRef}
        className="Game-board"
        activePiece={props.activePiece}
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
