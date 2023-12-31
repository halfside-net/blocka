import './index.scss';
import { Settings } from './types';

export default function SettingsPage(props: {
  onChange: (changedSettings: Settings) => void;
  onResetHighScore: () => void;
  settings: Settings;
}) {
  return (
    <div className="SettingsPage">
      <form className="SettingsPage-form">
        <SettingsCheckbox
          checked={!props.settings.disableAnimations}
          label="Animations"
          onChange={checked => props.onChange({ disableAnimations: !checked })}
        />
      </form>
      <div className="SettingsPage-buttons">
        <button
          className="SettingsPage-button"
          onClick={() => {
            if (window.confirm('Reset your high score to 0?')) {
              props.onResetHighScore();
            }
          }}
        >
          Reset High Score
        </button>
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
    <label className="SettingsPage-setting SettingsPage-setting--checkbox">
      <input
        checked={!!props.checked}
        className="SettingsPage-checkbox"
        onChange={event => props.onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="SettingsPage-label">
        {props.label}
      </span>
    </label>
  );
}
