import FieldError from "./FieldError.jsx";

export default function PeopleInput({ value, error, onChange, onBlur }) {
  return (
    <div className="field">
      <label htmlFor="people">Number of people</label>
      <input
        className="text nopre"
        id="people"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="1–50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "people-err" : undefined}
      />
      <FieldError id="people-err" message={error} />
    </div>
  );
}
