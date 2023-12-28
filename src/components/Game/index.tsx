import './index.scss';
import { ReactComponent as TrophySVG } from '~/assets/images/trophy.svg';
import { mulberry32Generator } from '~/ts/helpers';
import Board from '~/components/Board';
import Piece from '~/components/Piece';
import { boardSize, numPieces, piecePool } from './constants';
import type { GameData } from './types';

export default function Game(props: {
  gameData: GameData;
  onSave: (savedData: GameData) => void;
}) {
  const rng = mulberry32Generator(props.gameData.seed, 91661749);

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
    </div>
  );
}
