import c from "classnames";
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { appId } from "../../../siteconfig.json";
import CloseSVG from "../../assets/images/close.svg?react";
import HomeSVG from "../../assets/images/home.svg?react";
import SettingsSVG from "../../assets/images/settings.svg?react";
import { AppData, zAppData } from "../../schema/AppData";
import { GameData } from "../../schema/GameData";
import { Settings } from "../../schema/Settings";
import Game, { createNewGameData } from "../Game";
import Home from "../Home";
import SettingsPage from "../SettingsPage";
import s from "./App.module.scss";

/**
 * AppData version
 */
const v = 1;

async function loadData(): Promise<AppData> {
  const jsonData = window.localStorage.getItem(appId);

  if (jsonData) {
    try {
      return zAppData.parse(JSON.parse(jsonData));
    } catch (err) {
      console.warn("Failed to load saved data. Parse error:", err);
    }
  }

  return { v };
}

function saveData(data: AppData) {
  window.localStorage.setItem(appId, JSON.stringify(data));
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameData, setGameData] = useState<GameData>();
  const [settings, setSettings] = useState<Settings>();
  const [viewHome, setViewHome] = useState(true);
  const [viewSettings, setViewSettings] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        setInterval(
          async () => {
            if (
              !r.installing &&
              (window.navigator?.onLine ?? true) &&
              (
                await fetch(swUrl, {
                  cache: "no-store",
                  headers: {
                    cache: "no-store",
                    "cache-control": "no-cache",
                  },
                })
              ).ok
            ) {
              await r.update();
            }
          },
          3600000 // 1 hour
        );
      }
    },
  });

  function updateGameData(newGameData: GameData) {
    setGameData(newGameData);

    if (isLoaded) {
      saveData({ gameData: newGameData, settings, v });
    }
  }

  function updateSettings(newSettings: Settings) {
    setSettings(newSettings);

    if (isLoaded) {
      saveData({ gameData, settings: newSettings, v });
    }
  }

  useEffect(() => {
    loadData()
      .then((loadedData) => {
        setGameData(loadedData.gameData);
        setSettings(loadedData.settings);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  return (
    <div
      className={c(s.App, {
        [s.App__reducedMotion]: settings?.disableAnimations,
        [s.is_showingHome]: viewHome,
        [s.is_showingSettings]: viewSettings,
      })}
    >
      <header>
        <button
          aria-label="Home"
          className={s.App_homeButton}
          onClick={() => setViewHome(true)}
        >
          <HomeSVG className={s.App_homeButtonIcon} />
        </button>
        {isLoaded && (
          <button
            aria-label={viewSettings ? "Close settings" : "Settings"}
            className={s.App_settingsButton}
            onClick={() => setViewSettings(!viewSettings)}
          >
            {viewSettings ? (
              <CloseSVG className={s.App_settingsButtonIcon} />
            ) : (
              <SettingsSVG className={s.App_settingsButtonIcon} />
            )}
            {needRefresh && !viewSettings && (
              <span className={s.App_settingsBadge}>!</span>
            )}
          </button>
        )}
      </header>

      <div className={s.App_home}>
        <Home
          onNewGame={
            isLoaded
              ? () => {
                  if (
                    !gameData?.score ||
                    window.confirm("End your current game and start a new one?")
                  ) {
                    updateGameData(createNewGameData(gameData));
                    setViewHome(false);
                  }
                }
              : undefined
          }
          onPlay={
            isLoaded && gameData?.score ? () => setViewHome(false) : undefined
          }
        />
      </div>
      <div className={s.App_settings}>
        <SettingsPage
          onChange={updateSettings}
          onResetHighScore={() => updateGameData({ ...gameData, highScore: 0 })}
          onUpdateApp={needRefresh ? () => updateServiceWorker() : undefined}
          settings={settings}
        />
      </div>
      <div className={s.App_level}>
        <Game
          disableAnimations={settings?.disableAnimations}
          onSave={updateGameData}
          gameData={gameData}
        />
      </div>
    </div>
  );
}
