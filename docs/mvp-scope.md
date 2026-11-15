# MVP Scope

| Field            | Detail                        |
| ---------------- | ----------------------------- |
| Document version | 1.3.0                         |
| Creation date    | November 14, 2026             |
| Status           | In development                |
| Document owner   | Mike Armando Montano Valencia |

This document defines what the MVP application does, what it is built with, and how it evaluates the status of an indicator. Medical values are not repeated here: they live in the sheets of the Indicator Catalog (`data/`).

## Change history

| Version | Date              | Change                                                                                                                                                 |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Draft   | November 14, 2026 | Document created with the must-have and nice-to-have features and the out-of-scope items. Pending: stack and code organization, and status evaluation. |
| 1.0.0   | November 14, 2026 | First version published in the repository: features, stack and code organization, and deployment. Status evaluation (section 3) pending.               |
| 1.1.0   | November 14, 2026 | Indicators covered expanded to the ten accepted by the team, with three kinds of entries. Section 3 lists the cases these entries add.                 |
| 1.2.0   | November 14, 2026 | Section 3 written from the implemented status evaluation. Mood uses the PHQ-2. Bone density wording aligned with the NASA source.                      |
| 1.3.0   | November 15, 2026 | Radiation dose removed from the indicators covered: nine indicators, split into the six the challenge requires and the three the team added.           |

---

## 1. Features

The application is a decision-support prototype, not a medical device. It permanently displays the following notice:

> This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a medical device, does not diagnose conditions, and does not replace the flight surgeon. Demo data is synthetic.

### 1.1 Must-have

The minimum that must work in the demo. It follows from what the challenge statement requires (gathering health indicators and allowing them to be evaluated and acted on) and from the decisions in the Team Guide.

- **Indicator logging.** The astronaut manually enters an indicator, with date and time, through a form. Each field shows the unit and how to check the indicator on board, taken from its sheet. There are three kinds of entries:
  - **Measurement:** a reading taken with a device, such as blood pressure.
  - **Self-report:** an answer given in the app, such as the two PHQ-2 mood questions or a symptom checklist.
  - **Log:** an amount done toward a daily target, such as minutes of exercise.
- **Indicators covered.** Nine indicators that the astronaut can check alone, in about two minutes, with a small device or none, and with an immediate result. The selection criteria and on-board methods are in the [Research document](research.md).
  - **Required by the challenge.** The six indicators the challenge statement names:
    - **Cardiovascular:** heart rate, blood pressure.
    - **Metabolism and nutrition:** blood glucose.
    - **Immunity and temperature:** body temperature.
    - **Behavioral:** sleep hours, mood.
  - **Added by the team.** Three indicators the challenge does not name:
    - **Oxygen saturation** (cardiovascular). NASA lists a risk of hypoxia, and it is read with the same pulse oximeter as heart rate.
    - **Immune symptoms** (immunity and temperature). Immune biomarkers need lab analysis, while the symptoms reported on the ISS can be checked in seconds. It has no color rules yet, so every entry is shared with the flight surgeon.
    - **Exercise** (musculoskeletal). NASA measures bone density with scans before and after flight, so the application tracks exercise, the main countermeasure against bone and muscle loss.
- **Status per indicator.** Each indicator shows green, yellow, or red according to the rules and thresholds in its sheet. Color is accompanied by text or an icon so that status does not rely on color alone. No threshold is defined outside the sheet.
- **Overview.** One screen shows the current status of all covered indicators at a glance.
- **Indicator detail and guidance.** Presents, from the sheet: why it is measured and which spaceflight hazards affect it, how it is measured, baseline value, what the current status means, actions and countermeasures, when to contact the flight surgeon, what the crew does if there is no real-time contact, and limitations. Texts are short, free of jargon, and do not diagnose.
- **Escalation alert.** When the sheet indicates it for the current status, the application warns that the flight surgeon must be contacted and shows what to do if there is no real-time contact.
- **History and trend.** Each indicator shows a chart of its values over time, with the status of each point, so that a gradual deterioration is visible. For logs, each point is the daily total. Entries are kept when the application is reloaded.
- **Demonstration data.** The application loads the three synthetic scenarios (normal, gradual deterioration, and acute event) from `data/demo/` and allows switching between them.
- **Visible sources.** Each indicator allows consulting the sources that support its values and actions.

### 1.2 Nice-to-have

Features that add value to the demo but are not required to meet the challenge. They are implemented only at the end, and only if time remains: all must-have features are finished first.

- **Interactive human figure.** A body figure whose regions can be clicked. Each region opens the detail of the indicators related to it and shows their current status.
- **Measurement reminders.** An indicator shows when a new measurement is due or overdue, based on the interval defined in its sheet. For exercise, it reminds the astronaut to exercise and to log the minutes.
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

Implemented in `src/domain/` and `src/catalog/`. The sheet format is documented in [`data/indicator-schema.md`](../data/indicator-schema.md).

### 3.1 Loading the sheets

The sheets in `data/indicators/` are bundled at build time and checked against the schema when they load. A broken sheet (unknown color, malformed condition, missing value range, unknown source) fails the build and the tests instead of the application.

### 3.2 Value that is evaluated

| Entry                  | Indicators                                                                     | Value compared with the rules        |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| Measurement            | Heart rate, blood pressure, oxygen saturation, blood glucose, body temperature | The latest reading.                  |
| Self-report, number    | Sleep hours                                                                    | The latest answer.                   |
| Self-report, PHQ-2     | Mood                                                                           | The sum of the two answers (0 to 6). |
| Self-report, checklist | Immune symptoms                                                                | The number of symptoms checked.      |
| Log                    | Exercise                                                                       | The sum of today's entries.          |

### 3.3 Rules

Each sheet lists its rules in order. The first rule whose condition matches decides the status: its color, label, text for the astronaut, and whether to contact the flight surgeon. Color is always shown with the label or text.

### 3.4 Edge cases

- **Missing data.** With no entry (for a log, no entry today), the indicator has no color and shows the sheet's "missing" text.
- **Out-of-range value.** An entry outside the sheet's valid range (for example a blood pressure of 900) is rejected as a typing error: it is not saved and never gets a color.
- **Outdated measurement.** An entry older than the sheet's measurement interval is marked as outdated. The status is still shown, together with the outdated mark.
- **No matching rule.** When no rule matches (for example any immune symptoms entry), the indicator has no color and shows the sheet's "no reference" text, which refers the astronaut to the flight surgeon.

### 3.5 Up to date

For engagement tracking (section 1.2), an indicator is up to date while its latest entry is not outdated.

### 3.6 Who is notified

The application has no backend, so it does not send messages. When a rule calls for it, the escalation alert tells the astronaut to contact the flight surgeon and, if there is no real-time contact, to report to a Crew Medical Officer.
