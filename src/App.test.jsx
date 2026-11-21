import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return {
    user,
    bill: screen.getByLabelText("Bill amount ($)"),
    customTip: screen.getByLabelText("Custom tip (%)"),
    people: screen.getByLabelText("Number of people"),
    roundUp: screen.getByRole("switch", { name: /round each share up/i }),
    preset: (percent) => screen.getByRole("button", { name: `${percent}%` }),
  };
}

const resultsPanel = () => screen.getByRole("region", { name: "Each person pays" });
const perPerson = () => within(resultsPanel()).getByTestId("per-person").textContent;
const line = (label) => within(resultsPanel()).queryByText(label, { exact: true })?.closest("li");
const lineValue = (label) => line(label).lastChild.textContent;

async function fill(user, fields, { bill, preset, custom, people }) {
  if (bill !== undefined) {
    await user.clear(fields.bill);
    await user.type(fields.bill, bill);
  }
  if (preset !== undefined) await user.click(fields.preset(preset));
  if (custom !== undefined) {
    await user.clear(fields.customTip);
    await user.type(fields.customTip, custom);
  }
  if (people !== undefined) {
    await user.clear(fields.people);
    await user.type(fields.people, people);
  }
}

function expectNoError(input) {
  expect(input).toHaveAttribute("aria-invalid", "false");
  expect(input).not.toHaveAttribute("aria-describedby");
}

function expectLinkedError(input, message) {
  expect(input).toHaveAttribute("aria-invalid", "true");
  const id = input.getAttribute("aria-describedby");
  expect(id).toBeTruthy();
  expect(document.getElementById(id).textContent).toBe(message);
}

const BILL_RANGE = "Enter an amount from $0.01 to $99,999.99 (up to 2 decimals)";
const TIP_RANGE = "Enter a tip from 0 to 100% (whole number or one decimal)";
const PEOPLE_RANGE = "Enter a whole number from 1 to 50";

// Small local matcher helper so we don't need jest-dom.
expect.extend({
  toHaveAttribute(element, name, value) {
    const has = element.hasAttribute(name);
    const actual = element.getAttribute(name);
    const pass = value === undefined ? has : has && actual === value;
    return {
      pass,
      message: () =>
        `expected element ${pass ? "not " : ""}to have attribute ${name}${value === undefined ? "" : `="${value}"`}, got ${actual}`,
    };
  },
});

describe("S1: Enter the bill amount", () => {
  test("85.40 is accepted under the label 'Bill amount ($)' with no error", async () => {
    const { user, ...fields } = setup();
    await user.type(fields.bill, "85.40");
    await user.tab();
    expect(fields.bill.value).toBe("85.40");
    expectNoError(fields.bill);
  });

  test.each(["0", "100000", "12.345"])("%s shows the valid-range message", async (value) => {
    const { user, ...fields } = setup();
    await user.type(fields.bill, value);
    expectLinkedError(fields.bill, BILL_RANGE);
  });

  test("the bill field asks phones for a decimal keypad", () => {
    const { bill } = setup();
    expect(bill).toHaveAttribute("inputmode", "decimal");
  });
});

describe("S2: Choose the tip percentage", () => {
  test("tapping 15% marks it selected for screen readers and the tip uses 15%", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", people: "4" });
    await user.click(fields.preset(15));
    expect(fields.preset(15)).toHaveAttribute("aria-pressed", "true");
    expect(fields.preset(10)).toHaveAttribute("aria-pressed", "false");
    expect(fields.preset(20)).toHaveAttribute("aria-pressed", "false");
    expect(lineValue("Tip")).toBe("$15.00");
  });

  test("typing 12.5 in the custom field clears the preset and the tip uses 12.5%", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", preset: 20, people: "4" });
    await user.type(fields.customTip, "12.5");
    for (const percent of [10, 15, 20]) expect(fields.preset(percent)).toHaveAttribute("aria-pressed", "false");
    expect(lineValue("Tip")).toBe("$12.50");
    expect(perPerson()).toBe("$28.13");
  });

  test("choosing a preset after a custom tip clears the custom field", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", custom: "12.5", people: "4" });
    await user.click(fields.preset(10));
    expect(fields.customTip.value).toBe("");
    expect(lineValue("Tip")).toBe("$10.00");
  });

  test.each(["101", "-1", "12.55"])("custom %s shows the valid-range message", async (value) => {
    const { user, ...fields } = setup();
    await user.type(fields.customTip, value);
    expectLinkedError(fields.customTip, TIP_RANGE);
  });

  test("keyboard only: the presets and custom field are reached in order and can be selected", async () => {
    const { user, ...fields } = setup();
    await user.tab();
    expect(document.activeElement).toBe(fields.bill);
    await user.tab();
    expect(document.activeElement).toBe(fields.preset(10));
    await user.tab();
    expect(document.activeElement).toBe(fields.preset(15));
    await user.keyboard("{Enter}");
    expect(fields.preset(15)).toHaveAttribute("aria-pressed", "true");
    await user.tab();
    expect(document.activeElement).toBe(fields.preset(20));
    await user.keyboard(" ");
    expect(fields.preset(20)).toHaveAttribute("aria-pressed", "true");
    expect(fields.preset(15)).toHaveAttribute("aria-pressed", "false");
    await user.tab();
    expect(document.activeElement).toBe(fields.customTip);
    await user.keyboard("18");
    expect(fields.customTip.value).toBe("18");
    await user.tab();
    expect(document.activeElement).toBe(fields.people);
    await user.tab();
    expect(document.activeElement).toBe(fields.roundUp);
  });
});

