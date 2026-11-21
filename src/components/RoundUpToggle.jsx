export default function RoundUpToggle({ checked, onChange }) {
  return (
    <div className="switch-row">
      <label htmlFor="round" className="switch-label">
        Round each share up
        <small>To the nearest $0.50</small>
      </label>
      <span className="switch">
        <input
          type="checkbox"
          role="switch"
          id="round"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="track" aria-hidden="true" />
      </span>
    </div>
  );
}
