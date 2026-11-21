import { expect, test } from "vitest";
import { formatUSD } from "./format.js";

test.each([
  [123450, "$1,234.50"],
  [1, "$0.01"],
  [0, "$0.00"],
  [9999999, "$99,999.99"],
  [19999998, "$199,999.98"],
  [3416, "$34.16"],
])("formats %i cents as %s", (cents, text) => {
  expect(formatUSD(cents)).toBe(text);
});

test("null is shown as a dash", () => {
  expect(formatUSD(null)).toBe("—");
});
