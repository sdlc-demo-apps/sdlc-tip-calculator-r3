import FieldError from "./FieldError.jsx";

export default function BillInput({ value, error, onChange, onBlur }) {
  return (
    <div className="field">
      <label htmlFor="bill">Bill amount ($)</label>
      <div className="input-wrap">
        <span className="affix pre" aria-hidden="true">
          $
        </span>
        <input
          className="text"
          id="bill"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "bill-err" : undefined}
        />
      </div>
      <FieldError id="bill-err" message={error} />
    </div>
  );
}
