# Sprint Kickoff Brief: Tip Calculator

## Sprint goal

By the end of Sprint 1, a user on a phone can open https://shindesubodh.github.io/Demo-E2E-SDLC/, enter $85.40, tap 20% and enter 3 people, and see Tip $17.08, Total $102.48 and Per person $34.16 update as they type. With round-up on, they see $34.50 per person, a collected total of $103.50 and an overpayment of $1.02. Invalid input shows an inline message and '—' in every result line, and the CI run shows all 10 reference cases passing.

## Stories in this sprint

| ID | Story | MoSCoW | Points |
|---|---|---|---|
| S1 | Enter the bill amount | Must | 2 |
| S2 | Choose the tip percentage (presets or custom) | Must | 3 |
| S3 | Split the bill and see live results | Must | 5 |
| S5 | Clear messages instead of broken results | Must | 3 |
| S4 | Round each share up to $0.50 | Should | 3 |

**Total: 16 points** against a capacity of 18 points. The build order is S1, S2, S3, S5, then S4.

## How it will be built

- **Components:** `App.jsx` holds the raw input strings, `roundUp` and `touched` in `useState`. It renders `BillInput`, `TipSelector`, `PeopleInput`, `RoundUpToggle`, `Results` and `FieldError` from `src/components/`.
- **Pure modules:** `validate.js` parses the inputs to cents, tenths of a percent and whole people. `calc.js` does all the maths in integer cents, with half-up rounding by integer division and round-up to the next multiple of 50 cents. `format.js` renders `$1,234.50`, or '—' for `null`.
- **Live updates:** results are derived synchronously on every render, with no debounce and no `useEffect`, to meet the 100 ms target. `Results` sits in an `aria-live="polite"` region.
- **Storage contract:** none. The app makes no localStorage, sessionStorage, cookie or IndexedDB use and no network call after load. Inputs reset on reload.
- **Design tokens:** the colour, typography, spacing and focus tokens from the Phase 4 mockup's Design notes are copied as CSS custom properties into `src/styles.css`. The layout is mobile-first from 320 px. Component names match the SDD.
- **Template:** React 18 + Vite 5 with `base: '/Demo-E2E-SDLC/'`. The npm scripts, `package-lock.json`, `ci.yml` and `deploy-pages.yml` stay unchanged.
- **Tests:**
  - Unit tests in `calc.test.js` (10 reference cases from `referenceCases.js`, limits, `RangeError`), `validate.test.js` and `format.test.js`.
  - Integration tests in `App.test.jsx` with Testing Library + user-event cover labels, `aria-pressed`, live results, round-up visibility, '—' fallback, `aria-describedby` and tab order.
  - CI runs `npm ci`, `npm test` and `npm run build`.

## Definition of Done

- [ ] Code is merged to `main` in github.com/shindesubodh/Demo-E2E-SDLC through a pull request.
- [ ] The app is built on the starter template; the npm scripts (`dev`, `test`, `build`), `package-lock.json`, `ci.yml` and `deploy-pages.yml` are unchanged.
- [ ] There is no browser storage and no network call after load (NFR-05).
- [ ] `npm ci`, `npm test` and `npm run build` pass locally.
- [ ] The same three steps pass in GitHub Actions CI for the merge commit.
- [ ] Each acceptance criterion has at least one automated unit or integration test.
- [ ] S3: all 10 approved reference cases pass to the cent. S4: the round-up cases pass, and the S3 tests still pass.
- [ ] Every acceptance criterion is verified manually in `npm run dev`.
- [ ] Money shows as $ with 2 decimals and ',' thousands separators.
- [ ] WCAG 2.1 AA: visible labels, contrast of at least 4.5:1, full keyboard use with visible focus, and errors and results announced to screen readers.
- [ ] The layout is usable from 320 px wide to desktop.
- [ ] The `deploy-pages.yml` run for the merge succeeds.
- [ ] Acceptance criteria are re-checked at https://shindesubodh.github.io/Demo-E2E-SDLC/ in current Chrome, Safari, Firefox and Edge, and on one phone.
- [ ] Results update within 100 ms on the deployed app (checked in dev tools).
- [ ] The story status is set to "Done | Sprint 1" in the backlog and in Jira.

## Risks and assumptions

- **Rounding edge cases (risk):** half-cent and round-up boundaries could be wrong. Mitigation: integer cents only, plus tests at the limits ($0.01, $99,999.99, 0%, 100%, 1 and 50 people).
- **Reference table (risk, D-03):** if the Admin's approval of the 10-case table is late, S3 cannot be Done. Assumption: the table is approved before S3 starts. The 2-point buffer covers small changes.
- **POC scope (assumption):** the SDD's questionnaire summary mentions about 100 concurrent users and an RTO. This sprint treats the app as a demo POC with best-effort Pages hosting, no SLA, no monitoring and no load targets.
- **Manual cross-browser checks (risk, D-04):** these depend on access to four browsers and a phone. They are done once, after deploy.

## Not in this sprint

- **No Could stories exist.** The backlog has no "Backlog | Could Have" or "Backlog | Future" items, so nothing approved is deferred.
- **Out of scope per the BRD:**
  - uneven or itemised splits;
  - tax and service-charge handling;
  - other currencies;
  - saving, history or sharing;
  - other rounding modes;
  - accounts, a server or a database;
  - payments;
  - native apps or a PWA.
- Any of these would be a change request.