# Product Backlog: Tip Calculator

This backlog turns the approved Lite BRD into one sprint of work. Each story traces to one BRD user story (US-01 to US-05) and its business requirement. No scope is added. Repository: github.com/shindesubodh/Demo-E2E-SDLC. Deployed URL: https://shindesubodh.github.io/Demo-E2E-SDLC/.

## Epic overview

| Epic ID | Epic | Goal | Stories |
|---|---|---|---|
| E1 | Bill inputs | Let the bill organiser enter the bill, tip and number of people quickly and correctly on a phone. | S1, S2 |
| E2 | Results and split | Show correct tip, total and per-person amounts live, with an optional round-up to $0.50. | S3, S4 |
| E3 | Validation and trust | Show clear inline messages and never broken numbers, so every group member can trust the result. | S5 |

## Stories

| ID | Epic | User story | Acceptance criteria | MoSCoW | T-shirt | Points | Sprint | Status | Depends on | BRD ref |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | E1 | As a bill organiser, I want to type the bill amount in dollars so that the app can work out the tip and the split. | Given the bill field, when I enter 85.40, then it is accepted, the field is labelled "Bill amount ($)" and no error is shown.<br>Given the bill field, when I enter 0, 100000 or 12.345, then an inline message explains the valid range (0.01–99,999.99, up to 2 decimals).<br>Given a phone, when I focus the bill field, then a numeric keypad with a decimal point is offered. | Must | S | 2 | Sprint 1 | Planned \| Sprint 1 | — | US-01 / BR-01 |
| S2 | E1 | As a bill organiser, I want to tap 10%, 15% or 20%, or type my own tip percentage, so that the tip matches what the group wants to leave. | Given the tip options, when I tap 15%, then that button is shown as selected (and announced to screen readers) and the tip uses 15%.<br>Given a preset is selected, when I type 12.5 in the custom field, then no preset is selected and the tip uses 12.5%.<br>Given the custom field, when I enter 101, -1 or 12.55, then an inline message explains the valid range (0–100%, whole or one decimal).<br>Given keyboard-only use, then I can reach and select every preset and the custom field in a logical order. | Must | M | 3 | Sprint 1 | Planned \| Sprint 1 | — | US-02 / BR-02 |
| S3 | E2 | As a bill organiser, I want to enter the number of people and see the tip, total and per-person amount update as I type, so that I can tell everyone what they owe straight away. | Given $100.00, 15% and 4 people, then the app shows Tip $15.00, Total $115.00, Per person $28.75.<br>Given $85.40, 20% and 3 people, then the app shows Tip $17.08, Total $102.48, Per person $34.16.<br>Given valid inputs, when I change any one, then all results update within 100 ms with no button press.<br>Given the people field, when I enter 0, 51 or 2.5, then an inline message explains the valid range (whole numbers 1–50). | Must | L | 5 | Sprint 1 | Planned \| Sprint 1 | S1, S2 | US-03 / BR-03, BR-04 |
| S4 | E2 | As a bill organiser, I want to switch on rounding each share up to the nearest $0.50 so that everyone pays a convenient amount and we can see the extra tip. | Given first load, then the toggle is off and no rounded lines are shown.<br>Given $85.40, 20%, 3 people and round-up on, then the app shows Per person $34.50, Original total $102.48, Rounded collected total $103.50, Overpayment (extra tip) $1.02.<br>Given a share of $28.50 and round-up on, then the share stays $28.50 and the overpayment is $0.00.<br>Given round-up is on, when I switch it off, then the original per-person amount returns and the rounded lines are hidden. | Should | M | 3 | Sprint 1 | Planned \| Sprint 1 | S3 | US-04 / BR-05 |
| S5 | E3 | As a group member, I want clear messages when something is missing or wrong, and never NaN or other odd numbers, so that I can trust the results I see. | Given any required input is empty or invalid, then every result line shows '—' and none shows NaN, Infinity or a negative amount.<br>Given an invalid field, then its inline message is shown next to it and linked so screen readers announce it.<br>Given I correct the field, then the message disappears and results update within 100 ms.<br>Given first load with empty fields, then no error is shown until I edit or leave a field. | Must | M | 3 | Sprint 1 | Planned \| Sprint 1 | S1, S2, S3 | US-05 / BR-06 |

Notes:
- There are no Could stories. The BRD has no Could requirements, and the intake asked for a small scope.
- S3 includes the shared calculation module (cent rounding, half up, per assumption A1) and the 10-case reference table unit tests (NFR-01). That is why it is the largest story.
- Accessibility (NFR-03), formatting (NFR-06) and privacy (NFR-05) apply to every story through the Definition of Done.

## Estimation

**Method.** Each story was given a T-shirt size first, then mapped to Fibonacci points: S = 2, M = 3, L = 5 (XS = 1 and XL = 8 were not needed).

