import './index.scss';
import { useEffect, useState } from 'react';
import { ReactComponent as CloseSVG } from '~/assets/images/close.svg';
import { ReactComponent as HomeSVG } from '~/assets/images/home.svg';
import { ReactComponent as SettingsSVG } from '~/assets/images/settings.svg';
import Home from '~/components/Home';
import Game from '~/components/Game';
import { newGameData } from '~/components/Game/helpers';
import { GameData } from '~/components/Game/types';
import SettingsPage from '~/components/SettingsPage';
import { Settings } from '~/components/SettingsPage/types';
import { isAppDataV1 } from './helpers';
import type { AppDataV1 } from './types';

const appId = 'blocka';

async function loadData(): Promise<AppDataV1> {
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
        {!viewHome && <button
            aria-label="Home"
            className="App-levelselectButton"
            onClick={() => setViewHome(true)}
          >
            <HomeSVG
              className="App-levelselectButtonIcon"
            />
          </button>
        }
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
          onNewGame={isLoaded ? () => {
            if (!gameData.score || window.confirm('End your current game and start a new one?')) {
              setGameData(newGameData(gameData));
              setViewHome(false);
            }
          } : undefined}
          onPlay={isLoaded && gameData.score ? () => setViewHome(false) : undefined}
        />
      </div>
      <div
        className="App-settings"
      >
        <SettingsPage
          onChange={changedSettings => setSettings({ ...settings, ...changedSettings })}
          onResetHighScore={() => setGameData({ ...gameData, highScore: 0 })}
          settings={settings}
        />
      </div>
      <div
        className="App-level"
      >
        <Game
          disableAnimations={settings.disableAnimations}
          onSave={setGameData}
          gameData={gameData}
        />
      </div>
    </div>
  );
}
