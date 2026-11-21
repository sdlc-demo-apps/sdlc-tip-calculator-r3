# Release Notes: Tip Calculator 1.0.0

## Release

| Version | Planned deployment date | Live URL | Pull request |
|---|---|---|---|
| 1.0.0 | 2026-11-21 | https://sdlc-demo-apps.github.io/sdlc-tip-calculator-r3/ | [#1](https://github.com/sdlc-demo-apps/sdlc-tip-calculator-r3/pull/1) |

This is a proof of concept for a demo, built in Sprint 1. It is not a production system.

## What's new

**E1: Bill inputs**
- S1: Type the bill amount in dollars ($0.01–$99,999.99), with a decimal keypad on phones.
- S2: Tap 10%, 15% or 20%, or type your own tip from 0–100% (whole or one decimal).

**E2: Results and split**
- S3: Enter 1–50 people and see the tip, total and amount per person update as you type.
- S4: Switch on round-up to pay $0.50 steps per person, and see the original total, the rounded collected total and the extra tip. It is off by default.

**E3: Validation and trust**
- S5: Missing or wrong values show a message next to the field, and results show '—' instead of broken numbers.

## How it was verified

GitHub Actions ran `npm ci`, `npm test` and `npm run build` on the merge commit 6b3e8c8 of PR #1, and the run succeeded with 0 fix attempts. 134 tests in 4 files passed: unit tests for the calculation, validation and formatting modules (including 10 reference cases), and integration tests that drive the whole app with Testing Library. A named test verifies 16 of the 19 acceptance criteria; 3 are reported as Not covered. The Reviewer passed all 7 code review checks at Gate 5. The Admin's Gate 6 approval is the UAT sign-off and accepts the known issues below.

## Known issues

1. **Not covered by a named test:** the range message for a custom tip of 101, -1 or 12.55 (S2, BR-02).
2. **Not covered by a named test:** the range message for 0, 51 or 2.5 people (S3, BR-03/BR-04).
3. **Not covered by a named test:** '—' with no NaN, Infinity or negative amount when a value is invalid rather than empty (S5, BR-06).
4. **Reference table not approved:** the 10 cases in `src/lib/referenceCases.js` were drafted by the developer and still need Admin approval (D-03).
5. **Different URL:** the app runs at https://sdlc-demo-apps.github.io/sdlc-tip-calculator-r3/, not the backlog's https://shindesubodh.github.io/Demo-E2E-SDLC/. The Vite base path comes from the repo name.
6. **Manual checks open:** `npm run dev`, Chrome, Safari, Firefox, Edge and a phone, the 320 px layout, 4.5:1 contrast, and the 100 ms check on the deployed app. The 100 ms result so far comes from jsdom only.
7. **Hand-edited `package-lock.json`** to add `@testing-library/user-event`. `npm ci` succeeded in CI.
8. **npm audit** reports 5 vulnerabilities (2 moderate, 1 high, 2 critical). These have not been investigated.
9. **Text change from the mockup:** with 1 person, the hint reads "No split: 1 person pays it all."

## Dependencies and environment changes

- **Runtime:** React 18. The build uses Vite 5 (bundle 149.23 kB, 48.24 kB gzipped; CSS 5.08 kB).
- **New dev dependency:** `@testing-library/user-event` 14.6.1. The workflow files and `vite.config.js` are unchanged.
- **Browsers:** current Chrome, Safari, Firefox and Edge, mobile first, from 320 px wide. These are not yet checked manually.
- **Data:** nothing is stored. The app uses no localStorage, sessionStorage, cookies or IndexedDB, and makes no network calls after load.
- **Hosting:** static files on the GitHub Pages free tier, with best-effort availability and no SLA. There is no server, database, sign-in or secrets. Rollback means redeploying the previous commit.

## Go-live sign-off

| Role | Name | Decision | Date | Version |
|---|---|---|---|---|
| Approver (Sponsor, Product Owner) | Admin | Pending gate approval | — | 1.0.0 |

The Admin's Gate 7 approval is the go-live sign-off. Approving it deploys version 1.0.0 to GitHub Pages. The app then adds the deployment record.

## Deployment record

| Live URL | Deployed (UTC) | Workflow run | Commit | Check |
|---|---|---|---|---|
| https://sdlc-demo-apps.github.io/sdlc-tip-calculator-r3/ | 2026-11-21 12:18 | [run](https://github.com/sdlc-demo-apps/sdlc-tip-calculator-r3/actions/runs/44903143672) | `99ef327` | HTTP 200 |
