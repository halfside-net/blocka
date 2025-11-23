import c from "classnames";
import { titleShort } from "../../../siteconfig.json";
import logo from "../../assets/images/icon_transparent.png";
import s from "./index.module.scss";

export default function Home(props: {
  onNewGame?: () => void;
  onPlay?: () => void;
}) {
  return (
    <div className={s.Home}>
      <img alt={titleShort} className={s.Home_logo} src={logo} />
      <div className={s.Home_buttons}>
        <button
          className={c(s.Home_button, {
            [s.Home_button__hidden]: !props.onPlay,
          })}
          onClick={props.onPlay}
        >
          Continue Game
        </button>
        <button
          className={c(s.Home_button, {
            [s.Home_button__hidden]: !props.onNewGame,
          })}
          onClick={props.onNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
