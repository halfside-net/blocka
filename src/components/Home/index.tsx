import './index.scss';
import { titleShort } from '../../../siteconfig.json';
import logo from '~/assets/images/icon_transparent.png?as=metadata';

export default function Home(props: {
  onNewGame?: () => void;
  onPlay?: () => void;
}) {
  return (
    <div className="Home">
      <img
        alt={titleShort}
        className="Home-logo"
        height={logo.height}
        src={logo.src}
        width={logo.width}
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
