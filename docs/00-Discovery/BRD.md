# Business Requirements (Lite BRD): Tip Calculator

## Executive summary

Groups at a restaurant often struggle to split a bill and tip fairly. The Tip Calculator is a small, static web app that solves this. A diner enters the bill amount, picks a tip percentage, and enters the number of people. The app then shows the tip, the total and each person's equal share, and updates the results as they type.

An optional round-up toggle rounds each share up to the nearest $0.50 and shows the extra money as a separate line. The app is built for phones at the table and also works on desktop. It uses USD only and saves no data.

The app will be built in one sprint as a front-end-only app and deployed to GitHub Pages. It has no server, no database, no sign-in and no secrets. This BRD also holds the user stories and acceptance criteria, because Phase 1 (functional requirements) is merged into it.

## Business objectives

| # | Objective | Success measure |
|---|---|---|
| OBJ-1 | Give the group a correct, fair split of bill and tip | All 10 cases in the approved reference table match the app's tip, total, per-person amount and round-up values to the cent. Unit tests in CI check this on every build. |
| OBJ-2 | Make the split fast enough to use at the table | Results update within 100 ms of each keystroke or button press. |
| OBJ-3 | Make the app usable by everyone on their own device | The app meets WCAG 2.1 AA for labels, contrast and keyboard use. It works in current Chrome, Safari, Firefox and Edge on phone and desktop. |
| OBJ-4 | Deliver a working app within one sprint | The app is deployed on GitHub Pages by the end of Sprint 1, with the CI pipeline (`npm ci`, `npm test`, `npm run build`) passing. |

## User personas

| Persona | Description | Goals | Context |
|---|---|---|---|
| P1: Bill organiser | The diner who takes the bill and works out what everyone owes. Comfortable with a phone, but does not want to do mental arithmetic in a noisy restaurant. | Enter the bill quickly, choose a tip, and read out one clear amount per person. Optionally round to a convenient amount. | Uses a phone at the table, often one-handed and in low light. Expects results instantly. |
| P2: Group member | A diner who wants to check their own share or run the numbers on their own phone. May use a screen reader, keyboard or larger text. | Trust that their share is correct and see where any extra money goes. | Uses their own phone or, less often, a laptop. Uses whichever current browser they have. |

## Scope (in and out)

### In scope

- Bill amount input in USD ($ symbol, '.' as the decimal separator, 2 decimals). Valid range: 0.01–99,999.99.
- Tip percentage selection:
  - preset buttons for 10%, 15% and 20%; or
  - a custom value from 0–100% (whole numbers or one decimal place).
- Number of people input: whole numbers from 1–50, with an equal split of the total.
- Live results that update within 100 ms of typing:
  - tip amount;
  - total (bill + tip);
  - amount per person.
- The tip is calculated on the bill as entered.
- Round-up toggle, off by default. When on, it:
  - rounds each person's share up to the nearest $0.50;
  - shows the original total and the rounded collected total;
  - shows the overpayment (extra tip) as a separate line.
- Inline validation messages for empty or out-of-range fields. Results show '—' instead of NaN or invalid numbers.
- Mobile-first responsive layout that also works on desktop in current Chrome, Safari, Firefox and Edge. It meets WCAG 2.1 AA for labels, contrast and keyboard use.
- Unit tests in CI that check the calculation logic against a reference table of 10 test cases to the cent.
- Deployment to GitHub Pages by the end of Sprint 1.

### Out of scope

- Uneven or itemised splits (different shares per person or per dish).
- Tax and service-charge handling (excluding tax or included service from the tip base).
- Currencies other than USD, currency conversion and locale-specific number formats.
- Saving, history or sharing of calculations. No browser storage is needed.
- Rounding modes other than rounding up to the nearest $0.50 per person (for example: round down, nearest $1, or rounding the total).
- User accounts, sign-in, a server, a database or any secrets.
- Payment integration or sending payment requests to group members.
- Native mobile apps or offline install (PWA).

## Business requirements

