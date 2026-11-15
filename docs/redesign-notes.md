# Front-end Redesign Notes

| Field  | Detail                                                       |
| ------ | ------------------------------------------------------------ |
| Branch | `feat/redesign` (local, not pushed)                          |
| Spec   | Team redesign spec (kept outside the repository)             |
| Date   | November 14, 2026                                            |
| Status | Approved by the team; in review as a pull request            |

This document summarizes the front-end redesign, what was checked, and what the team still has to decide. The redesign follows the spec's NASA Web Design System–inspired look: dark navy surfaces, 2px corners, 1px rules, mono telemetry labels, and status shown by color, icon, and text together.

---

## 1. What changed, screen by screen

### Every screen

- **Design tokens** (`src/index.css`): new colors, Inter / Public Sans / DM Mono, spacing scale, 2px radius, global button, label, alert, and focus styles (3px outline).
- **Starfield** (`components/Starfield.tsx`): fixed-seed stars and shooting stars behind every screen. No meteors and no twinkling with `prefers-reduced-motion`.
- **Disclaimer footer** (`components/Disclaimer.tsx`): sticky at the bottom of every screen. First line is the exact MVP Scope text; a smaller second line adds "Unofficial interface inspired by the NASA Web Design System. Not affiliated with NASA."
- **Status badge** (`components/StatusBadge.tsx`): outlined tag with an SVG icon and a word (Normal, Caution, Critical, No data, No reference), plus an `OUTDATED` tag when the last reading is older than the sheet's interval.

### Profile selection (new: `screens/ProfilePicker.tsx`)

- "Who's checking in?" with one card per crew profile and an "Add crew member" card.
- Cards show call sign, avatar, name, and role. They show **no status** (option A, see section 3).
- Picking a profile makes it active and opens the dashboard.

### Create crew profile (new: `screens/ProfileSetup.tsx`)

- Full name, date of birth with computed read-only age, crew role, call sign (max 6, initials when empty), and four avatars.
- Validation on submit: empty name, missing date, future date, and age outside 18–80, each shown under its field with `aria-invalid`; focus moves to the first invalid field.
- Live preview of the card and a "Profile created" confirmation.

### Dashboard (`screens/Dashboard.tsx`)

- Header with "Biometric link: simulated", the demo scenario selector (Normal / Gradual change / Acute event), **Register** (opens the detail at the form), and **Charts** (opens the detail at the chart).
- **Status wheel** (`components/RadialHealth.tsx`): nine segments colored **only** by each indicator's status kind, never by domain. The center shows the overall status. On small screens the wheel keeps only the status symbols.
- Keyboard chips under the wheel and a card for the selected indicator with the sheet's rule label, value, and text.
- **Status panel**: overall badge, the indicators to review (critical first), and a contact box only when something is critical.
- **Space garden** (`components/SpacePlant.tsx`): five growth stages by total readings (Seed, Sprout, Seedling, Young plant, In bloom), level equal to stage, progress to the next stage, and the logging streak from `streakDays()`.
- "Clear all readings" asks for confirmation on the page.
- Each indicator is evaluated on its own (`screens/safeStatus.ts`): if `evaluateStatus()` throws, that indicator shows "No reference" and the rest of the screen keeps working.

### Indicator detail (`screens/IndicatorDetail.tsx`)

- Header with domain, name, current value and unit, large status badge, and the sheet's rule label.
- Escalation alert whose tone follows the status: critical (red), caution (yellow, including `if-symptoms`), or neutral (no reference).
- **History**: 7 days / 14 days / All, a Recharts line where each point shows its status by **color and shape** (circle normal, diamond caution, square critical, hollow circle no status), a legend, and the latest readings with their status tags. Blood pressure is labeled "Systolic". No reference bands.
- **Guidance** accordion with the first section open: why we measure it (with hazard tags), how to measure on board, what to do now, when to contact the flight surgeon, if there is no real-time contact, countermeasures, limitations, and sources.
- **Log a reading**: date and time, the unit inside the input, the sheet's "How to measure" box, and a "Reading saved" confirmation.
- **What the status means**: every rule of the sheet with icon and label; the current one is marked.

### Demo scenarios (`screens/quickScenarios.ts`)

- Each scenario now generates seven days of readings (63 entries) and includes exercise.
- Gradual change moves one step a day from normal to the last day; Acute event has six normal days and the event on the last day.

---

## 2. Unchanged folders

These folders have **no changes** on this branch (`git diff main..feat/redesign -- src/domain src/catalog src/storage data` is empty):

- `src/domain/`
- `src/catalog/`
- `src/storage/`
- `data/` (indicator sheets and demo folder)

Every medical value and text still comes from the sheets through `domain/`.

---

## 3. Pending items for the team

