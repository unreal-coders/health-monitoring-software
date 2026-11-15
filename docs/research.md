# Research

| Field            | Detail                        |
| ---------------- | ----------------------------- |
| Document version | 1.2.0                         |
| Creation date    | November 14, 2026             |
| Status           | Published                     |
| Document owner   | Troy Leonardo Moreno Calderon |

Knowledge that applies to all indicators: the five hazards of spaceflight, how they affect each body system, and how an astronaut can check their health on board. What is specific to each indicator (thresholds, actions, measurement interval, and its own sources) is not repeated here: it lives in its sheet in the Indicator Catalog (`data/`).

## Change history

| Version | Date              | Change                                                                                                                                       |
| ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft   | November 14, 2026 | Document created.                                                                                                                            |
| 1.0.0   | November 14, 2026 | First version published in the repository.                                                                                                   |
| 1.1.0   | November 14, 2026 | Mood uses the PHQ-2. On-board measurement sources added for vital signs and radiation. Bone density wording aligned with the NASA source.    |
| 1.2.0   | November 15, 2026 | Radiation dose removed from the methods by indicator, since the team dropped it as an indicator. Radiation stays as one of the five hazards. |

---

## 1. The five hazards of spaceflight

NASA's Human Research Program groups the challenges of human spaceflight into five hazards: space radiation, isolation and confinement, distance from Earth, gravity fields, and hostile or closed environments. The hazards do not act alone: they feed off one another and worsen their effects on the body ([NASA: five hazards][hazards]).

### 1.1 Space radiation

- Outside Earth's magnetic field and atmosphere, astronauts are exposed to galactic cosmic rays and to solar storms such as solar particle events ([NASA: Space Radiation][hz-radiation]).
- It cannot be seen or felt, so it can only be known through instruments ([NASA: Space Radiation][hz-radiation]).
- Exposure increases cancer risk, can damage the central nervous system, alter cognitive and motor function, and prompt behavioral changes ([NASA: Space Radiation][hz-radiation]).
- NASA's Space Radiation Analysis Group monitors the radiation environment and crew exposure 24 hours a day ([NASA: Monitoring Space Radiation][radiation-monitoring]).
- Neutron radiation is about 30% of the total radiation on the ISS. The CSA is developing the Canadian Active Neutron Spectrometer (CANS) to measure it continuously and autonomously ([CSA: Monitoring Radiation][csa-radiation]).

### 1.2 Isolation and confinement

- Crews live far from Earth in a small space for months or years ([NASA: Isolation and Confinement][hz-isolation]).
- Sleep loss, circadian desynchronization, and work overload compound the problem and can lower performance and harm health ([NASA: Isolation and Confinement][hz-isolation]).
- Prolonged isolation can increase the risk of anxiety and depression, which affect sleep, morale, and decision making ([NASA: behavioral risk][risk-behavioral]).
- NASA is developing ways to monitor behavioral health and to detect and treat early risk factors, and studies these conditions in ground analogs such as HERA and CHAPEA ([NASA: Isolation and Confinement][hz-isolation]).

### 1.3 Distance from Earth

- Mars is on average 140 million miles from Earth. A mission would last about three years, instead of a three-day trip to the Moon ([NASA: Distance from Earth][hz-distance]).
- Communication delays reach up to 20 minutes one way ([NASA: Distance from Earth][hz-distance]).
- Crews will rely less on Earth for food, materials, and emergency medical help ([CSA: Science in space][csa-science]).
- **What it means for medical care:** the crew must be able to assess their own health and act without real-time help from the flight surgeon. This is why each indicator sheet states what the crew does when there is no real-time contact.

### 1.4 Gravity fields

- A Mars mission goes through three gravity fields: weightlessness during the trip, about one-third of Earth's gravity on Mars, and Earth's gravity on return ([NASA: Gravity Fields][hz-gravity]).
- Each transition affects spatial orientation, coordination, balance, and walking, and can cause motion sickness, lightheadedness, and fainting ([NASA: Gravity Fields][hz-gravity]).
- Without Earth's load, weight-bearing bones lose on average 1% to 1.5% of their mineral density per month ([NASA: Gravity Fields][hz-gravity]).
- Body fluids shift toward the head, which can press on the eyes and cause vision problems ([NASA: Gravity Fields][hz-gravity]).
- Dehydration and the calcium released by bones raise the risk of kidney stones ([NASA: Gravity Fields][hz-gravity]).

### 1.5 Hostile and closed environments

- The spacecraft is both home and machine: temperature, pressure, lighting, noise, and microbes all affect the crew ([NASA: Hostile/Closed Environments][hz-closed]).
- Microbes can change in space and pass more easily between crew members ([NASA: Hostile/Closed Environments][hz-closed]).
- Stress hormones can rise and the immune system can change, which could make allergies or other illnesses more likely ([NASA: Hostile/Closed Environments][hz-closed]).

---

## 2. Effect on each body system

Grouped by the domains of the application. The specific effects behind each indicator are in its sheet.

