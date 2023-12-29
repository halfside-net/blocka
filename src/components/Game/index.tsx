import './index.scss';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { ReactComponent as TrophySVG } from '~/assets/images/trophy.svg';
import { mulberry32Generator } from '~/ts/helpers';
import Board from '~/components/Board';
import Piece from '~/components/Piece';
import { boardSize, numPieces, piecePool } from './constants';
import type { GameData } from './types';

const maxPieceSize = Math.max(...piecePool.map(pieceData => Math.max(pieceData.length, ...pieceData.map(row => row.length))));

type GameProps = {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}

function GameInternal(props: GameProps) {
  const rng = props.gameData.seed ? mulberry32Generator(props.gameData.seed, 91661749) : null;

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
      <div className="Game-main">
        <Board
          className="Game-board"
          size={boardSize}
          state={props.gameData?.boardState}
        />
        <div className="Game-pieces">
          {Array.from({ length: numPieces }, (_, i) => {
            const { attributes, listeners, setNodeRef, transform } = useDraggable({
              id: `piece-${i}`,
            });

            return (
              <div
                className="Game-pieceSlot"
                key={i}
              >
                {rng && !props.gameData?.piecesUsed?.[i] && (
                  <div className="Game-pieceWrapper">
                    <Piece
                      additionalProperties={{...attributes, ...listeners}}
                      className="Game-piece"
                      gridSize={maxPieceSize}
                      pieceData={piecePool[Math.floor(rng() * piecePool.length)]}
                      setRef={setNodeRef}
                      transform={transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Game(props: GameProps) {
  return (
    <DndContext>
      <GameInternal {...props} />
    </DndContext>
  );
}
