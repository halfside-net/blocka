import './index.scss';
import Board from '~/components/Board';
import type { GameData } from './types';
import Piece from '../Piece';

const boardHeight = 10;
const boardWidth = 10;
const numPieces = 3;

export default function Game(props: {
  gameData?: GameData;
  onSave: (savedData: GameData) => void;
}) {
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
      <div className="Game-board">
        <Board
          height={boardHeight}
          state={props.gameData?.boardState}
          width={boardWidth}
        />
      </div>
      <div
        className="Game-pieces"
        style={{
          gridTemplateColumns: `repeat(${numPieces}, 1fr)`
        }}
      >
        {Array.from({ length: numPieces }, (_, i) =>
          <div
            className="Game-pieceSlot"
            key={i}
          >
            {!props.gameData?.piecesUsed?.[i] && (
              <Piece />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
