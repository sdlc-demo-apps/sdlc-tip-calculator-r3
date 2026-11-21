# Test Report: Tip Calculator

## Summary

**Verdict: ready for release with known issues.** All automated tests pass in CI. However, 3 of the 19 acceptance criteria have no named test in the evidence, and the manual Definition of Done checks are still open. The Admin decides at this gate whether to accept these gaps.

- **CI result:** success on PR #1, with 0 CI fix attempts.
- **Tests:** 4 test files and 134 tests ran, and all 134 passed. The evidence lists 46 distinct test and group names, which includes parameterised cases such as the 10 reference cases.
- **Acceptance criteria coverage:** 16 of 19 ACs are verified by a named test. 3 are reported as Not covered.

## Test approach

- **Unit tests (Vitest 2):** these cover the pure modules.
  - `calc.test.js` (44 tests): integer-cents maths, the 10-case reference table, and round-up to $0.50.
  - `validate.test.js` (44 tests): bill, tip and people validation.
  - `format.test.js` (7 tests): money formatting and the '—' fallback.
- **Integration tests (Vitest + Testing Library + jsdom + user-event):** `App.test.jsx` (39 tests) renders the whole app. It types into fields, taps presets, toggles the switch and uses the keyboard, then checks the visible results and ARIA attributes.
- **Where the tests run:** GitHub Actions runs `npm ci`, `npm test` and `npm run build` on the pull request merge commit.
- **Automated:** calculations to the cent, validation messages, live updates, ARIA state (`aria-pressed`, `aria-describedby`, the polite live region), keyboard order, the keypad hints (`inputmode`), and the absence of storage and cookie writes.
- **Not automated, and still open:**
  - running the app in a real browser (`npm run dev`)
  - Chrome, Safari, Firefox and Edge, and at least one phone
  - the 320 px layout
  - colour contrast (4.5:1)
  - the 100 ms check on the deployed app
  - the Pages deploy

  The PR states that no browser was available, so none of these were done.
- **Speed test limit:** the jsdom re-render test ("well within 100 ms") is only an indication. It does not replace the check on the deployed app.

## Acceptance criteria coverage

| Story | Acceptance criterion | Test(s) that verify it (file: test name) | Result |
|---|---|---|---|
| S1 | 85.40 accepted, labelled "Bill amount ($)", no error | App.test.jsx: "85.40 is accepted under the label 'Bill amount ($)' with no error" | Pass |
| S1 | 0, 100000, 12.345 show a range message | validate.test.js (validateBill): "the range message explains the valid range" | Pass |
| S1 | Phone offers a decimal keypad | App.test.jsx: "the bill field asks phones for a decimal keypad" | Pass |
| S2 | Tapping 15% marks it selected for screen readers; tip uses 15% | App.test.jsx: "tapping 15% marks it selected for screen readers and the tip uses 15%" | Pass |
| S2 | Typing 12.5 clears the preset; tip uses 12.5% | App.test.jsx: "typing 12.5 in the custom field clears the preset and the tip uses 12.5%"; validate.test.js: "a custom value wins over a preset" | Pass |
| S2 | 101, -1, 12.55 show a range message | No named test under validateTip or in App.test.jsx | Not covered |
| S2 | Keyboard reaches and selects presets and custom field in order | App.test.jsx: "keyboard only: the presets and custom field are reached in order and can be selected" | Pass |
| S3 | $100.00, 15%, 4 people → $15.00 / $115.00 / $28.75 | App.test.jsx: "$100.00, 15%, 4 people shows Tip $15.00, Total $115.00, Per person $28.75"; calc.test.js: reference table | Pass |
| S3 | $85.40, 20%, 3 people → $17.08 / $102.48 / $34.16 | App.test.jsx: "$85.40, 20%, 3 people shows Tip $17.08, Total $102.48, Per person $34.16"; calc.test.js: reference table | Pass |
| S3 | Results update within 100 ms with no button press | App.test.jsx: "changing any input updates every result with no button press"; "a single input change re-renders the results well within 100 ms" | Pass (jsdom only) |
| S3 | 0, 51, 2.5 people show a range message | No named test under validatePeople or in App.test.jsx | Not covered |
| S4 | First load: toggle off, no rounded lines | App.test.jsx: "on first load the toggle is off and no rounded lines are shown" | Pass |
| S4 | $85.40, 20%, 3 on → $34.50 / $102.48 / $103.50 / $1.02 | App.test.jsx: "$85.40, 20%, 3 people with round-up on shows the rounded lines"; calc.test.js: reference table | Pass |
| S4 | $28.50 share stays $28.50, $0.00 overpayment | App.test.jsx: "a $28.50 share stays $28.50 with $0.00 overpayment"; calc.test.js: "a $28.50 share stays $28.50 with no overpayment" | Pass |
| S4 | Switching off restores the share and hides rounded lines | App.test.jsx: "switching round-up off restores the original share and hides the rounded lines" | Pass |
| S5 | Empty or invalid input → '—' on every line, never NaN, Infinity or a negative amount | App.test.jsx: "on first load no error is shown and every result line shows '—'" (empty inputs only); format.test.js: "null is shown as a dash". No named test for invalid values. | Not covered (invalid-value part) |
| S5 | Inline message next to the field, linked for screen readers | App.test.jsx: "an invalid field's message sits next to it and is linked with aria-describedby" | Pass |
| S5 | Correcting the field removes the message and updates results | App.test.jsx: "correcting the field removes the message and updates the results" | Pass |
| S5 | No error on first load until a field is edited or left | App.test.jsx: "on first load no error is shown and every result line shows '—'"; "leaving an empty field shows its message" | Pass |