describe("S3: Split the bill and see live results", () => {
  test("$100.00, 15%, 4 people shows Tip $15.00, Total $115.00, Per person $28.75", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100.00", preset: 15, people: "4" });
    expect(lineValue("Tip")).toBe("$15.00");
    expect(lineValue("Total")).toBe("$115.00");
    expect(perPerson()).toBe("$28.75");
  });

  test("$85.40, 20%, 3 people shows Tip $17.08, Total $102.48, Per person $34.16", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "85.40", preset: 20, people: "3" });
    expect(lineValue("Tip")).toBe("$17.08");
    expect(lineValue("Total")).toBe("$102.48");
    expect(perPerson()).toBe("$34.16");
  });

  test("changing any input updates every result with no button press", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", preset: 15, people: "4" });
    expect(screen.queryByRole("button", { name: /calculate|submit/i })).toBeNull();

    await fill(user, fields, { people: "5" });
    expect(perPerson()).toBe("$23.00");

    await user.click(fields.preset(20));
    expect(lineValue("Tip")).toBe("$20.00");
    expect(lineValue("Total")).toBe("$120.00");
    expect(perPerson()).toBe("$24.00");

    await fill(user, fields, { bill: "200" });
    expect(lineValue("Tip")).toBe("$40.00");
    expect(lineValue("Total")).toBe("$240.00");
    expect(perPerson()).toBe("$48.00");
  });

  test("a single input change re-renders the results well within 100 ms", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", preset: 15, people: "4" });
    const start = performance.now();
    fireEvent.change(fields.people, { target: { value: "2" } });
    const elapsed = performance.now() - start;
    expect(perPerson()).toBe("$57.50");
    expect(elapsed).toBeLessThan(100);
  });

  test("the results panel is a polite live region", () => {
    setup();
    expect(resultsPanel()).toHaveAttribute("aria-live", "polite");
  });

  test.each(["0", "51", "2.5"])("%s people shows the valid-range message", async (value) => {
    const { user, ...fields } = setup();
    await user.type(fields.people, value);
    expectLinkedError(fields.people, PEOPLE_RANGE);
  });

  test("the people field asks phones for a numeric keypad", () => {
    const { people } = setup();
    expect(people).toHaveAttribute("inputmode", "numeric");
  });

  test("money uses thousands separators", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "1234.50", custom: "0", people: "1" });
    expect(lineValue("Total")).toBe("$1,234.50");
  });
});

