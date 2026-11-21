import { DASH, formatUSD } from "../lib/format.js";

// result is the output of calculate(), or null while any input is invalid.
export default function Results({ result, roundUp, people }) {
  const value = (key) => (result ? formatUSD(result[key]) : DASH);

  let hint = "Enter the bill, a tip and the number of people.";
  if (result && roundUp) {
    hint = `Exact share ${formatUSD(result.perPersonCents)}, rounded up to the next $0.50.`;
  } else if (result) {
    hint = people === 1 ? "No split: 1 person pays it all." : `Equal split between ${people} people.`;
  }

  return (
    <section className="results" aria-live="polite" aria-labelledby="results-title">
      <h2 id="results-title">Each person pays</h2>
      <p className="per-person" data-testid="per-person">
        {value(roundUp ? "roundedPerPersonCents" : "perPersonCents")}
      </p>
      <p className="per-label">Per person</p>
      <ul className="res-list">
        <ResultLine label="Tip" value={value("tipCents")} />
        {roundUp ? (
          <>
            <ResultLine label="Original total" value={value("totalCents")} />
            <ResultLine label="Rounded collected total" value={value("collectedCents")} />
            <ResultLine label="Overpayment (extra tip)" value={value("overpaymentCents")} extra />
          </>
        ) : (
          <ResultLine label="Total" value={value("totalCents")} />
        )}
      </ul>
      <p className="hint">{hint}</p>
    </section>
  );
}

function ResultLine({ label, value, extra = false }) {
  return (
    <li className={extra ? "extra" : undefined}>
      <span>{label}</span>
      <span>{value}</span>
    </li>
  );
}
