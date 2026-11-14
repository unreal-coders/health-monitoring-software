# MVP Scope

| Field            | Detail                        |
| ---------------- | ----------------------------- |
| Document version | 1.0.0                         |
| Creation date    | November 14, 2026             |
| Status           | In development                |
| Document owner   | Mike Armando Montano Valencia |

This document defines what the MVP application does, what it is built with, and how it evaluates the status of an indicator. Medical values are not repeated here: they live in the sheets of the Indicator Catalog (`data/`).

## Change history

| Version | Date              | Change                                                                                                                                                 |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Draft   | November 14, 2026 | Document created with the must-have and nice-to-have features and the out-of-scope items. Pending: stack and code organization, and status evaluation. |
| 1.0.0   | November 14, 2026 | First version published in the repository: features, stack and code organization, and deployment. Status evaluation (section 3) pending.               |

---

## 1. Features

The application is a decision-support prototype, not a medical device. It permanently displays the following notice:

> This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a medical device, does not diagnose conditions, and does not replace the flight surgeon. Demo data is synthetic.

### 1.1 Must-have

The minimum that must work in the demo. It follows from what the challenge statement requires (gathering health indicators and allowing them to be evaluated and acted on) and from the decisions in the Team Guide.

- **Indicator logging.** The astronaut manually enters the value of an indicator, with date and time, through a form. Each field shows the unit and how to measure the indicator on board, taken from its sheet.
- **Indicators covered.** Blood pressure, heart rate, glucose, body temperature, hours of sleep, and mood: the indicators mentioned in the challenge statement.
- **Status per indicator.** Each indicator shows green, yellow, or red according to the rules and thresholds in its sheet. Color is accompanied by text or an icon so that status does not rely on color alone. No threshold is defined outside the sheet.
- **Overview.** One screen shows the current status of all covered indicators at a glance.
- **Indicator detail and guidance.** Presents, from the sheet: why it is measured and which spaceflight hazards affect it, how it is measured, baseline value, what the current status means, actions and countermeasures, when to contact the flight surgeon, what the crew does if there is no real-time contact, and limitations. Texts are short, free of jargon, and do not diagnose.
- **Escalation alert.** When the sheet indicates it for the current status, the application warns that the flight surgeon must be contacted and shows what to do if there is no real-time contact.
- **History and trend.** Each indicator shows a chart of its values over time, with the status of each point, so that a gradual deterioration is visible. Entries are kept when the application is reloaded.
- **Demonstration data.** The application loads the three synthetic scenarios (normal, gradual deterioration, and acute event) from `data/demo/` and allows switching between them.
- **Visible sources.** Each indicator allows consulting the sources that support its values and actions.

### 1.2 Nice-to-have

Features that add value to the demo but are not required to meet the challenge. They are implemented only at the end, and only if time remains: all must-have features are finished first.

- **Interactive human figure.** A body figure whose regions can be clicked. Each region opens the detail of the indicators related to it and shows their current status.
- **Measurement reminders.** An indicator shows when a new measurement is due or overdue, based on the interval defined in its sheet.
- **Flight surgeon report.** A summary of the current status and recent values of the indicators, ready to be copied or printed and sent to the flight surgeon.
- **Engagement tracking.** The application rewards keeping up with the measurement routine, not the values measured. It shows how many of the covered indicators are up to date, and for each indicator the number of consecutive measurements logged on time. What "on time" means is defined in the status evaluation (section 3), from the measurement interval in the indicator's sheet. Progress never depends on the status of an indicator, so nothing encourages hiding or altering a reading. It is computed from the logged entries and stores no additional data.

### 1.3 Out of scope

- Diagnosing. When no source supports an indication, the application refers the user to the flight surgeon.
- Real astronaut data. The demonstration uses synthetic data only.
- AI in status evaluation. The MVP evaluates using documented rules only.
- Real devices or camera input. Values are entered manually.
- User accounts and a backend server.
- Integration with telemedicine or ground communication systems.

### 1.4 Event constraints

Taken from the Project Submission Guide and the Judging & Awards Guide (November 13, 2026):

- The interface, texts, data, and materials linked in the submission are in English.
- The project is submitted through a public link, with no password, permissions, or registration.
- No image, video, or audio includes persons under 18 years of age.
- The use of AI tools in code and data is acknowledged in descriptive text and metadata.
- At least one NASA data set or resource is used and declared in the submission form; this is required to be eligible for a global award.

---

## 2. Stack and code organization

### 2.1 Stack

| Layer        | Choice                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| Language     | TypeScript                                                                         |
| Build and UI | Vite + React                                                                       |
| Charts       | Recharts                                                                           |
| Data         | YAML sheets from `data/`, bundled at build time and parsed with the `yaml` package |
| Persistence  | Browser `localStorage` (no backend, no accounts)                                   |
| Tests        | Vitest, for the status evaluator only                                              |
| Hosting      | Static site on GitHub Pages, deployed by GitHub Actions                            |

The application is a static single-page app. It reads the indicator sheets and the demonstration scenarios from `data/` at build time, so no server is needed and no medical value is defined in code.

### 2.2 Code organization

    src/
      main.tsx
      App.tsx
      domain/        types and status evaluation (no React, no browser APIs)
      catalog/       loads and parses the sheets and demo scenarios from data/
      storage/       saves and reads logged entries in localStorage
      screens/       Overview, IndicatorDetail
      components/    status badge, entry form, chart, guidance panel, escalation alert

Rules:

- `domain/` is pure TypeScript. It receives a sheet, entries, and the current time, and returns a status. It is the only place where status is decided.
- UI code never contains thresholds or medical text; it renders what the sheet and `domain/` provide.
- Navigation uses component state (or hash routing), not URL paths, so a reload works on static hosting.

### 2.3 Deployment

The app is built with `npm run build` and the output folder is published on GitHub Pages through a GitHub Actions workflow that runs on merge to `main`. The resulting URL is public and requires no login, as the event requires.

## 3. Status evaluation

_Pending._ Owner: José Antonio Montoya García. It must cover the edge cases: missing data, out-of-range value, and outdated measurement.