| Story | T-shirt | Points | Main effort |
|---|---|---|---|
| S1 | S | 2 | One validated input with `inputMode="decimal"`, label and range check |
| S2 | M | 3 | Preset buttons with `aria-pressed`, custom field, mutual exclusion, keyboard order |
| S3 | L | 5 | Calculation module in integer cents, live results, people field, 10-case reference tests |
| S4 | M | 3 | Round-up toggle, rounding to the next $0.50, three extra result lines |
| S5 | M | 3 | Shared validation state, `aria-describedby` messages, '—' fallback, "touched" logic |
| **Total** | | **16** | |

**Velocity assumption.** The team has one sprint with a capacity of 18 points. This assumes one developer and about 5 working days, at 3–4 points per day. The starter template, CI and Pages workflows already exist (dependencies D-01, D-02).

**Confidence level: High (about 80%).**
- The scope is small and fully specified, with worked examples in the acceptance criteria.
- There is no server, storage or integration work.
- The main risks are:
  - money rounding edge cases (handled by computing in integer cents);
  - Admin approval of the 10-case reference table (D-03) arriving late;
  - manual checks across four browsers and a phone (D-04).

## Sprint 1 plan

| Order | Story | Points | Why this order |
|---|---|---|---|
| 1 | S1: Enter the bill amount | 2 | The base input; needed by every calculation |
| 2 | S2: Choose the tip percentage | 3 | The second input to the calculation |
| 3 | S3: Split the bill and see live results | 5 | Needs S1 and S2; delivers the core value and the reference tests |
| 4 | S5: Clear messages instead of broken results | 3 | Hardens all inputs and results once they exist |
| 5 | S4: Round each share up to $0.50 | 3 | Should priority; builds on the S3 calculation, done last so it can slip without blocking the core |

**Total:** 16 points planned against a capacity of 18 points (89%). This leaves 2 points of buffer for cross-browser fixes and reference-table changes.

**Sprint goal (demonstrable).** At https://shindesubodh.github.io/Demo-E2E-SDLC/, on a phone, a user can:
- enter $85.40, tap 20% and enter 3 people, and see Tip $17.08, Total $102.48 and Per person $34.16 update as they type;
- switch round-up on and see $34.50 per person, a rounded collected total of $103.50 and an overpayment of $1.02;
- enter 0 people and see an inline message, with '—' in every result line.

The GitHub Actions run shows all 10 reference cases passing.

## Definition of Done

A story is Done ("Done | Sprint 1") only when every item below is checked.

**Code and review**
- [ ] Code is merged to `main` in github.com/shindesubodh/Demo-E2E-SDLC through a pull request.
- [ ] The app is built on the starter template (React 18 + Vite 5). All of the template's npm scripts are kept unchanged (including `dev`, `test` and `build`), as is `package-lock.json` so `npm ci` works, along with `.github/workflows/ci.yml` and `.github/workflows/deploy-pages.yml`.
- [ ] There is no localStorage, sessionStorage, cookie or IndexedDB use, and no network call after load (NFR-05).

**Tests and CI**
- [ ] `npm ci`, `npm test` (Vitest 2 + Testing Library + jsdom) and `npm run build` pass locally.
- [ ] The same three steps pass in the GitHub Actions CI run for the merge commit.
- [ ] Each acceptance criterion of the story has at least one automated unit or integration test.
- [ ] For S3: the calculation module's unit tests cover all 10 cases in the reference table approved by the Admin under D-03 and pass to the cent, with no floating-point artefacts. For S4: the round-up cases in that table also pass, and the S3 reference tests still pass.

**Acceptance and quality**
- [ ] Every acceptance criterion is verified manually in the local dev build (`npm run dev`).
- [ ] Money shows as $ with 2 decimals and ',' thousands separators (for example $1,234.50).
- [ ] Accessibility (WCAG 2.1 AA): visible labels, contrast of at least 4.5:1, full keyboard use with a visible focus indicator, and errors and results announced to screen readers.
- [ ] The layout is usable from 320 px wide to desktop.

**Deployment**
- [ ] The `deploy-pages.yml` run for the merge to `main` succeeds.
- [ ] The story's acceptance criteria are re-checked at https://shindesubodh.github.io/Demo-E2E-SDLC/ in current Chrome, Safari, Firefox and Edge, and on at least one phone.
- [ ] Results update within 100 ms of input on the deployed app (checked with browser dev tools).
- [ ] The story status is updated to "Done | Sprint 1" in this backlog and in Jira.

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor, Product Owner) | Admin | Pending gate approval | — |

Status: **Pending gate approval** (Phase 2 gate: Backlog groomed). After approval, epics E1–E3 and stories S1–S5 will be created in the demo Jira project. Each story will carry its acceptance criteria, Jira priority (Must = High, Should = Medium), points and epic as parent.
