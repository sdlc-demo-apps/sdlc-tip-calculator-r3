// Pure parsing and range checks. Each function returns { ok: true, value } or { ok: false, error }.

export const BILL_EMPTY = "Enter the bill amount";
export const BILL_RANGE = "Enter an amount from $0.01 to $99,999.99 (up to 2 decimals)";
export const TIP_EMPTY = "Choose or enter a tip";
export const TIP_RANGE = "Enter a tip from 0 to 100% (whole number or one decimal)";
export const PEOPLE_RANGE = "Enter a whole number from 1 to 50";

export const TIP_PRESETS = [10, 15, 20];

const MIN_BILL_CENTS = 1;
const MAX_BILL_CENTS = 9999999;

// Parses "12", "12.3", "12.34" or ".5" into whole and fractional digit strings, allowing up to maxDecimals.
function parseDecimal(raw, maxDecimals) {
  const match = new RegExp(`^(\\d*)(?:\\.(\\d{0,${maxDecimals}}))?$`).exec(raw);
  if (!match) return null;
  const whole = match[1];
  const fraction = match[2] || "";
  if (whole === "" && fraction === "") return null;
  return Number(whole || "0") * 10 ** maxDecimals + Number(fraction.padEnd(maxDecimals, "0"));
}

export function validateBill(raw) {
  const text = raw.trim();
  if (text === "") return { ok: false, error: BILL_EMPTY };
  const cents = parseDecimal(text, 2);
  if (cents === null || cents < MIN_BILL_CENTS || cents > MAX_BILL_CENTS) {
    return { ok: false, error: BILL_RANGE };
  }
  return { ok: true, value: cents };
}

export function validateTip(preset, rawCustom) {
  const text = rawCustom.trim();
  if (text !== "") {
    const tenths = parseDecimal(text, 1);
    if (tenths === null || tenths > 1000) return { ok: false, error: TIP_RANGE };
    return { ok: true, value: tenths };
  }
  if (TIP_PRESETS.includes(preset)) return { ok: true, value: preset * 10 };
  return { ok: false, error: TIP_EMPTY };
}

export function validatePeople(raw) {
  const text = raw.trim();
  if (!/^\d+$/.test(text)) return { ok: false, error: PEOPLE_RANGE };
  const people = Number(text);
  if (people < 1 || people > 50) return { ok: false, error: PEOPLE_RANGE };
  return { ok: true, value: people };
}
