import './index.scss';
import { useEffect, useState } from 'react';
import { ReactComponent as CloseSVG } from '~/assets/images/close.svg';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import Game from '~/components/Game';
import { GameData } from '~/components/Game/types';
import SettingsPage from '~/components/SettingsPage';
import { Settings } from '~/components/SettingsPage/types';
import { isAppDataV1 } from './helpers';
import type { AppDataV1 } from './types';
import test from 'node:test';

const appId = 'blocka';

// TODO: Remove this
const testGameData: AppDataV1 = {
  gameData: {
    boardState: [
      [0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
      [0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
      [1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 1]
    ],
    highScore: 0,
    piecesUsed: [false, false, false],
    score: 0,
    seed: 12345
  },
  version: 1
};

async function loadData(): Promise<AppDataV1> {
  // TODO: Remove this
  return testGameData;

/*
  const jsonData = window.localStorage.getItem(appId);

  if (jsonData) {
    const savedData = JSON.parse(jsonData);

    if (isAppDataV1(savedData)) {
      return savedData;
    }

    console.warn('The saved data was in an unknown format. Starting with new data instead.');
  }

  return {
    version: 1
  };
*/
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameData, setGameData] = useState<GameData>({});
  const [settings, setSettings] = useState<Settings>({});
  const [viewHome, setViewHome] = useState(true);
  const [viewSettings, setViewSettings] = useState(false);

  function save() {
    const data: AppDataV1 = {
      gameData,
      settings,
      version: 1
    };

    window.localStorage.setItem(appId, JSON.stringify(data));
  }

  useEffect(() => {
    loadData()
      .then(loadedData => {
        setGameData(loadedData.gameData ?? gameData);
        setSettings(loadedData.settings ?? settings);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      save();
    }
  }, [gameData, settings]);

  return (
    <div
      className={'App'
        + (isLoaded ? ' is-loaded' : '')
        + (viewHome ? ' is-showing-home' : '')
        + (viewSettings ? ' is-showing-settings' : '')
      }
    >
      <header className="App-header">
        {isLoaded &&
          <button
            aria-label={viewSettings ? 'Close settings' : 'Settings'}
            className="App-settingsButton"
            onClick={() => setViewSettings(!viewSettings)}
          >
            {viewSettings ?
              <CloseSVG
                className="App-settingsButtonIcon"
              />
            :
              <SettingsSVG
                className="App-settingsButtonIcon"
              />
            }
          </button>
        }
      </header>

      <div className="App-home">
        <Home
          onPlay={isLoaded ? () => setViewHome(false) : undefined}
        />
      </div>
      <div
        className="App-settings"
      >
        <SettingsPage
          onChange={changedSettings => setSettings({ ...settings, ...changedSettings })}
          settings={settings}
        />
      </div>
      <div
        className="App-level"
      >
        <Game
          onSave={setGameData}
          gameData={gameData}
        />
      </div>
    </div>
  );
}
