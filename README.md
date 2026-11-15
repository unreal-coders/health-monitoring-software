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

The exact MVP features are defined in the [MVP Scope](docs/mvp-scope.md).

---

## Indicators by domain

| Domain                   | Indicators or topics                                                      |
| ------------------------ | ------------------------------------------------------------------------- |
| Cardiovascular           | Heart rate, blood pressure, oxygen saturation                             |
| Metabolism and nutrition | Blood glucose                                                             |
| Musculoskeletal          | Exercise                                                                  |
| Immunity and temperature | Body temperature, immune symptoms                                         |
| Behavioral               | Sleep hours, mood                                                         |
| Cross-cutting            | The five spaceflight hazards and on-board measurement (Research document) |

---

## Documentation

| Document                                          | Content                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`team-guide.md`](docs/team-guide.md)             | **Team Guide**: working rules, schedule, task allocation, and decisions.                                                                |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)              | **Contributing guide**: local development, commit convention, branches, and pull requests.                                              |
| [`research.md`](docs/research.md)                 | **Research**: spaceflight hazards, effect on each body system, and on-board measurement.                                                |
| [`indicators/`](data/indicators)                  | **Indicator Catalog**: one YAML sheet per indicator, the single source of medical data. Demonstration data in `data/demo/` _(pending)_. |
| [`indicator-schema.md`](data/indicator-schema.md) | **Sheet schema**: fields of each sheet, threshold rules, sources, and writing rules.                                                    |
| [`mvp-scope.md`](docs/mvp-scope.md)               | **MVP Scope**: features, stack, code organization, and status evaluation.                                                               |
| [Figma][figma]                                    | **Interface design**: user flows, visual guide, final design, and prototype.                                                            |
| `docs/submission/` _(pending)_                    | **Submission**: checklist, project description, pitch script, and demo plan.                                                            |

[figma]: https://www.figma.com/design/XvscEW1Ipid5l8MwM2tcZu/Health-Monitoring-Software?node-id=0-1&t=SZYGo1d4yfSdK4ct-1

---

## Technical stack

TypeScript with Vite and React, deployed as a static site on GitHub Pages: [unreal-coders.github.io/health-monitoring-software](https://unreal-coders.github.io/health-monitoring-software/). The stack, code organization, and deployment are defined in section 2 of the [MVP Scope](docs/mvp-scope.md), and how the application evaluates each indicator in section 3. The application and the files in `data/` are in English, because the application loads those files and the end users are crews that operate in English.

---

## Sources

NASA sources come first. Where NASA publishes no numeric range, the thresholds come from official clinical guidelines. Each sheet in [`data/indicators/`](data/indicators) names the exact source of every value.

| Domain                   | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cross-cutting            | NASA Human Research Program, [5 Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/); [NASA-STD-3001 Volume 1, Rev C](https://standards.nasa.gov/sites/default/files/standards/NASA/C//nasa-std-3001-vol-1-rev-c-signature.pdf); NASA OCHMO technical brief [TB-033](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-033-spaceflight-experience-medical-care.pdf); NASA Glenn, [Multifunctional Integrated Medical Devices](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/human-health-performance/exploration-medical-technologies/multifunctional-integrated-medical-devices); CSA, [Monitoring Radiation for Astronaut Health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)                                                                                                                                                                                                                                                                                                                                                                  |
| Cardiovascular           | NASA HRP, [Risk of Cardiovascular Adaptations](https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/) and [Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/) (hypoxia); NASA OCHMO [TB-019](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-019-orthostatic-intolerance.pdf) and [TB-003](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf); American Heart Association, [blood pressure readings](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings), [low blood pressure](https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/low-blood-pressure-when-blood-pressure-is-too-low), [home monitoring](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home), and [heart rate](https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse); MedlinePlus, [Pulse Oximetry](https://medlineplus.gov/lab-tests/pulse-oximetry/) |
| Metabolism and nutrition | NASA-STD-3001 Volume 1, section 4.5; CDC, [Diabetes Testing](https://www.cdc.gov/diabetes/diabetes-testing/index.html), [Low Blood Sugar](https://www.cdc.gov/diabetes/about/low-blood-sugar-hypoglycemia.html), and [Treatment of Low Blood Sugar](https://www.cdc.gov/diabetes/treatment/treatment-low-blood-sugar-hypoglycemia.html)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Musculoskeletal          | NASA HRP, [Risk of Reduced Cardiorespiratory and Musculoskeletal Fitness](https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness/), [Risk of Spaceflight-Induced Bone Changes](https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/), and [Hazard: Gravity Fields](https://www.nasa.gov/hrp/hazard-gravity-fields/); NASA OCHMO [TB-031 Exercise Overview](https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Immunity and temperature | NASA HRP, [Risk of Altered Immune System Responses](https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/) and [Hazard: Hostile/Closed Environments](https://www.nasa.gov/hrp/hazard-hostile-closed-environments/); NASA-STD-3001 Volume 1, Appendices C and E; CDC, [fever definition](https://www.cdc.gov/quarantine/maritime/definitions-signs-symptoms-conditions-ill-travelers.html)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Behavioral               | NASA HRP, [Risk from Inadequate Sleep and Irregular Schedules](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/), [Risk of Behavioral Changes and Psychiatric Disorders](https://www.nasa.gov/reference/risk-of-behavioral-conditions-and-psychiatric-disorders/), [Standard Measures](https://www.nasa.gov/reference/standard-measures/), and [ARCHeR](https://www.nasa.gov/reference/archer/); NASA OCHMO [TB-041](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-041-sleep-accommodations.pdf) and [TB-016](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-016-behavioral-health.pdf); Kroenke, Spitzer, and Williams, [The Patient Health Questionnaire-2](https://doi.org/10.1097/01.mlr.0000093487.78664.3c), Medical Care, 2003                                                                                                                                                                                                                                                                                                                                                  |

If a nasa.gov link returns "429 Too Many Requests", the archived copy works: `https://web.archive.org/web/2026/<link>`.

---

## Use of AI tools

Following the NASA Space Apps rules on Super Intelligence (SI) tools, the team acknowledges that an AI assistant (Claude, by Anthropic) supported the research, documentation, and code of this project. Every medical value in the indicator sheets names its source so it can be checked.

---

## Team

| Name                                                                  | Research domain          | Project role                                        |
| --------------------------------------------------------------------- | ------------------------ | --------------------------------------------------- |
| [Montano Valencia, Mike Armando](https://github.com/MikeArmando)      | Cardiovascular           | Team coordinator, MVP Scope owner, and app logic    |
| [Montoya García, José Antonio](https://github.com/josemontoya83-del)  | Metabolism and nutrition | Indicator Catalog owner and status evaluation rules |
| [Rovera Nava, José Pablo](https://github.com/Jose-Pablo-programacion) | Musculoskeletal          | Stack, code organization, and code owner of `src/`  |
| [Perez Aguirre, Mextli Citlal](https://github.com/mxcitali)           | Immunity and temperature | Demonstration data, flow testing, and demo video    |
| [Rojas Arroyo, Kenan](https://github.com/KenanRojasArroyo)            | Behavioral               | UX/UI design and app screens                        |
| [Moreno Calderon, Troy Leonardo](https://github.com/Troy2404)         | Cross-cutting            | Research document, README, and submission           |

---

<sub>Project developed by the Unreal Coders team (UABC Ensenada) for the NASA Space Apps Challenge 2026.</sub>
