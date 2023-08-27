import './index.scss';
import type { GameData } from './types';

export default function Game(props: {
  gameData?: GameData;
  onSave: (savedData: GameData) => void;
}) {
  return (
    <div className="Game">
      TODO: Game
    </div>
  );
}
