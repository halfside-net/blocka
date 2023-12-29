import './index.scss';
import logo from '~/assets/images/icon_transparent.png';

export default function Home(props: {
  onNewGame?: () => void;
  onPlay?: () => void;
}) {
  return (
    <div className="Home">
      <img
        alt="Blocka"
        className="Home-logo"
        src={logo}
      />
      <div className="Home-buttons">
        <button
          className={'Home-button Home-button--play'
            + (props.onPlay ? '' : ' Home-button--hidden')
          }
          onClick={props.onPlay}
        >
          Continue Game
        </button>
        <button
          className={'Home-button Home-button--newgame'
            + (props.onNewGame ? '' : ' Home-button--hidden')
          }
          onClick={props.onNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
