import './index.scss';
import { useEffect, useRef, useState } from 'react';
import type { GameData } from './types';

export default function Game(props: {
  gameData?: GameData;
  onSave: (savedData: GameData) => void;
}) {
  return (
    <div className="Game">

    </div>
  );
}
