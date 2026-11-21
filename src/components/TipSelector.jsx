import FieldError from "./FieldError.jsx";
import { TIP_PRESETS } from "../lib/validate.js";

export default function TipSelector({ preset, custom, error, onPresetSelect, onCustomChange, onCustomBlur }) {
  return (
    <fieldset>
      <legend>Tip</legend>
      <div className="presets">
        {TIP_PRESETS.map((percent) => (
          <button
            key={percent}
            type="button"
            className="preset"
            aria-pressed={preset === percent}
            onClick={() => onPresetSelect(percent)}
          >
            {percent}%
          </button>
        ))}
      </div>
      <label htmlFor="tip" className="sub-label">
        Custom tip (%)
      </label>
      <div className="input-wrap">
        <input
          className="text nopre"
          id="tip"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="e.g. 12.5"
          value={custom}
          onChange={(event) => onCustomChange(event.target.value)}
          onBlur={onCustomBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "tip-err" : undefined}
        />
        <span className="affix post" aria-hidden="true">
          %
        </span>
      </div>
      <FieldError id="tip-err" message={error} />
    </fieldset>
  );
}
