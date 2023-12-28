import './index.scss';
import { mulberry32Generator } from '~/ts/helpers';
import Board from '~/components/Board';
import Piece from '~/components/Piece';
import { boardHeight, boardWidth, numPieces, piecePool } from './constants';
import type { GameData } from './types';

export default function Game(props: {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}) {
  const rng = mulberry32Generator(props.gameData.seed, 91661749);

  return (
    <div className="Game">
      <div className="Game-header">
        <div className="Game-scores">
          <div className="Game-score Game-score--current">
            <span className="Game-scoreLabel">
              Score:{' '}
            </span>
            <span className="Game-scoreValue">
              {props.gameData?.score ?? 0}
            </span>
          </div>
          <div className="Game-score Game-score--best">
            <span className="Game-scoreLabel">
              Best Score:{' '}
            </span>
            <span className="Game-scoreValue">
              {props.gameData?.highScore ?? 0}
            </span>
          </div>
        </div>
      </div>
      <Board
        className="Game-board"
        height={boardHeight}
        state={props.gameData?.boardState}
        width={boardWidth}
      />
      <div className="Game-pieces">
        {Array.from({ length: numPieces }, (_, i) =>
          <div
            className="Game-pieceSlot"
            key={i}
          >
            {!props.gameData?.piecesUsed?.[i] && (
              <Piece
                pieceData={piecePool[Math.floor(rng() * piecePool.length)]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
