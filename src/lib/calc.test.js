import { describe, expect, test } from "vitest";
import { calculate, roundUpToHalfDollar } from "./calc.js";
import { referenceCases } from "./referenceCases.js";

describe("calculate: reference table (S3, S4)", () => {
  test("the table has 10 cases", () => {
    expect(referenceCases).toHaveLength(10);
  });

  test.each(referenceCases)("$name, round-up off", ({ input, expected }) => {
    expect(calculate({ ...input, roundUp: false })).toEqual({
      tipCents: expected.tipCents,
      totalCents: expected.totalCents,
      perPersonCents: expected.perPersonCents,
    });
  });

  test.each(referenceCases)("$name, round-up on", ({ input, expected }) => {
    expect(calculate({ ...input, roundUp: true })).toEqual(expected);
  });
});

describe("calculate: behaviour", () => {
  test("returns integers only (no floating-point artefacts)", () => {
    for (const { input } of referenceCases) {
      const result = calculate({ ...input, roundUp: true });
      for (const value of Object.values(result)) expect(Number.isInteger(value)).toBe(true);
    }
  });

  test("a $28.50 share stays $28.50 with no overpayment", () => {
    const result = calculate({ billCents: 2850, tipTenths: 0, people: 1, roundUp: true });
    expect(result.roundedPerPersonCents).toBe(2850);
    expect(result.overpaymentCents).toBe(0);
  });

  test("round-up uses the exact share, not the cent-rounded share", () => {
    // $100.01 / 2 = $50.005 exactly; rounds to $50.01 half up, and up to $50.50.
    const result = calculate({ billCents: 10001, tipTenths: 0, people: 2, roundUp: true });
    expect(result.perPersonCents).toBe(5001);
    expect(result.roundedPerPersonCents).toBe(5050);
  });

  test("omits the rounded fields when round-up is off", () => {
    const result = calculate({ billCents: 8540, tipTenths: 200, people: 3 });
    expect(result).not.toHaveProperty("roundedPerPersonCents");
  });

  test.each([
    [{ billCents: 0, tipTenths: 150, people: 2 }],
    [{ billCents: 10000000, tipTenths: 150, people: 2 }],
    [{ billCents: 12.5, tipTenths: 150, people: 2 }],
    [{ billCents: 1000, tipTenths: -1, people: 2 }],
    [{ billCents: 1000, tipTenths: 1001, people: 2 }],
    [{ billCents: 1000, tipTenths: 150, people: 0 }],
    [{ billCents: 1000, tipTenths: 150, people: 51 }],
    [{ billCents: 1000, tipTenths: 150, people: 2.5 }],
    [{ billCents: NaN, tipTenths: 150, people: 2 }],
  ])("throws RangeError for out-of-range input %o", (input) => {
    expect(() => calculate(input)).toThrow(RangeError);
  });
});

describe("roundUpToHalfDollar", () => {
  test.each([
    [0, 0],
    [1, 50],
    [49, 50],
    [50, 50],
    [51, 100],
    [2850, 2850],
    [3416, 3450],
  ])("%i cents -> %i cents", (cents, expected) => {
    expect(roundUpToHalfDollar(cents)).toBe(expected);
  });

  test.each([-1, 1.5, NaN])("throws RangeError for %s", (cents) => {
    expect(() => roundUpToHalfDollar(cents)).toThrow(RangeError);
  });
});