**Notes on the Not covered rows:**

- The PR description says these three behaviours are tested, including "six invalid or empty combinations".
- The test files hold more tests (134) than distinct names (46), so the tests may exist under repeated or parameterised names.
- They are still reported as Not covered, because the evidence names no test for them.

## Requirements traceability

| BR ID | Story | Code module(s) | Test file(s) | Status |
|---|---|---|---|---|
| BR-01 | S1 | BillInput, validate.js | App.test.jsx, validate.test.js | Pass (3/3 ACs) |
| BR-02 | S2 | TipSelector, validate.js | App.test.jsx, validate.test.js | Partly covered (3/4 ACs; range message not covered) |
| BR-03, BR-04 | S3 | PeopleInput, Results, calc.js, format.js, validate.js | App.test.jsx, calc.test.js, format.test.js, validate.test.js | Partly covered (3/4 ACs; people range message not covered) |
| BR-05 | S4 | RoundUpToggle, calc.js | App.test.jsx, calc.test.js | Pass (4/4 ACs) |
| BR-06 | S5 | validate.js, format.js, Results | App.test.jsx, format.test.js, validate.test.js | Partly covered (3/4 ACs; invalid-value '—' not covered) |
| NFR-05 (privacy) | All | App.jsx | App.test.jsx: "using the app writes nothing to browser storage or cookies" | Pass |

Every BR has at least one passing test. No BR is left without a test.

## CI run

- **Result:** success
- **Link:** https://github.com/sdlc-demo-apps/sdlc-tip-calculator-r3/actions/runs/44902776059/job/136841985378
- **Commit:** merge commit 6b3e8c8 (PR #1). Node v22.23.5, npm 10.9.9.
- **Steps:**
  - `npm ci`: 164 packages added.
  - `npm test`: Vitest v2.1.8.
  - `npm run build`: Vite v5.4.11, 40 modules, built in 737 ms.

Test summary lines from the log:

```
✓ src/lib/calc.test.js (44 tests) 21ms
✓ src/lib/validate.test.js (44 tests) 16ms
✓ src/lib/format.test.js (7 tests) 5ms
✓ src/App.test.jsx (39 tests) 2157ms
Test Files  4 passed (4)
     Tests  134 passed (134)
  Duration  3.45s
```

Build output: the JS bundle is 149.23 kB, or 48.24 kB gzipped. The CSS is 5.08 kB, or 1.67 kB gzipped.

Warnings in the log:

- `npm audit` reports 5 vulnerabilities (2 moderate, 1 high, 2 critical) in installed packages.
- A `whatwg-encoding` deprecation notice.
- Node 20 action deprecation notices for `actions/checkout@v4` and `actions/setup-node@v4`.

None of these warnings failed the run.

## Code review

The Reviewer at Gate 5 passed all 7 checks:

1. Every Must story (S1, S2, S3, S5) is implemented. S4 (Should) is also done.
2. Each AC is covered by at least one test. The Reviewer relied on the PR's mapping. This report could not confirm a named test for 3 ACs.
3. The build follows the approved design.
   - **Attention:** the SDD and the mockup were not among the Reviewer's inputs. The component names and the look were checked only against the PR's claims.
4. There are no external network calls, secrets or tracking.
5. The app is accessible:
   - visible labels
   - `aria-pressed` on the presets
   - `role=switch` on the toggle
   - `aria-describedby` linking each error to its field
   - a polite live region for the results
   - a 3px `:focus-visible` outline
6. CI passed.
7. The workflow files and `vite.config.js` are unchanged. The only new dev dependency is `@testing-library/user-event` 14.6.1.

## Defects and known issues

No test failed. Known issues:

1. **Not covered:** S2, the range message for a custom tip of 101, -1 or 12.55 (BR-02).
2. **Not covered:** S3, the range message for 0, 51 or 2.5 people (BR-03/BR-04).
3. **Not covered:** S5, '—' with no NaN, Infinity or negative amount when a value is invalid rather than empty (BR-06).
4. **Reference table not approved:** the 10-case table in `src/lib/referenceCases.js` was drafted by the developer. It still needs Admin approval (D-03). The calc tests pass against this draft.
5. **Vite base path:** `base` was not set to `/Demo-E2E-SDLC/` as the SDD asks. `deploy-pages.yml` derives the base path from the repo name, and the repo is `sdlc-tip-calculator-r3`. The deployed URL will therefore differ from the backlog's URL. Confirm the URL at deployment.
6. **Manual Definition of Done checks are open:** `npm run dev`, four browsers and a phone, the 320 px layout, contrast, and the 100 ms check on the deployed app.
7. **Hand-edited `package-lock.json`:** the developer edited it by hand to add user-event. `npm ci` succeeded in CI.
8. **npm audit:** it reports 5 vulnerabilities, 2 of them critical. These are not investigated here.
9. **Text change from the mockup:** with 1 person, the hint reads "No split: 1 person pays it all."

## UAT sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor, Product Owner) | Admin | Pending gate approval | — |

Gate 6 approval by the Admin is the UAT sign-off. It confirms acceptance of the known issues above before deployment in Phase 7.