| Domain                   | Main effects                                                                                                                                                                               | Hazards involved                                  | Sources                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------- |
| Cardiovascular           | Blood clots, heart arrhythmias, and low blood pressure that raises the chance of fainting at landing. The heart can become more spherical, and blood vessels stiffen and age faster.       | Gravity fields                                    | [NASA: cardiovascular risk][risk-cardio], [CSA: body infographic][csa-body] |
| Metabolism and nutrition | Astronauts can develop insulin resistance. Meals must be safe, nutritious, and varied for long missions without resupply.                                                                  | Gravity fields, distance from Earth               | [CSA: body infographic][csa-body], [NASA: nutrition risk][risk-nutrition]   |
| Musculoskeletal          | Bones lose 1% to 1.5% of their density per month. Strength and aerobic fitness drop 10% to 12% on average. Exercise is the main countermeasure: about 1.5 hours a day, 6 to 7 days a week. | Gravity fields                                    | [NASA: bone risk][risk-bone], [NASA: fitness risk][risk-fitness]            |
| Immunity and temperature | Latent viruses can reactivate, and astronauts have reported cold sores, rashes, unusual allergies, and infections.                                                                         | Radiation, hostile/closed environments, isolation | [NASA: immune risk][risk-immune]                                            |
| Behavioral               | Sleep loss and disrupted body clocks (astronauts see 16 sunrises a day on the ISS), and a higher risk of anxiety and depression.                                                           | Isolation and confinement, distance from Earth    | [NASA: sleep risk][risk-sleep], [NASA: behavioral risk][risk-behavioral]    |
| Whole body               | Radiation raises cancer risk and can damage the central nervous system.                                                                                                                    | Space radiation                                   | [NASA: Space Radiation][hz-radiation]                                       |

---

## 3. On-board measurement

### 3.1 What NASA measures in flight

- **Spaceflight Standard Measures** collects a standard set of measurements before, during, and after flight: activity and light exposure from a wrist sensor, sleep reports, fluid samples for diet and nutrition, saliva for immune function, cognition tests, sensorimotor tests, a total body strength test, and fecal samples ([NASA: Standard Measures][standard-measures]).
- **ARCHeR** measures well-being, activity, and sleep on Artemis missions with actigraphy and behavioral performance surveys ([NASA: ARCHeR][archer]).
- **Immune Biomarkers** uses blood samples before and after the mission, and saliva during it, including dry saliva blotted on paper booklets ([NASA: Immune Biomarkers][immune-biomarkers]).
- **Tempus Pro** tests a commercial telemedicine device that collects vital signs and medical images, which could support near real-time diagnosis as communication delays grow ([NASA: Tempus Pro][tempus-pro]).

**Constraint:** some of these measurements do not give the crew a result during the flight. Bone density is measured with scans before and after flight ([NASA: bone risk][risk-bone]), and immune biomarkers need blood, saliva, or urine analysis, with samples returned to Earth ([NASA: immune risk][risk-immune]). On a mission to Mars, neither gives the crew a result when they need it.

### 3.2 Selection criteria

The application covers indicators that are easy to check on board:

1. The astronaut can do it alone, without a crew medical officer or flight surgeon.
2. It takes about two minutes or less.
3. It needs only a small device or no device (self-report).
4. It gives a result right away, without returning samples to Earth.

The six indicators named in the challenge (blood pressure, heart rate, blood sugar, body temperature, daily sleep hours, and mood) meet these criteria ([challenge statement][challenge]).

### 3.3 Kinds of entries

| Kind        | What the astronaut does                                                             | Example                                                           |
| ----------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Measurement | Takes a reading with a device and types the number.                                 | Blood pressure from an arm cuff.                                  |
| Self-report | Answers a short question in the app.                                                | The two PHQ-2 mood questions.                                     |
| Log         | Gets reminded of a healthy habit and logs how much they did, toward a daily target. | "Remember to exercise." / "You have done 45 of 90 minutes today." |

### 3.4 Methods by indicator

How each indicator in the [MVP Scope](mvp-scope.md) is checked on board. Thresholds, targets, and measurement intervals are in each sheet.

| Domain                   | Indicator         | Kind                    | How it is done on board                                                     |
| ------------------------ | ----------------- | ----------------------- | --------------------------------------------------------------------------- |
| Cardiovascular           | Heart rate        | Measurement             | Finger pulse oximeter or wrist wearable, under one minute.                  |
| Cardiovascular           | Blood pressure    | Measurement             | Automatic arm cuff, about one minute.                                       |
| Cardiovascular           | Oxygen saturation | Measurement             | The same pulse oximeter used for heart rate, no extra time.                 |
| Metabolism and nutrition | Blood glucose     | Measurement             | Fingerstick glucometer, about one minute.                                   |
| Immunity and temperature | Body temperature  | Measurement             | Forehead or ear thermometer, seconds.                                       |
| Immunity and temperature | Immune symptoms   | Self-report             | Short checklist: cold sores, rashes, unusual allergies, signs of infection. |
| Behavioral               | Sleep hours       | Self-report or wearable | Hours reported on waking, or a wrist actigraphy device.                     |
| Behavioral               | Mood              | Self-report             | The two PHQ-2 questions in the app, every two weeks.                        |
| Musculoskeletal          | Exercise          | Log                     | Reminder to exercise and a log of minutes done, with progress for the day.  |

