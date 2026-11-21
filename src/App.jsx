import { useState } from "react";
import BillInput from "./components/BillInput.jsx";
import TipSelector from "./components/TipSelector.jsx";
import PeopleInput from "./components/PeopleInput.jsx";
import RoundUpToggle from "./components/RoundUpToggle.jsx";
import Results from "./components/Results.jsx";
import { validateBill, validatePeople, validateTip } from "./lib/validate.js";
import { calculate } from "./lib/calc.js";

export default function App() {
  const [bill, setBill] = useState("");
  const [tipPreset, setTipPreset] = useState(null);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("");
  const [roundUp, setRoundUp] = useState(false);
  const [touched, setTouched] = useState({ bill: false, tip: false, people: false });

  const touch = (field) => setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  // Derived on every render: no effects, no debounce.
  const billCheck = validateBill(bill);
  const tipCheck = validateTip(tipPreset, customTip);
  const peopleCheck = validatePeople(people);
  const result =
    billCheck.ok && tipCheck.ok && peopleCheck.ok
      ? calculate({ billCents: billCheck.value, tipTenths: tipCheck.value, people: peopleCheck.value, roundUp })
      : null;

  const errorFor = (field, check) => (touched[field] && !check.ok ? check.error : undefined);

  return (
    <main>
      <header className="app-header">
        <h1>Tip Calculator</h1>
        <p>Split the bill and tip equally. Amounts in USD.</p>
      </header>
      <div className="layout">
        <section className="card" aria-label="Inputs">
          <BillInput
            value={bill}
            error={errorFor("bill", billCheck)}
            onChange={(value) => {
              setBill(value);
              touch("bill");
            }}
            onBlur={() => touch("bill")}
          />
          <TipSelector
            preset={tipPreset}
            custom={customTip}
            error={errorFor("tip", tipCheck)}
            onPresetSelect={(percent) => {
              setTipPreset(percent);
              setCustomTip("");
              touch("tip");
            }}
            onCustomChange={(value) => {
              setCustomTip(value);
              setTipPreset(null);
              touch("tip");
            }}
            onCustomBlur={() => touch("tip")}
          />
          <PeopleInput
            value={people}
            error={errorFor("people", peopleCheck)}
            onChange={(value) => {
              setPeople(value);
              touch("people");
            }}
            onBlur={() => touch("people")}
          />
          <RoundUpToggle checked={roundUp} onChange={setRoundUp} />
        </section>
        <Results result={result} roundUp={roundUp} people={peopleCheck.ok ? peopleCheck.value : null} />
      </div>
    </main>
  );
}
