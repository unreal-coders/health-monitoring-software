# Indicator Sheet Schema

| Field            | Detail                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| Document version | Draft                                                                         |
| Creation date    | November 14, 2026                                                             |
| Status           | Draft                                                                         |
| Written by       | Troy Leonardo Moreno Calderon, from the format of the sheets in `indicators/` |

The format of every indicator sheet in `data/indicators/`. The sheets are the single source of medical data: the application loads them to decide each indicator's status and what guidance to show, and no medical value is defined in code (see the [MVP Scope](../docs/mvp-scope.md)).

This document describes the format the indicator sheets use. Any change to it must be applied to all sheets.

## Change history

| Version | Date              | Change                                                                                                                                       |
| ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft   | November 14, 2026 | Document created from the format of the first ten indicator sheets.                                                                          |
| Draft   | November 14, 2026 | Added measurement intervals, valid input ranges, the design-decision rule, and how the flight surgeon and Crew Medical Officers are reached. |
| Draft   | November 15, 2026 | Removed the `accumulation` field, used only by the radiation dose indicator, which the team dropped.                                         |

---

## 1. Files

- One YAML file per indicator: `data/indicators/<id>.yaml`.
- `<id>` is in English, in kebab-case, with no accents or spaces, and matches the `id` field inside the file.
- Everything in the sheet is in English, including the texts for the astronaut.

---

## 2. Source rules

1. **Every statement carries a source.** Each text, value, and rule names the `id` of an entry in the sheet's `sources` list.
2. **NASA first.** Mechanism, measurement, countermeasures, and thresholds come from NASA sources whenever NASA gives them.
3. **Clinical guidelines when NASA gives no value.** The team agreed to use official clinical guidelines (for example AHA, CDC, MedlinePlus, or a validated questionnaire) only for thresholds NASA does not publish.
4. **Nothing invented.** When no source gives a value, the field is `null` and a `*_note` field says so.
5. **Project rule.** When no source supports an indication, the astronaut is referred to the flight surgeon. A sheet that uses this rule says so in its notes.
6. **Design decisions.** Only two kinds of values may be set by the team without a source: measurement intervals and input limits for catching typing errors. They are marked `basis: design` and are never medical values (thresholds, actions, or countermeasures).

---

## 3. Fields

Required fields are marked **(required)**. Optional fields appear only in the sheets that need them.

### 3.1 Identity

| Field        | Type   | Description                                                                                                                                        |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | string | **(required)** Same as the file name, without `.yaml`.                                                                                             |
| `name`       | string | **(required)** Name shown in the application.                                                                                                      |
| `domain`     | string | **(required)** One of: `Cardiovascular`, `Metabolism and nutrition`, `Musculoskeletal`, `Immunity and temperature`, `Behavioral`, `Cross-cutting`. |
| `entry_kind` | string | **(required)** `measurement` (a device reading), `self-report` (an answer in the app), or `log` (an amount done toward a daily target).            |
| `unit`       | string | **(required)** Unit of the value, or `null` when there is none (for example a checklist).                                                          |
| `input`      | string | How the astronaut enters the value: `number` (default), `checklist`, or `questionnaire`.                                                           |
| `fields`     | list   | Names of the values when an entry has more than one, for example `[systolic, diastolic]`. Without it, the entry has one `value`.                   |

### 3.2 `mechanism` (required)

Why the indicator is measured and which spaceflight hazards affect it.

| Field          | Type        | Description                                                                                 |
| -------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `summary`      | string      | **(required)** Two or three sentences.                                                      |
| `hazards`      | list        | **(required)** Hazard ids (see 3.12). Empty when no source links the indicator to a hazard. |
| `hazards_note` | string      | Required when `hazards` is empty.                                                           |
| `detail`       | list        | More facts, each with `text` and `source`.                                                  |
| `sources`      | list of ids | **(required)** Sources of the summary.                                                      |

### 3.3 `measurement` (required)

How the indicator is checked on board.

