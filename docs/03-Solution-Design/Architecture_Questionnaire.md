# Architecture Questionnaire: Tip Calculator

## Answers

| # | Category | Key questions | Answer for this project | Source |
|---|---|---|---|---|
| 1 | Application Nature | POC vs production? Lifespan? Multi-tenant? White-labelled? | A small production demo app built in one sprint, with no planned end date. Single-tenant, not white-labelled; one public static site. | BRD, Assumption |
| 2 | Users & Scale | Concurrent users at peak? Total users in 12 months? Geography? Devices? Browsers? | Diners splitting a bill (P1, P2), mostly on phones, also desktop, from 320 px wide. Current Chrome, Safari, Firefox and Edge. Up to about 100 concurrent and 5,000 total users in 12 months, mainly in the US (USD only). | BRD, Assumption |
| 3 | Availability & Reliability | Uptime SLA? RTO? RPO? Peak usage windows? | No formal SLA; we rely on GitHub Pages availability. RTO is one redeploy (about 10 minutes); RPO does not apply because no data is stored. Peak use is at meal times. | Assumption |
| 4 | Performance | Acceptable page load time? Response time? Real-time vs batch? | Results update within 100 ms of any input change on a mid-range phone; all calculation is real-time in the browser. First load under 2 s on 4G, with a bundle under 200 KB gzipped. | BRD (NFR-02), Assumption |
| 5 | Security & Compliance | GDPR / other regulation? Auth required? Data residency? PII handling? | No sign-in, no PII and no storage (no localStorage, sessionStorage, cookies or IndexedDB). No network calls after load, so bill data never leaves the browser. Must meet WCAG 2.1 AA. | BRD (NFR-03, NFR-05) |
| 6 | AI & Model Constraints | AI used in the product? Provider? Can data go to external APIs? | Not applicable: the app is static and has no AI features. No data goes to external APIs. | BRD |
| 7 | Integration Landscape | Existing systems to integrate? APIs available? Identity provider? | None. There are no payment, identity or third-party APIs; payment integration is out of scope. | BRD |
| 8 | Infrastructure & Deployment | Cloud/hosting mandate? CI/CD in place? | GitHub Pages at https://shindesubodh.github.io/Demo-E2E-SDLC/. The starter template provides `ci.yml` (`npm ci`, `npm test`, `npm run build`) and `deploy-pages.yml` (deploys `dist/` on merge to main). | Backlog, BRD (NFR-07) |
| 9 | Team & Operations | Team size and skills? Who owns operations? Monitoring? | One React developer; the Admin owns the repo, deployments and gate approvals. Monitoring is the CI and deploy run status only; there is no analytics or error tracking. | Backlog, Assumption |
| 10 | Budget & Timeline | Infrastructure budget? Open-source only? Hard deadline? Phased delivery? | Zero infrastructure budget (free GitHub Pages and Actions), open-source dependencies only. Sprint 1 (about 5 days, 16 of 18 points), deployed by its end; no phased delivery. Stack: React 18 hooks, a pure integer-cents `calc.js` module and plain CSS with custom properties. | Backlog, Tech stack choice, Assumption |

## Assumptions

- **Q1 lifespan and tenancy:** The BRD names no end date or customers. A single public static site is the simplest fit.
- **Q2 user numbers and geography:** No figures were given. USD-only formatting suggests US users. Static hosting handles far higher load, so the estimate does not affect the design.
- **Q3 SLA, RTO and RPO:** A free demo app has no contractual uptime. With no stored data, recovery is just a redeploy.
- **Q4 load time and bundle size:** The BRD sets only the 100 ms update target. A 2 s first load is a common mobile target, and React plus a small app fits well under 200 KB.
- **Q9 monitoring:** With no backend and no data collection (NFR-05), CI and deploy status are the only practical signals. Adding analytics would conflict with privacy.
- **Q10 budget:** The template already uses free GitHub services, and the BRD lists no paid tools.

## Implications for the design

- Keep the app static and fully client-side, with no server, API, storage or post-load network calls. The "API contracts" become the `calc.js` module interface, and there is no storage contract (Q5, Q7, Q8).
- Do all money maths in integer cents in a pure `calc.js`, rounding half up, so results are exact to the cent. Unit tests cover the 10-case reference table (Q4, Q10).
- Derive results on each render from `useState` inputs, with no debounce or effects. This keeps updates well under 100 ms (Q4, Q10).
- Build mobile-first from 320 px with accessible markup:
  - visible labels;
  - `aria-pressed` on the presets;
  - `aria-describedby` linking each error to its field;
  - a live region for results;
  - contrast of at least 4.5:1 (Q2, Q5).
- Keep the starter template's npm scripts, `package-lock.json`, `ci.yml` and `deploy-pages.yml` unchanged, and set the Vite `base` to `/Demo-E2E-SDLC/` (Q8).
- Add no new runtime dependencies beyond React 18. Use plain CSS custom properties for design tokens (Q9, Q10).
- Add no analytics, cookies or third-party fonts or scripts (Q5, Q9).

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor, Product Owner) | Admin | Pending gate approval | — |

Status: **Pending gate approval** (Phase 3 gate: SDD sign-off).
