export default function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <rect x="7" y="4" width="2" height="5" fill="#fff" />
        <rect x="7" y="10.5" width="2" height="2" fill="#fff" />
      </svg>
      <span>{message}</span>
    </p>
  );
}