| Field             | Type           | Description                                                                                                                                                            |
| ----------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`          | string         | **(required)** What the astronaut does. `null` when no source gives a method.                                                                                          |
| `method_note`     | string         | What the sources do not cover about the method.                                                                                                                        |
| `sources`         | list of ids    | **(required)** Sources of the method. Empty when there is none.                                                                                                        |
| `interval`        | string or null | **(required)** How often to measure, as a number and `hour`, `hours`, `day`, or `days`, for example `1 day` or `14 days`. An entry older than this is marked outdated. |
| `interval_basis`  | string         | **(required)** `source` (a source gives it), `definition` (it follows from what is measured), or `design` (the team chose it; see rule 6).                             |
| `interval_source` | id             | Required when `interval_basis` is `source`.                                                                                                                            |
| `interval_note`   | string         | **(required)** Where the interval comes from.                                                                                                                          |

### 3.3.1 `valid_range`

The values an entry can have. An entry outside this range is rejected as a typing error and never gets a color. Required for every indicator with `input: number` (the default); a checklist or a questionnaire is already limited by its items and scores.

One entry per value name (`value`, or each name in `fields`), each with:

| Field   | Type           | Description                                                                                        |
| ------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `min`   | number         | **(required)** Lowest accepted value.                                                              |
| `max`   | number or null | **(required)** Highest accepted value, or `null` when there is no upper limit.                     |
| `basis` | string         | **(required)** `definition` (for example a percentage cannot exceed 100) or `design` (see rule 6). |
| `note`  | string         | **(required)** Why the range is what it is.                                                        |

### 3.4 Input details (only for some entry kinds)

| Field           | Used by         | Description                                                                                                                                                                                         |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checklist`     | `checklist`     | List of items, each with `id`, `label`, and `source`.                                                                                                                                               |
| `questionnaire` | `questionnaire` | `prompt`, `items` (each with `id` and `text`), `options` (each with `label` and `score`), `score` (how to combine answers, e.g. `sum`), `source`, and `permission` (the instrument's terms of use). |
| `daily_target`  | `log`           | `value`, `unit`, `text`, and `source`. The daily amount the log is compared with.                                                                                                                   |

### 3.5 `baseline` (required)

| Field    | Type           | Description                                                                                                              |
| -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `value`  | number or null | **(required)** Reference value, or `null`.                                                                               |
| `type`   | string or null | **(required)** `earth-reference` (a general value from Earth) or `flight-specific` (a value for spaceflight), or `null`. |
| `note`   | string         | **(required)** Where the value comes from, or that no source gives one.                                                  |
| `source` | id             | Required when `value` is not `null`.                                                                                     |

### 3.6 `thresholds` (required)

How the status (color) is decided.

| Field        | Type        | Description                                                                                                        |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `evaluation` | string      | **(required)** Always `first-match`: rules are checked in order and the first one that matches decides the status. |
| `applies_to` | string      | Conditions the rules assume, for example "Fasting blood sugar, measured after an overnight fast."                  |
| `rules`      | list        | **(required)** The rules (see below). Empty when no source gives any.                                              |
| `note`       | string      | **(required)** Where the rules come from, and anything they do not cover.                                          |
| `sources`    | list of ids | **(required)** Sources of the rules.                                                                               |

Each rule:

| Field                    | Type                              | Description                                                                                      |
| ------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `color`                  | `green`, `yellow`, or `red`       | **(required)** Status shown with text or an icon, never color alone.                             |
| `label`                  | string                            | **(required)** Name of the category, as the source calls it when possible.                       |
| `when`                   | string                            | **(required)** Condition (see the grammar below).                                                |
| `text`                   | string                            | **(required)** What the astronaut reads for this status.                                         |
| `contact_flight_surgeon` | `true`, `false`, or `if-symptoms` | **(required)** Whether the escalation alert is shown. `if-symptoms` shows it only with symptoms. |
| `source`                 | id or list of ids                 | **(required)**                                                                                   |

**Grammar of `when`.** A comparison of a value with a number, joined with `and` or `or`:

- Values: `value`, or the names in `fields` (for example `systolic`).
- Operators: `<`, `<=`, `>`, `>=`.
- Example: `"systolic > 180 or diastolic > 120"`.

For a `log`, `value` is the sum of the day's entries.

**When no rule matches**, the indicator has no color and shows `astronaut_text.no_reference`.

### 3.7 `reference_values`

Other source values that inform the indicator but do not decide its color, each with `text` and `source`.

### 3.8 `profile_factors`

Whether the thresholds depend on the astronaut's age or sex: `age_and_sex` (`true` or `false`), `note`, and `source`. Only present when a source states it. In the current sheets, no source gives different thresholds by age or sex.

### 3.9 `countermeasures` (required)

List of actions that prevent or reduce the problem, each with `text` and `source`. When there are none, the list is empty and `countermeasures_note` says so.

### 3.10 `flight_surgeon` (required)

| Field                     | Type        | Description                                                        |
| ------------------------- | ----------- | ------------------------------------------------------------------ |
| `when_to_contact`         | string      | **(required)** Summary of the rules with `contact_flight_surgeon`. |
| `if_no_real_time_contact` | string      | **(required)** What the crew does without real-time contact.       |
| `sources`                 | list of ids | **(required)**                                                     |

### 3.11 `astronaut_text` (required)

Texts the application shows outside the rules. Every text follows the writing rules in section 4.

| Key            | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `missing`      | **(required)** No entry yet.                                                  |
| `no_contact`   | **(required)** What to do if the flight surgeon cannot be reached.            |
| `no_reference` | Shown when no rule matches. Required when the rules do not cover every value. |
| `how_to`       | Short instruction shown with the entry form.                                  |
| `reminder`     | Reminder for a `log`.                                                         |
| `progress`     | Progress for a `log`. `{done}` and `{target}` are replaced with numbers.      |

### 3.12 Hazard ids

`space-radiation`, `isolation-and-confinement`, `distance-from-earth`, `gravity-fields`, `hostile-closed-environments`.

### 3.13 `limitations`, `sources`, `author`, `reviewer` (required)

| Field         | Type   | Description                                                                                                    |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `limitations` | list   | **(required)** What the sheet does not cover, including whether values differ by age or sex.                   |
| `sources`     | list   | **(required)** Each with `id`, `title`, `publisher`, `url`, and optionally `locator` (section or requirement). |
| `author`      | string | **(required)** Who wrote the sheet.                                                                            |
| `reviewer`    | string | **(required)** Who reviewed it, or `null` until reviewed.                                                      |

---

## 4. Writing rules for the astronaut texts

From the project principles in the README:

- Short sentences, without jargon.
- Texts do not diagnose. A reading is described as "in the range of", never as a disease the astronaut has.
- When no source supports an indication, the text refers the astronaut to the flight surgeon.

---

## 5. Who is notified

The application has no backend (MVP Scope 1.3), so it cannot send a message to anyone. When a rule has `contact_flight_surgeon: true`, the application shows the escalation alert to the astronaut, who contacts the flight surgeon. NASA-STD-3001 puts in-mission medical care under the flight surgeon ([V1 3004]).

When there is no real-time contact, the alert shows `astronaut_text.no_contact`: the astronaut reports to a Crew Medical Officer. NASA-STD-3001 requires at least two crewmembers per vehicle trained as Crew Medical Officers, the medical experts for the mission ([V1 3006], [V1 5003]).

---

## 6. Open items

- **Immune symptoms.** No source was found to turn symptoms into a status, so the sheet has no rules and every entry is shared with the flight surgeon.
