# Retrospective: Tip Calculator

## The run in numbers

| Phase | Minutes | Minutes waiting for the Admin | Cost | Automatic revisions |
|---|---|---|---|---|
| 0 Discovery | 5.8 | 3.4 | $0.00 | 0 |
| 2 Backlog & planning | 4.4 | 2.4 | $0.00 | 1 |
| 3 Solution design | 19.8 | 18.0 | $0.00 | 0 |
| 4 UI design | 10,361.3 | 1.8 | $0.00 | 1 |
| 5 Build | 14.8 | 5.0 | $1.21 | 0 |
| 6 Testing | 1.9 | 0.7 | $0.31 | 0 |
| 7 Deployment | 1.7 | 0.5 | $0.14 | 0 |
| 8 Retrospective | 0.0 (in progress) | 0.0 | $0.00 | 0 |

- **Total time:** 10,406.2 minutes (about 7.2 days). Phase 4 alone took 10,361.3 minutes, 99.6% of the total.
- **Waiting for the Admin:** 31.8 minutes in total.
- **Phase costs listed:** $1.66. **Total cost recorded:** $3.96, against a cap of $4.29 (92% used). The cap was not raised.
- **Other counts:** 11 decisions, 8 Jira issues, 26 files changed, 4 test files, 0 CI fix attempts, 0 change requests, 0 edited questionnaire answers, 0 uploads, 1 failed step.

## What went well

1. **Build passed CI first time.** CI fix attempts were 0, and the Test Report shows 134 of 134 tests passing in 4 files on merge commit 6b3e8c8.
2. **Most documents passed review on the first version.** The Charter (7/7), BRD (11/11), Architecture Questionnaire (4/4), SDD (12/12), Code (7/7) and Test Report (7/7) each had 1 version with a full first score.
3. **Deployment worked.** The Deployment record shows HTTP 200 at https://sdlc-demo-apps.github.io/sdlc-tip-calculator-r3/ on 2026-11-21 12:18 UTC, with Phase 7 taking 1.7 minutes.
4. **The run stayed under budget.** $3.96 of the $4.29 cap, with no cap raise.
5. **Admin input was light and accepted.** 0 change requests and 0 edited questionnaire answers.

## What didn't go well

1. **Phase 4 stalled for about 7.2 days.** It took 10,361.3 minutes, yet only 1.8 minutes were logged as waiting for the Admin. About 10,359 minutes are unaccounted for.
2. **One step failed:** "Claude rejected the request." The facts do not say which phase it hit.
3. **The mockup never reached a full score.** Hi-Fi Mockups went from 8/9 to 8/9 across 2 versions, so the automatic revision fixed nothing.
4. **3 of 19 acceptance criteria have no named test.** These are the S2 tip range, the S3 people range, and S5 '—' for invalid values. The PR description claimed these were tested.
5. **Design and deploy drift reached release.** The Reviewer at Gate 5 had neither the SDD nor the mockup as inputs. The Vite base path did not match the SDD, so the live URL differs from the backlog's. Manual Definition of Done checks are still open, and the PR said no browser was available.

## Root causes

- **Phase 4 time: cause not shown by the facts.** The facts show 10,361.3 minutes in Phase 4, 1.8 minutes of Admin waiting, 2 mockup versions, 1 automatic revision and 1 failed step with no phase recorded. They do not show what happened in the remaining ~10,359 minutes. Unverified hypothesis: the failed step or the mockup revision left the phase open. It is pointed to only by Phase 4 being the one phase with both a revision and the outsized time; nothing links the failed step to Phase 4. Finding the cause is an action item.
- **Failed step: cause not shown by the facts.** The only fact is the message "Claude rejected the request." No phase, step or prompt is logged, so it cannot be diagnosed. Logging these is an action item.
- **Mockup stuck at 8/9: cause not shown by the facts.** The facts give the scores (8/9 first, 8/9 final, 2 versions) but not which check failed or what the revision changed. Unverified hypothesis: the revision did not address the failing check. Finding the failed check is an action item.
- **Not covered ACs:** the Test Report states the Gate 5 Reviewer relied on the PR's AC-to-test mapping for check 2, and that 134 tests ran under 46 distinct names, so parameterised tests hid which cases exist.
- **Design drift and base path:** the Test Report states the SDD and mockup were not among the Reviewer's inputs, and that the SDD asked for base `/Demo-E2E-SDLC/` while `deploy-pages.yml` derives the base from the repo name `sdlc-tip-calculator-r3`.
- **Open manual checks:** the PR states no browser was available, and the Test Report lists these checks as not automated with no later phase running them.

## Action items

| Action | Owner | Due |
|---|---|---|
| Find out why Phase 4 was open for 10,361.3 minutes (check the run log for the failed step and the mockup revision), and add a timeout and alert for phases idle more than 60 minutes | Admin | Before the next run |
| Log the phase and step for every failed step, and retry once with a reworded prompt after a refusal | Admin | Before the next run |
| Find which Hi-Fi Mockups check failed in both versions and what the revision changed | Admin | Before the next run |
| Add the SDD and Hi-Fi mockup to the Gate 5 Reviewer's inputs | Admin | Before the next run |
| Require one named test per AC, with the AC text in the test name, and reject PR mappings without them | Developer agent | Before the next run |
| Add named tests for the 3 Not covered ACs (S2, S3, S5) to this app | Developer agent | Before the next run |
| Approve or correct the 10-case reference table (D-03) | Admin | Before the next run |
| Run the open manual checks on the live URL: 4 browsers, a phone, 320 px, 4.5:1 contrast, 100 ms | Admin | Before the next run |
| Investigate the 5 npm audit findings (2 critical) and regenerate `package-lock.json` with `npm install` | Developer agent | Before the next run |
| Make the revision prompt name the failed check | Mockup (UX Designer) agent | Before the next run |

## Process improvements for the next project

1. **Count idle time separately.** Record agent time, Admin waiting time and idle time per phase, so a gap like Phase 4's is visible during the run.
2. **SDD must not set the base path.** The Solution Architect prompt should state that the Pages URL and Vite base come from the repo name, matching `deploy-pages.yml`.
3. **Gate 5 checks test names, not claims.** The Reviewer compares each AC against the test names read from the test files, as the Test Report agent did, before passing the "each AC is tested" check.
4. **Manual DoD checks get an owner and a slot.** Add a short Admin checklist after deployment in Phase 7, with results recorded in the deployment record.
5. **Revision must change the score.** If an automatic revision leaves the review score unchanged, as with the mockup's 8/9, flag it to the Admin instead of passing it silently.