1. **Blood glucose sheet gap.** The green rule is `value >= 70 and value <= 99` and prediabetes starts at `value >= 100`, so a value such as 99.5 matches no rule. The sheet has no `no_reference` text, so `evaluateStatus()` throws. The front end now catches this and shows "No reference", but the sheet should be fixed (for example `value < 100` in the green rule). The form accepts decimals.
2. **Immune symptoms has no rules** (`rules: []`). It always shows "No reference" and the neutral "Contact the flight surgeon" box, even in the Normal scenario.
3. **Two "no real-time contact" texts.** The escalation alert uses `astronaut_text.no_contact`; the guidance accordion uses `flight_surgeon.if_no_real_time_contact`. Both come from the sheet, but the team should confirm this is intended.
4. **`plantGrowth()` is unused.** `domain/health.ts` still exports it; the garden now grows by total readings as the spec asks.
5. **Profiles share one set of readings (option A).** Switching profiles does not switch data. Separating entries per profile (option B) needs a small change in `storage/` and team approval.
6. **New disclaimer line.** The footer adds "Unofficial interface inspired by the NASA Web Design System. Not affiliated with NASA." The MVP Scope (section 1) still quotes only the original text and should be updated.
7. **Unused files.** `components/Modal.tsx`, `components/MetricDetail.tsx`, `components/IndicatorCard.tsx`, and `screens/Overview.tsx` are no longer used by any screen. Old MetricDetail styles remain in `screens/dashboard.css`.
8. **Texts written in the UI, not in a sheet.** They name no medical value, but the team should approve them: "Contact the flight surgeon. Share the flagged readings." (status panel), "Your plant is asking for attention. Contact the flight surgeon." (garden), the fallback "This reading could not be evaluated. Share it with the flight surgeon." (`safeStatus.ts`, used only when a sheet has no `no_reference` text), and "Symptoms you have now" (checklist legend).
9. **Demo data.** `data/demo/` is still empty; the scenarios live in `screens/quickScenarios.ts`. Exercise values (95, 60, and 20 minutes) were added because the scenarios had none.
10. **Spec kept local.** The redesign spec was written in Spanish, so it is not in the repository (English-only rule). The team keeps it outside git.
11. **Fonts load from Google Fonts.** Without internet the app falls back to system fonts.

---

## 4. Checklist (spec section 7)

Checked with a headless browser at 320, 375, 768, and 1280 px, all three scenarios, every indicator's detail screen, and a static scan of the code.

| Check                                                    | Result | Notes                                                                                                                       |
| -------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| No loose hex colors in `components/` and `screens/`      | Pass   | Only `var(--...)`. The meteor white is the token `--color-meteor`.                                                          |
| No hardcoded medical text or value                       | Pass   | All from the sheet or `StatusResult`. See pending item 8 for UI texts.                                                      |
| Every status has icon + text; chart points change shape  | Pass   |                                                                                                                             |
| Disclaimer visible on every screen                       | Pass   | Fixed during review: a layout rule had turned the sticky footer (and the sticky top nav) into normal flow.                  |
| All UI in English                                        | Pass   |                                                                                                                             |
| No URL routes; reload works on GitHub Pages              | Pass   | Navigation is React state; reload stays on `/`.                                                                             |
| No meteors or animations with reduced motion             | Pass   | Meteors hidden, twinkle and plant growth off; on with no preference.                                                        |
| Keyboard navigation and visible focus                    | Pass   | Tab walk: profiles 5 stops, setup 11, dashboard 30, detail 22, all with a visible outline. Wheel segments are pointer-only; the chips are the keyboard path. |
| Looks right at 320, 768, and 1280 px                     | Pass   | No horizontal overflow at 320, 375, 768, or 1280 px on any screen.                                                          |
| The three demo scenarios work                            | Pass   | Normal: all green except immune symptoms. Gradual change: 5 in caution. Acute event: 3 critical, 5 caution.                 |
| `npm run build` without TypeScript errors                | Pass   | Tests: 62 passed (55 existing + 7 for the profile store). `oxlint`: no warnings. No runtime errors during the walk-through. |

---

## 5. Pull request draft

**Title:** `feat(ui): redesign the front end with the status wheel, detail screen, and crew profiles`

**Body:**

> ## Summary
>
> Redesigns the front end following the team's redesign spec: a dark, NASA Web Design System–inspired look; a status wheel on the dashboard; a rebuilt indicator detail screen; a space garden with growth stages; and crew profile selection and setup.
>
> ## What changed
>
> - **Design system:** new tokens, fonts, sticky disclaimer footer with an added attribution line, and a starfield background that respects reduced motion.
> - **Dashboard:** nine-segment wheel colored only by status kind, keyboard chips, selected indicator card, status panel with a review list, demo scenario selector, and confirmation before clearing readings.
> - **Indicator detail:** escalation alert by status tone, history chart with status shown by color and shape, latest readings, guidance accordion, entry form with the unit inside the input, and every rule of the sheet.
> - **Space garden:** five stages by total readings with progress and the logging streak.
> - **Crew profiles (option A):** new `src/profiles/profileStore.ts` with four synthetic demo profiles, a picker, and a validated setup form. Readings stay shared across profiles.
> - **Demo scenarios:** seven days of readings per scenario, now including exercise.
> - **Robustness:** a value no rule covers shows "No reference" for that indicator instead of breaking the screen.
>
> `src/domain/`, `src/catalog/`, `src/storage/`, and `data/` are unchanged. Every medical value and text still comes from the indicator sheets.
>
> ## Testing
>
> - `npm run build`, `npm test` (62 passed), and `oxlint` with no warnings.
> - Walked through every screen, all three scenarios, and every indicator at 320, 375, 768, and 1280 px: no horizontal overflow, disclaimer always visible, no runtime errors.
> - Keyboard-only walk through every screen with a visible focus outline at every stop.
> - Reduced motion: no meteors or animations.
>
> ## Pending for the team
>
> See section 3 of `docs/redesign-notes.md`: the blood glucose sheet gap at 99.5, immune symptoms without rules, the two "no contact" texts, `plantGrowth()` unused, shared readings across profiles, the MVP Scope disclaimer text, and unused components.
>
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