| BR ID | Description | Persona | MoSCoW | Rationale |
|---|---|---|---|---|
| BR-01 | The user can enter a bill amount in USD, from $0.01 to $99,999.99, with up to 2 decimals and '.' as the decimal separator. | P1 | Must | The bill is the base for every calculation. |
| BR-02 | The user can choose a tip with preset buttons (10%, 15%, 20%) or enter a custom tip from 0–100%. A custom tip may be a whole number or have one decimal place. The tip is calculated on the bill as entered. | P1 | Must | Presets make the common case fast. The custom value covers local customs and service quality. |
| BR-03 | The user can enter the number of people (whole numbers 1–50). The total is split equally between them. | P1, P2 | Must | An equal split is the core way the group decides who owes what. |
| BR-04 | The app shows the tip amount, the total (bill + tip) and the amount per person in USD with 2 decimals. These update within 100 ms of any input change, with no submit button. | P1, P2 | Must | Instant, clear results make the app usable at the table and let members check their share. |
| BR-05 | A round-up toggle (off by default) rounds each person's share up to the nearest $0.50. It then shows the original total, the rounded collected total and the overpayment (extra tip) as a separate line. | P1, P2 | Should | Round amounts are easier to pay in cash or by transfer. Showing the overpayment keeps the split transparent and fair. |
| BR-06 | Empty or out-of-range fields show an inline message next to the field. While any input is invalid, the results show '—' and never NaN, Infinity or a negative amount. | P1, P2 | Must | Wrong or broken numbers would undermine trust in the split. |

## User stories

The intake asked for 3–4 stories. The framework requires 5–10 stories, so the confirmed scope is split into 5 small stories. No scope has been added. The examples below use the conventions in "Assumptions and constraints".

### US-01: Enter the bill amount

As a bill organiser, I want to type the bill amount in dollars so that the app can work out the tip and the split.

**Serves:** BR-01

**Acceptance criteria:**
- Given the bill field, when I enter 85.40, then it is accepted, the field is labelled "Bill amount ($)", and no error is shown.
- Given the bill field, when I enter 0, 100000 or 12.345, then an inline message explains the valid range (0.01–99,999.99, up to 2 decimals).
- Given a phone, when I focus the bill field, then a numeric keypad with a decimal point is offered.

### US-02: Choose the tip percentage

As a bill organiser, I want to tap 10%, 15% or 20%, or type my own tip percentage, so that the tip matches what the group wants to leave.

**Serves:** BR-02

**Acceptance criteria:**
- Given the tip options, when I tap the 15% button, then that button is shown as selected (also announced to screen readers) and the tip uses 15%.
- Given a preset is selected, when I type 12.5 in the custom tip field, then no preset is shown as selected and the tip uses 12.5%.
- Given the custom tip field, when I enter 101, -1 or 12.55, then an inline message explains the valid range (0–100%, whole numbers or one decimal).
- Given the tip options, when I use only the keyboard, then I can reach and select every preset and the custom field in a logical order.

### US-03: Split the bill and see live results

As a bill organiser, I want to enter the number of people and see the tip, total and per-person amount update as I type, so that I can tell everyone what they owe straight away.

**Serves:** BR-03, BR-04

**Acceptance criteria:**
- Given a bill of $100.00, a 15% tip and 4 people, when the inputs are entered, then the app shows Tip $15.00, Total $115.00 and Per person $28.75.
- Given a bill of $85.40, a 20% tip and 3 people, then the app shows Tip $17.08, Total $102.48 and Per person $34.16.
- Given valid inputs, when I change any one of them, then all results update within 100 ms without pressing a button.
- Given the people field, when I enter 0, 51 or 2.5, then an inline message explains the valid range (whole numbers 1–50).

### US-04: Round each share up to the nearest $0.50

As a bill organiser, I want to switch on rounding each share up to the nearest $0.50 so that everyone pays a convenient amount and we can see the extra tip.

**Serves:** BR-05

**Acceptance criteria:**
- Given the app has just loaded, then the round-up toggle is off and no rounded lines are shown.
- Given a bill of $85.40, a 20% tip and 3 people, when I switch round-up on, then the app shows:
  - Per person $34.50;
  - Original total $102.48;
  - Rounded collected total $103.50;
  - Overpayment (extra tip) $1.02.
- Given a share that is already a multiple of $0.50 (for example $28.50), when round-up is on, then the share stays $28.50 and the overpayment is $0.00.
- Given round-up is on, when I switch it off, then the original per-person amount is shown again and the rounded lines are hidden.

### US-05: Get clear messages instead of broken results

As a group member, I want clear messages when something is missing or wrong, and never NaN or other odd numbers, so that I can trust the results I see.

**Serves:** BR-06

