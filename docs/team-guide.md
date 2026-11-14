# Team Guide

| Field              | Detail                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Team               | Unreal Coders (6 members, UABC Ensenada)                                                   |
| Event              | NASA Space Apps Challenge 2026, _Health Monitoring Software_ challenge                     |
| Official statement | https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details |
| Document version   | 1.1.0                                                                                      |
| Creation date      | November 2, 2026                                                                           |
| Status             | Published                                                                                  |
| Document owner     | Mike Armando Montano Valencia                                                              |

This document defines how the team works, what is built, and who is responsible for each piece. It is the only place where team decisions are recorded.

## Change history

| Version | Date              | Change                                                                                                        |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Draft   | November 2, 2026  | Document created.                                                                                             |
| 1.0.0   | November 4, 2026  | First version published in the repository, with the adjustments after the November 3 meeting.                 |
| 1.1.0   | November 14, 2026 | Translated to English to meet the event's language requirement. Documents and paths renamed to English names. |

---

## 1. Team and roles

Each member has two responsibilities:

- **Research:** a domain and the indicators or topics it covers. The result is their Catalog sheets (in Troy's case, the Research document).
- **Project role:** what they do besides researching, that is, the documents and pieces they are responsible for.

| Name                          | Research: domain         | Research: indicators or topics                                                                                                                                                | Project role                                                                                                              |
| ----------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mike Armando Montano Valencia | Cardiovascular           | Blood pressure, heart rate                                                                                                                                                    | Coordinates the team, writes the MVP Scope (features)                                                                     |
| José Antonio Montoya García   | Metabolism and nutrition | Glucose, nutrition                                                                                                                                                            | Defines the Catalog schema (statuses, writing rules, and source format) and writes the status evaluation of the MVP Scope |
| José Pablo Rovera Nava        | Musculoskeletal          | Bone density, muscle                                                                                                                                                          | Code base project; stack and code organization of the MVP Scope                                                           |
| Mextli Citlal Perez Aguirre   | Immunity and temperature | Body temperature, immune signals                                                                                                                                              | Demonstration data and video                                                                                              |
| Kenan Rojas Arroyo            | Behavioral               | Sleep, mood                                                                                                                                                                   | UX/UI: Interface design                                                                                                   |
| Troy Leonardo Moreno Calderon | Cross-cutting            | The five spaceflight hazards (radiation, isolation and confinement, distance from Earth, gravity fields, and hostile closed environments), on-board measurement, environments | Writes the README, the project description, the submission checklist, and the pitch script with the slides                |

---

## 2. Document map

| Document          | Purpose                                                                                                          | Owner        | Collaborators                                                                                           | Location                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- | --------------------------- |
| Team Guide        | Working rules, schedule, allocation, decisions                                                                   | Mike         | —                                                                                                       | `docs/team-guide.md`        |
| Research          | Knowledge cross-cutting to all indicators: spaceflight hazards and on-board measurement                          | Troy         | —                                                                                                       | `docs/research.md`          |
| Indicator Catalog | One YAML sheet per indicator (research, thresholds, actions, and texts for the astronaut) and demonstration data | José Antonio | Mike, José Pablo, Mextli, and Kenan (each the sheets of their domain); Mextli (demonstration data)      | `data/`                     |
| MVP Scope         | What the application does, what it is built with, and how it evaluates statuses                                  | Mike         | José Antonio (status evaluation); José Pablo (stack and code organization)                              | `docs/mvp-scope.md`         |
| Interface design  | Flows, visual guide, final design, and prototype                                                                 | Kenan        | —                                                                                                       | Figma (link in `README.md`) |
| Submission        | Submission checklist, project description, pitch script, and demo                                                | Troy         | Mextli (demo video or screenshots); Everyone (sources of their domain in the README and demo rehearsal) | `docs/submission/`          |

### Content by document

**Research.** The five spaceflight hazards and their effect on each body system, including what distance from Earth implies for medical care (communication delay and crew autonomy); on-board measurement, with methods, devices, and constraints. What is specific to each indicator is not repeated here: it lives in the sheet.

**Catalog.** Sheet schema, which includes the meaning of each status (green, yellow, red) and who is notified in each, the citation format, and the writing rules for the texts for the astronaut (short sentences, no jargon, no diagnosing, and referring to the flight surgeon when there is no source); one sheet per indicator and synthetic data with three scenarios (normal, gradual deterioration, acute event). Each sheet includes mechanism (why the indicator is measured and which spaceflight hazards affect it), measurement method, baseline value with its type (Earth reference or flight-specific), thresholds per status, actions, countermeasures, when to contact the flight surgeon and what the crew does if there is no real-time contact, texts for the astronaut, limitations, full sources, author, and reviewer.

**MVP Scope.** One to two pages with three parts: the application's features as must-have, nice-to-have, and out of scope, based on what is mandatory and optional in the challenge statement and with the notice that it is a decision-support prototype and not a medical device; the stack and code organization; and how the application evaluates the status of an indicator from its sheet, with the edge cases (missing data, out-of-range value, outdated measurement).

**Interface design.** Four pages: user flows, visual guide with components (e.g. accessible status palette, typography, indicator card, traffic light, chart, guidance panel, entry form, escalation alert), and final design with prototype.

**Submission.** Submission requirements checklist, project description, and pitch and demo script with a backup plan.

### Dependency order

`Catalog` (schema) → `Catalog` sheets and `Research` in parallel → `MVP Scope` → `Interface design` and demonstration data in parallel → code → `Submission`.

---

## 3. Repository structure

```
README.md
CONTRIBUTING.md
docs/
  team-guide.md
  research.md
  mvp-scope.md
  repository-config.md
  submission/
data/
  indicator-schema.md
  indicators/         (one YAML file per indicator)
  demo/
src/
```

---

## 4. Schedule

| Date               | Milestone                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nov 3              | Agreement meeting, allocation, and creation of org and repo                                                                                               |
| Nov 4              | Sheet schema ready                                                                                                                                        |
| Nov 4–8            | Research and sheets by domain                                                                                                                             |
| Nov 9–13           | MVP Scope (decision and writing), interface design, and demonstration data                                                                                |
| Nov 13             | The Resources and the Project Submission and Judging & Awards guides are published; Troy closes the submission checklist; everyone adjusts their own part |
| Nov 14–15          | Event: build, pitch, and submission                                                                                                                       |
| Nov 15, 11:59 p.m. | Submission closes, local time (opens Saturday the 14th at 9:00 a.m.)                                                                                      |
| Nov 16             | Evaluation begins                                                                                                                                         |

---

## 5. Task allocation

**Phase 0 · Kickoff (Nov 3–4)**

| Deliverable                                                                              | Document   | Owner        |
| ---------------------------------------------------------------------------------------- | ---------- | ------------ |
| Create org, repo, structure, and board                                                   | Team Guide | Mike         |
| Define the sheet schema and validate it with a real sheet before allocating the research | Catalog    | José Antonio |

**Phase 1 · Research (Nov 4–8)**

| Deliverable                                         | Document | Owner                                             |
| --------------------------------------------------- | -------- | ------------------------------------------------- |
| Sheets of each domain's indicators                  | Catalog  | Mike, José Antonio, José Pablo, Mextli, and Kenan |
| Spaceflight hazards and effect by system            | Research | Troy                                              |
| On-board measurement: methods, devices, constraints | Research | Troy                                              |

**Phase 2 · Definition and design (Nov 9–13)**

| Deliverable                                                                                                                   | Document           | Owner                          |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------ |
| Decide the MVP scope                                                                                                          | MVP Scope          | Everyone, by agreement or vote |
| Write the features and the medical notice                                                                                     | MVP Scope          | Mike                           |
| Write the status evaluation                                                                                                   | MVP Scope          | José Antonio                   |
| Write the stack and code organization                                                                                         | MVP Scope          | José Pablo                     |
| Flows, visual guide, final design, and prototype                                                                              | Interface design   | Kenan                          |
| Synthetic demonstration data                                                                                                  | Catalog            | Mextli                         |
| Code base project (initial structure with no functionality: framework, dependencies, and folders; subject to the event rules) | `src/`             | José Pablo                     |
| Submission requirements checklist (draft; closed on Nov 13 with the Project Submission guide)                                 | Submission         | Troy                           |
| Review the Resources and the Project Submission guide, and adjust one's own part (Nov 13)                                     | Affected documents | Everyone                       |

**Phase 3 · Event and submission (Nov 14–15)**

| Deliverable                                                        | Document   | Owner         |
| ------------------------------------------------------------------ | ---------- | ------------- |
| Implementation according to the MVP Scope and the interface design | `src/`     | To be defined |
| Pitch script and slides                                            | Submission | Troy          |
| Demo video or screenshots                                          | Submission | Mextli        |
| Final README and project description                               | Submission | Troy          |
| Sources of each domain in the README (each their own)              | Submission | Everyone      |
| Demo rehearsal                                                     | Submission | Everyone      |

---

## 6. Working rules

1. Each document has a single owner, who is responsible for the whole document. There can be several collaborators, who write the parts assigned to them (see Document map). Everyone contributes through pull requests.
2. Every change enters through a pull request with at least one review. Commits, branches, pull requests, and the workflow follow `CONTRIBUTING.md`.
3. Medical values (ranges, thresholds, actions) exist in a single place: the indicator sheet. Research, the MVP Scope, and the interface reference them and do not copy them.
4. Every medical value carries a source.
5. Each owner verifies the cross-references of their document against the actual content before considering it finished.
6. File names are in English and contain no accents or spaces.
7. A task is considered finished when it is in the repository, has been reviewed by another person, and has no unsourced values. A finished task can be reopened to update it.
8. A blocker is communicated in the team channel the same day.
9. Every update to a `docs/` document bumps its version and is recorded in its change history, using the format in the "Project conventions" section of `CONTRIBUTING.md`. Exception: `repository-config.md`, which is a reusable template across projects and carries no data table or history.

---

## 7. Team decisions

| Decision                                                                                                                                                | Reason                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A single repository inside a GitHub org                                                                                                                 | Keep documentation and code in one place                                                                                                                                                                             |
| Documentation in Markdown inside the repository, design in Figma                                                                                        | Versioning and review by pull request                                                                                                                                                                                |
| MVP based on documented rules and thresholds, with AI as an optional layer                                                                              | Traceable to sources and simpler to defend                                                                                                                                                                           |
| One YAML sheet per indicator as the single source of medical data                                                                                       | Avoids copies and desynchronization                                                                                                                                                                                  |
| Demonstration data is synthetic                                                                                                                         | No real individual data is available (pending verification)                                                                                                                                                          |
| Each member integrates their own work into the documents; there are no consolidation or approval roles apart from the pull request review               | Avoids overload and dependencies between people                                                                                                                                                                      |
| Requirements and technical design are written in a single lightweight document, the MVP Scope, without requirement identifiers or a traceability matrix | Reduces the documentation load to spend the time on sheets, design, and implementation                                                                                                                               |
| The meaning of the statuses, the source format, and the writing rules are defined once in the sheet schema, before researching                          | Consistent sheets without later review                                                                                                                                                                               |
| The whole repository is in English: documentation, `data/` files, code, and the application, including the texts for the astronaut                      | The event requires the submission and any linked material to be in English. The users are crews that operate in English, and the application loads the `data/` files, so the interface and the data stay consistent. |
