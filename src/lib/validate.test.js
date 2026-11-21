import { describe, expect, test } from "vitest";
import {
  BILL_EMPTY,
  BILL_RANGE,
  PEOPLE_RANGE,
  TIP_EMPTY,
  TIP_RANGE,
  validateBill,
  validatePeople,
  validateTip,
} from "./validate.js";

describe("validateBill (S1)", () => {
  test.each([
    ["85.40", 8540],
    ["85.4", 8540],
    ["85", 8500],
    [".5", 50],
    ["0.01", 1],
    ["99999.99", 9999999],
    [" 12.30 ", 1230],
  ])("accepts %j as %i cents", (raw, cents) => {
    expect(validateBill(raw)).toEqual({ ok: true, value: cents });
  });

  test("empty asks for the bill amount", () => {
    expect(validateBill("")).toEqual({ ok: false, error: BILL_EMPTY });
    expect(validateBill("   ")).toEqual({ ok: false, error: BILL_EMPTY });
  });

  test.each(["0", "0.00", "100000", "12.345", "-5", "abc", "1,000", ".", "1e3", "NaN"])(
    "rejects %j with the range message",
    (raw) => {
      expect(validateBill(raw)).toEqual({ ok: false, error: BILL_RANGE });
    }
  );

  test("the range message explains the valid range", () => {
    expect(BILL_RANGE).toBe("Enter an amount from $0.01 to $99,999.99 (up to 2 decimals)");
  });
});

describe("validateTip (S2)", () => {
  test.each([10, 15, 20])("preset %i%% is %i0 tenths", (preset) => {
    expect(validateTip(preset, "")).toEqual({ ok: true, value: preset * 10 });
  });

  test.each([
    ["12.5", 125],
    ["0", 0],
    ["100", 1000],
    ["100.0", 1000],
    ["18", 180],
  ])("custom %j is %i tenths", (raw, tenths) => {
    expect(validateTip(null, raw)).toEqual({ ok: true, value: tenths });
  });

  test("a custom value wins over a preset", () => {
    expect(validateTip(15, "12.5")).toEqual({ ok: true, value: 125 });
  });

  test.each(["101", "-1", "12.55", "100.1", "abc", "."])("rejects custom %j with the range message", (raw) => {
    expect(validateTip(null, raw)).toEqual({ ok: false, error: TIP_RANGE });
  });

  test("no preset and no custom value asks for a tip", () => {
    expect(validateTip(null, "")).toEqual({ ok: false, error: TIP_EMPTY });
  });
});

describe("validatePeople (S3)", () => {
  test.each([
    ["1", 1],
    ["3", 3],
    ["50", 50],
  ])("accepts %j", (raw, people) => {
    expect(validatePeople(raw)).toEqual({ ok: true, value: people });
  });

  test.each(["0", "51", "2.5", "", "-2", "abc"])("rejects %j", (raw) => {
    expect(validatePeople(raw)).toEqual({ ok: false, error: PEOPLE_RANGE });
  });
});