**Acceptance criteria:**
- Given any required input is empty or invalid, then every result line shows '—'. No result shows NaN, Infinity or a negative amount.
- Given an invalid field, then its inline message is shown next to the field and is linked to it so screen readers announce it.
- Given I correct the invalid field, then the message disappears and the results update within 100 ms.
- Given the app has just loaded with empty fields, then no error messages are shown until I edit or leave a field.

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Accuracy | All amounts are correct to the cent. Calculations must not show floating-point errors (for example $0.30000000000004). Unit tests check the 10-case reference table in CI on every build. |
| NFR-02 | Performance | Results update within 100 ms of any input change on a current mid-range phone. |
| NFR-03 | Accessibility | Meets WCAG 2.1 AA for labels, contrast and keyboard use: <ul><li>every input and toggle has a visible label;</li><li>text contrast is at least 4.5:1;</li><li>all controls work by keyboard, with a visible focus indicator;</li><li>result changes and inline errors are announced to screen readers.</li></ul> |
| NFR-04 | Browser and device support | Mobile-first layout that is usable from 320 px wide to desktop. Works in the current versions of Chrome, Safari, Firefox and Edge. |
| NFR-05 | Privacy | The app stores no data: no localStorage, sessionStorage, cookies or IndexedDB. It makes no network calls after loading, so no bill data leaves the browser. |
| NFR-06 | Formatting | All money is shown in USD as $ with 2 decimals and '.' as the decimal separator. Thousands use ',' (for example $1,234.50). |
| NFR-07 | Maintainability and delivery | Built on the demo repo starter template (React 18 + Vite 5, Vitest). CI runs `npm ci`, `npm test` and `npm run build`. `dist/` is deployed to GitHub Pages on merge to main. |

## Assumptions and constraints

### Constraints

- **Static front end only.** The app is deployed to GitHub Pages, with no server, database, sign-in or secrets.
- **One sprint.** The app is built, tested and deployed in Sprint 1.
- **Starter template.** The app is built on the demo repo starter template, and its npm scripts and Pages deployment are kept.
- **USD only.** Amounts use '.' as the decimal separator and 2 decimals.
- **Equal split only.** Uneven or itemised splits are out of scope.
- **Tip base.** The tip is calculated on the bill as entered.

### Assumptions (to confirm at the gate)

- **A1: Cent rounding.** The tip and the unrounded per-person amount are rounded to the nearest cent, half up.
  - Because of this rounding, the per-person amounts may not add up exactly to the total. For example, $100.00 split 3 ways gives $33.33 each. The app does not adjust shares to absorb the leftover cent.
- **A2: Basis for round-up.** Round-up uses the exact per-person share (total ÷ people) and rounds it up to the next multiple of $0.50.
  - The rounded collected total is the rounded share × people.
  - The overpayment is the rounded collected total − the original total.
- **A3: Starting state.** On first load:
  - the bill and custom tip fields are empty;
  - no tip preset is selected;
  - the people field is empty;
  - the results show '—'.

  Defaults such as 15% or 2 people are not assumed.
- **A4: Reference table.** The team drafts the 10-case reference table during Phase 2/3, and the Admin approves it. It includes:
  - the two examples in US-03 and US-04;
  - edge cases at the input limits (for example $0.01, $99,999.99, 0% and 100% tip, 1 and 50 people).
- **A5: Number of stories.** The intake asked for 3–4 stories, and the framework minimum of 5 is met by splitting the same scope. No extra features are added.
- **A6: Tip input precision.** A custom tip with more than one decimal place is treated as invalid, not rounded.

## Dependencies

| ID | Dependency | Needed for | Owner |
|---|---|---|---|
| D-01 | The demo GitHub repository and starter template (React 18, Vite 5, Vitest 2, Testing Library, jsdom) | Build and tests | Admin |
| D-02 | GitHub Actions CI workflow (`ci.yml`) and GitHub Pages deployment workflow (`deploy-pages.yml`) | OBJ-4, NFR-07 | Admin |
| D-03 | An approved 10-case reference table of expected results | OBJ-1, NFR-01 | Admin (approves), team (drafts) |
| D-04 | Access to current Chrome, Safari, Firefox and Edge, plus at least one phone, for verification | NFR-03, NFR-04 | Team |
| D-05 | Admin approval of each phase gate (Charter and BRD, Backlog, SDD, Design) before the next phase starts | All phases | Admin |

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor, Product Owner) | Admin | Pending gate approval | — |

Status: **Pending gate approval** (Phase 0 gate: Charter sign-off).