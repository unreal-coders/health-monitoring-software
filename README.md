# Unreal Coders · Health Monitoring Software

Unreal Coders is the team of six Software Engineering and Emerging Technologies students at UABC Ensenada taking part in the NASA Space Apps Challenge 2026 with the [Health Monitoring Software](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details) challenge. The project is a visual tool that helps an astronaut log their health indicators, interpret their status, and know what to do when something falls outside the normal range. It does not replace the flight surgeon or diagnose; its value is giving the crew a clear, source-traceable guide for assessing their own health during the mission.

---

## The challenge

On long-duration missions, the crew is exposed to the five hazards of spaceflight identified by NASA's Human Research Program: space radiation, isolation and confinement, distance from Earth, gravity fields, and hostile closed environments. These hazards can cause immune changes, bone loss, cardiovascular events, inadequate nutrition, and behavioral health problems.

The farther and longer the mission, the more of the work of detecting those changes falls on the astronaut. The challenge asks for a tool that gathers health indicators and allows them to be evaluated and acted on, without assuming that the person using it knows how to assess their health.

Our proposal rests on the following:

### Indicator catalog as the single source of medical data

Each indicator has its own sheet where everything clinical lives: why it is measured, how it is measured on board, baseline value, thresholds per status, actions, countermeasures, limitations, and sources. The interface and the documentation reference those sheets and do not copy their values, so there is no data that can fall out of sync.

### Evaluation based on documented rules

The status of an indicator (green, yellow, or red) is determined by rules and thresholds taken from its sheet, not by a black box. Every medical value carries a source, so any result can be traced and defended. AI remains an optional layer.

### Guidance for the astronaut, without diagnosing

The texts the astronaut sees use short sentences without jargon and do not diagnose. When no source supports an indication, they refer to the flight surgeon. Each sheet states when to contact the flight surgeon and what the crew does if there is no real-time communication, which matters because of the distance from Earth.

### Synthetic demonstration data

Since no real individual data is available, the demo uses synthetic data with three scenarios: normal, gradual deterioration, and acute event.

The exact MVP features are defined in the MVP Scope (_pending_).

---

## Indicators by domain

| Domain                   | Indicators or topics                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Cardiovascular           | Blood pressure, heart rate                                                               |
| Metabolism and nutrition | Glucose, nutrition                                                                       |
| Musculoskeletal          | Bone density, muscle                                                                     |
| Immunity and temperature | Body temperature, immune signals                                                         |
| Behavioral               | Sleep, mood                                                                              |
| Cross-cutting            | The five spaceflight hazards, on-board measurement, and environments (Research document) |

---

## Documentation

| Document                              | Content                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`team-guide.md`](docs/team-guide.md) | **Team Guide**: working rules, schedule, task allocation, and decisions.                   |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)  | **Contributing guide**: local development, commit convention, branches, and pull requests. |
| `docs/research.md` _(pending)_        | **Research**: spaceflight hazards, effect on each body system, and on-board measurement.   |
| `data/` _(pending)_                   | **Indicator Catalog**: one YAML sheet per indicator and demonstration data.                |
| `docs/mvp-scope.md` _(draft)_         | **MVP Scope**: features, stack, code organization, and status evaluation.                  |
| [Figma][figma]                        | **Interface design**: user flows, visual guide, final design, and prototype.               |
| `docs/submission/` _(pending)_        | **Submission**: checklist, project description, pitch script, and demo plan.               |

[figma]: https://www.figma.com/design/XvscEW1Ipid5l8MwM2tcZu/Health-Monitoring-Software?node-id=0-1&t=SZYGo1d4yfSdK4ct-1

---

## Technical stack

_Pending_. It is defined in the MVP Scope. The application and the files in `data/` are in English, because the application loads those files and the end users are crews that operate in English.

---

## Team

| Name                                                                  | Role / area                                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Montano Valencia, Mike Armando](https://github.com/MikeArmando)      | Team coordinator and owner of the MVP Scope                                        |
| [Montoya García, José Antonio](https://github.com/josemontoya83-del)  | Owner of the Indicator Catalog                                                     |
| [Rovera Nava, José Pablo](https://github.com/Jose-Pablo-programacion) | Code base project, stack, and code organization                                    |
| [Perez Aguirre, Mextli Citlal](https://github.com/mxcitali)           | Demonstration data and video                                                       |
| [Rojas Arroyo, Kenan](https://github.com/KenanRojasArroyo)            | UX/UI designer                                                                     |
| [Moreno Calderon, Troy Leonardo](https://github.com/Troy2404)         | Cross-cutting research, README, and submission (description, checklist, and pitch) |

---

<sub>Project developed by the Unreal Coders team (UABC Ensenada) for the NASA Space Apps Challenge 2026.</sub>