Two indicators replace measurements the astronaut cannot take alone in a few minutes:

- **Exercise instead of bone density.** NASA measures bone density with scans before and after flight ([NASA: bone risk][risk-bone]), and exercise is NASA's main countermeasure against bone and muscle loss ([NASA: fitness risk][risk-fitness]). Helping the astronaut keep up with it is the most useful thing the application can do for this domain.
- **Immune symptoms instead of biomarkers.** Biomarkers need lab analysis, while the symptoms astronauts have reported can be checked in seconds ([NASA: immune risk][risk-immune]).

**Sources for the methods:**

- Blood pressure, oxygen saturation, and heart rate are vital signs that in-mission medical capabilities assess and store ([OCHMO-TB-033][tb-033]). NASA has tested non-invasive blood pressure, pulse oximetry, heart monitoring, and temperature with the Tempus Pro device ([NASA Glenn][glenn-mim]).
- Sleep and mood are supported by NASA's use of actigraphy and behavioral surveys ([Standard Measures][standard-measures], [ARCHeR][archer]). Mood uses the PHQ-2, a validated two-question screener.
- **Still without a NASA source:** a glucometer on board and a symptom self-report checklist.

---

## Sources

nasa.gov returned "429 Too Many Requests" during the event. If a NASA link fails, the archived copy works: `https://web.archive.org/web/2026/<link>`.

- [Challenge statement][challenge], NASA Space Apps Challenge 2026
- NASA Human Research Program, [5 Hazards of Human Spaceflight][hazards]: [Space Radiation][hz-radiation], [Isolation and Confinement][hz-isolation], [Distance from Earth][hz-distance], [Gravity Fields][hz-gravity], [Hostile/Closed Environments][hz-closed]
- NASA Human Research Program, [Risks of Human Spaceflight][risks]: [cardiovascular][risk-cardio], [nutrition][risk-nutrition], [bone][risk-bone], [fitness][risk-fitness], [immune][risk-immune], [sleep][risk-sleep], [behavioral][risk-behavioral]
- NASA Human Research Program, [Ongoing HRP Research][ongoing]: [Standard Measures][standard-measures], [ARCHeR][archer], [Immune Biomarkers][immune-biomarkers], [Tempus Pro][tempus-pro]
- NASA, [Monitoring Space Radiation][radiation-monitoring]
- NASA Office of the Chief Health and Medical Officer: [OCHMO-TB-033 Spaceflight Experience and Medical Care][tb-033]
- NASA Glenn Research Center, [Multifunctional Integrated Medical Devices][glenn-mim]
- CSA: [Monitoring Radiation for Astronaut Health][csa-radiation], [Why Do We Conduct Science Experiments in Space?][csa-science], [How does space affect the human body? (infographic)][csa-body]

[challenge]: https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details
[hazards]: https://www.nasa.gov/hrp/hazards/
[hz-radiation]: https://www.nasa.gov/hrp/hazard-space-radiation/
[hz-isolation]: https://www.nasa.gov/hrp/hazard-isolation-and-confinement/
[hz-distance]: https://www.nasa.gov/hrp/hazard-distance-from-earth/
[hz-gravity]: https://www.nasa.gov/hrp/hazard-gravity-fields/
[hz-closed]: https://www.nasa.gov/hrp/hazard-hostile-closed-environments/
[risks]: https://www.nasa.gov/hrp/risks/
[risk-cardio]: https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/
[risk-nutrition]: https://www.nasa.gov/reference/risk-of-inadequate-food-and-nutrition/
[risk-bone]: https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
[risk-fitness]: https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness/
[risk-immune]: https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/
[risk-sleep]: https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/
[risk-behavioral]: https://www.nasa.gov/reference/risk-of-behavioral-conditions-and-psychiatric-disorders/
[ongoing]: https://www.nasa.gov/hrp/ongoing-hrp-research/
[standard-measures]: https://www.nasa.gov/reference/standard-measures/
[archer]: https://www.nasa.gov/reference/archer/
[immune-biomarkers]: https://www.nasa.gov/reference/immune-biomarkers/
[tempus-pro]: https://www.nasa.gov/reference/tempus-pro/
[radiation-monitoring]: https://www.nasa.gov/directorates/esdmd/hhp/space-radiation/
[tb-033]: https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-033-spaceflight-experience-medical-care.pdf
[glenn-mim]: https://www.nasa.gov/glenn/glenn-expertise-space-exploration/human-health-performance/exploration-medical-technologies/multifunctional-integrated-medical-devices
[csa-radiation]: https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp
[csa-science]: https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp
[csa-body]: https://www.asc-csa.gc.ca/eng/multimedia/search/image/8056
