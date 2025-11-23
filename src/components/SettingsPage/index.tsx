import c from "classnames";
import { Settings } from "../../schema/Settings";
import s from "./index.module.scss";

export default function SettingsPage(props: {
  onChange: (settings: Settings) => void;
  onResetHighScore: () => void;
  onUpdateApp?: () => void;
  settings?: Settings;
}) {
  return (
    <div className={s.SettingsPage}>
      {props.onUpdateApp && (
        <button
          className={s.SettingsPage_updateButton}
          onClick={props.onUpdateApp}
        >
          <span className={s.SettingsPage_updateBadge}>!</span>
          Update & Reload App
        </button>
      )}
      <div className={s.SettingsPage_main}>
        <form className={s.SettingsPage_form}>
          <SettingsCheckbox
            checked={!props.settings?.disableAnimations}
            label="Animations"
            onChange={(checked) =>
              props.onChange({ ...props.settings, disableAnimations: !checked })
            }
          />
        </form>
        <div className={s.SettingsPage_buttons}>
          <button
            className={s.SettingsPage_button}
            onClick={() => {
              if (window.confirm("Reset your high score to 0?")) {
                props.onResetHighScore();
              }
            }}
          >
            Reset High Score
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsCheckbox(props: {
  checked?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={c(s.SettingsPage_setting, s.SettingsPage_setting__checkbox)}
    >
      <input
        checked={!!props.checked}
        className={s.SettingsPage_checkbox}
        onChange={(event) => props.onChange(event.target.checked)}
        type="checkbox"
      />
      {props.label}
    </label>
  );
}
