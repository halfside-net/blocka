import './index.scss';
import logo from '~/assets/images/icon_transparent.png';

export default function Home(props: {
  onPlay?: () => void;
}) {
  return (
    <div className="Home">
      <img
        alt="Blocka"
        className="Home-logo"
        src={logo}
      />
      <button
        className={'Home-button Home-button--play'
          + (props.onPlay ? '' : ' Home-button--hidden')
        }
        onClick={props.onPlay}
      >
        Play
      </button>
    </div>
  );
}