describe("S5: Clear messages instead of broken results", () => {
  test("on first load no error is shown and every result line shows '—'", () => {
    const fields = setup();
    for (const input of [fields.bill, fields.customTip, fields.people]) expectNoError(input);
    expect(document.querySelectorAll(".field-error")).toHaveLength(0);
    expect(perPerson()).toBe("—");
    expect(lineValue("Tip")).toBe("—");
    expect(lineValue("Total")).toBe("—");
  });

  test("leaving an empty field shows its message", async () => {
    const { user, ...fields } = setup();
    await user.click(fields.bill);
    await user.tab();
    expectLinkedError(fields.bill, "Enter the bill amount");
    expectNoError(fields.people);
  });

  test("leaving the custom tip empty with no preset asks for a tip", async () => {
    const { user, ...fields } = setup();
    await user.click(fields.customTip);
    await user.tab();
    expectLinkedError(fields.customTip, "Choose or enter a tip");
  });

  test.each([
    ["an empty bill", { preset: 15, people: "4" }],
    ["no tip", { bill: "100", people: "4" }],
    ["an empty people field", { bill: "100", preset: 15 }],
    ["an invalid bill", { bill: "0", preset: 15, people: "4" }],
    ["an invalid tip", { bill: "100", custom: "101", people: "4" }],
    ["zero people", { bill: "100", preset: 15, people: "0" }],
  ])("with %s every result line shows '—' and nothing odd", async (_name, values) => {
    const { user, ...fields } = setup();
    await fill(user, fields, values);
    await user.click(fields.roundUp);
    for (const label of ["Tip", "Original total", "Rounded collected total", "Overpayment (extra tip)"]) {
      expect(lineValue(label)).toBe("—");
    }
    expect(perPerson()).toBe("—");
    await user.click(fields.roundUp);
    expect(lineValue("Total")).toBe("—");
    expect(perPerson()).toBe("—");
    expect(resultsPanel().textContent).not.toMatch(/NaN|Infinity|-\$|\$-/);
  });

  test("an invalid field's message sits next to it and is linked with aria-describedby", async () => {
    const { user, ...fields } = setup();
    await user.type(fields.people, "51");
    const id = fields.people.getAttribute("aria-describedby");
    const message = document.getElementById(id);
    expect(message.textContent).toBe(PEOPLE_RANGE);
    expect(fields.people.parentElement.contains(message)).toBe(true);
  });

  test("correcting the field removes the message and updates the results", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "85.40", preset: 20, people: "0" });
    expectLinkedError(fields.people, PEOPLE_RANGE);
    expect(perPerson()).toBe("—");

    await fill(user, fields, { people: "3" });
    expectNoError(fields.people);
    expect(screen.queryByText(PEOPLE_RANGE)).toBeNull();
    expect(perPerson()).toBe("$34.16");
  });
});

describe("S4: Round each share up to $0.50", () => {
  test("on first load the toggle is off and no rounded lines are shown", () => {
    const { roundUp } = setup();
    expect(roundUp.checked).toBe(false);
    expect(line("Original total")).toBeUndefined();
    expect(line("Rounded collected total")).toBeUndefined();
    expect(line("Overpayment (extra tip)")).toBeUndefined();
  });

  test("$85.40, 20%, 3 people with round-up on shows the rounded lines", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "85.40", preset: 20, people: "3" });
    await user.click(fields.roundUp);
    expect(fields.roundUp.checked).toBe(true);
    expect(perPerson()).toBe("$34.50");
    expect(lineValue("Original total")).toBe("$102.48");
    expect(lineValue("Rounded collected total")).toBe("$103.50");
    expect(lineValue("Overpayment (extra tip)")).toBe("$1.02");
  });

  test("a $28.50 share stays $28.50 with $0.00 overpayment", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "100", custom: "14", people: "4" });
    await user.click(fields.roundUp);
    expect(perPerson()).toBe("$28.50");
    expect(lineValue("Overpayment (extra tip)")).toBe("$0.00");
  });

  test("switching round-up off restores the original share and hides the rounded lines", async () => {
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "85.40", preset: 20, people: "3" });
    await user.click(fields.roundUp);
    expect(perPerson()).toBe("$34.50");
    await user.click(fields.roundUp);
    expect(fields.roundUp.checked).toBe(false);
    expect(perPerson()).toBe("$34.16");
    expect(lineValue("Total")).toBe("$102.48");
    expect(line("Original total")).toBeUndefined();
    expect(line("Rounded collected total")).toBeUndefined();
    expect(line("Overpayment (extra tip)")).toBeUndefined();
  });

  test("the switch can be toggled with the keyboard", async () => {
    const { user, roundUp } = setup();
    roundUp.focus();
    await user.keyboard(" ");
    expect(roundUp.checked).toBe(true);
  });
});

describe("Privacy (NFR-05)", () => {
  test("using the app writes nothing to browser storage or cookies", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { user, ...fields } = setup();
    await fill(user, fields, { bill: "85.40", preset: 20, people: "3" });
    await user.click(fields.roundUp);
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
  });
});
