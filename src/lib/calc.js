// Pure money maths in integer cents. The tip is given in tenths of a percent (12.5% -> 125).

const LIMITS = {
  billCents: [1, 9999999],
  tipTenths: [0, 1000],
  people: [1, 50],
};

function checkRange(name, value) {
  const [min, max] = LIMITS[name];
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}, got ${value}`);
  }
}

// Rounds n / d to the nearest integer, half up, for non-negative integers.
function divideHalfUp(n, d) {
  return Math.floor((2 * n + d) / (2 * d));
}

// Rounds n / d up to the next whole number, for non-negative integers.
function divideCeil(n, d) {
  return Math.floor((n + d - 1) / d);
}

export function roundUpToHalfDollar(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new RangeError(`cents must be a non-negative integer, got ${cents}`);
  }
  return divideCeil(cents, 50) * 50;
}

export function calculate({ billCents, tipTenths, people, roundUp = false }) {
  checkRange("billCents", billCents);
  checkRange("tipTenths", tipTenths);
  checkRange("people", people);

  const tipCents = divideHalfUp(billCents * tipTenths, 1000);
  const totalCents = billCents + tipCents;
  const perPersonCents = divideHalfUp(totalCents, people);
  const result = { tipCents, totalCents, perPersonCents };

  if (roundUp) {
    // Uses the exact share (total / people), not the cent-rounded one.
    const roundedPerPersonCents = divideCeil(totalCents, people * 50) * 50;
    const collectedCents = roundedPerPersonCents * people;
    result.roundedPerPersonCents = roundedPerPersonCents;
    result.collectedCents = collectedCents;
    result.overpaymentCents = collectedCents - totalCents;
  }
  return result;
}
