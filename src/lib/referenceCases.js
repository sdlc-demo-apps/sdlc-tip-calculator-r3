// The 10-case reference table (NFR-01, D-03). All amounts are integer cents; the tip is in tenths of a percent.
// The first two cases are the US-03 / US-04 examples; the rest cover the input limits and rounding boundaries.
export const referenceCases = [
  {
    name: "US-03 example: $100.00, 15%, 4 people",
    input: { billCents: 10000, tipTenths: 150, people: 4 },
    expected: { tipCents: 1500, totalCents: 11500, perPersonCents: 2875, roundedPerPersonCents: 2900, collectedCents: 11600, overpaymentCents: 100 },
  },
  {
    name: "US-03 / US-04 example: $85.40, 20%, 3 people",
    input: { billCents: 8540, tipTenths: 200, people: 3 },
    expected: { tipCents: 1708, totalCents: 10248, perPersonCents: 3416, roundedPerPersonCents: 3450, collectedCents: 10350, overpaymentCents: 102 },
  },
  {
    name: "Share already a multiple of $0.50: $100.00, 14%, 4 people",
    input: { billCents: 10000, tipTenths: 140, people: 4 },
    expected: { tipCents: 1400, totalCents: 11400, perPersonCents: 2850, roundedPerPersonCents: 2850, collectedCents: 11400, overpaymentCents: 0 },
  },
  {
    name: "Lower limits: $0.01, 0%, 1 person",
    input: { billCents: 1, tipTenths: 0, people: 1 },
    expected: { tipCents: 0, totalCents: 1, perPersonCents: 1, roundedPerPersonCents: 50, collectedCents: 50, overpaymentCents: 49 },
  },
  {
    name: "Upper limits: $99,999.99, 100%, 50 people",
    input: { billCents: 9999999, tipTenths: 1000, people: 50 },
    expected: { tipCents: 9999999, totalCents: 19999998, perPersonCents: 400000, roundedPerPersonCents: 400000, collectedCents: 20000000, overpaymentCents: 2 },
  },
  {
    name: "Custom one-decimal tip, half-cent share: $100.00, 12.5%, 4 people",
    input: { billCents: 10000, tipTenths: 125, people: 4 },
    expected: { tipCents: 1250, totalCents: 11250, perPersonCents: 2813, roundedPerPersonCents: 2850, collectedCents: 11400, overpaymentCents: 150 },
  },
  {
    name: "Half-cent tip rounds up: $10.10, 15%, 2 people",
    input: { billCents: 1010, tipTenths: 150, people: 2 },
    expected: { tipCents: 152, totalCents: 1162, perPersonCents: 581, roundedPerPersonCents: 600, collectedCents: 1200, overpaymentCents: 38 },
  },
  {
    name: "Repeating share rounds up: $100.00, 10%, 3 people",
    input: { billCents: 10000, tipTenths: 100, people: 3 },
    expected: { tipCents: 1000, totalCents: 11000, perPersonCents: 3667, roundedPerPersonCents: 3700, collectedCents: 11100, overpaymentCents: 100 },
  },
  {
    name: "Repeating share rounds down: $100.00, 20%, 7 people",
    input: { billCents: 10000, tipTenths: 200, people: 7 },
    expected: { tipCents: 2000, totalCents: 12000, perPersonCents: 1714, roundedPerPersonCents: 1750, collectedCents: 12250, overpaymentCents: 250 },
  },
  {
    name: "Thousands and a fractional tip: $1,234.50, 18.5%, 50 people",
    input: { billCents: 123450, tipTenths: 185, people: 50 },
    expected: { tipCents: 22838, totalCents: 146288, perPersonCents: 2926, roundedPerPersonCents: 2950, collectedCents: 147500, overpaymentCents: 1212 },
  },
];
