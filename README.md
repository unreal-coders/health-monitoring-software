# Unreal Coders · Health Monitoring Software

Unreal Coders es el equipo de seis estudiantes de Ingeniería en Software y Tecnologías Emergentes de la UABC Ensenada que participa en el NASA Space Apps Challenge 2026 con el reto [Health Monitoring Software](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details). El proyecto es una herramienta visual que ayuda a un astronauta a registrar sus indicadores de salud, interpretar su estado y saber qué hacer cuando algo se sale de lo normal. No sustituye al cirujano de vuelo ni diagnostica; su valor está en darle a la tripulación una guía clara, trazable a fuentes, para evaluar su propia salud durante la misión.

> **Estado:** en desarrollo.

---

## El reto

En misiones de larga duración, la tripulación está expuesta a los cinco peligros del vuelo espacial que identifica el Programa de Investigación Humana de la NASA: radiación espacial, aislamiento y confinamiento, distancia de la Tierra, campos gravitatorios y entornos cerrados hostiles. Estos peligros pueden causar cambios inmunes, pérdida ósea, eventos cardiovasculares, nutrición inadecuada y problemas de salud conductual.

Cuanto más lejos y más tiempo dura la misión, más del trabajo de detectar esos cambios recae en el propio astronauta. El reto pide una herramienta que reúna indicadores de salud y permita evaluarlos y actuar sobre ellos, sin asumir que quien la usa sabe evaluar su salud.

Nuestra propuesta se apoya en lo siguiente:

### Catálogo de indicadores como única fuente de datos médicos

Cada indicador tiene una ficha propia donde vive todo lo clínico: por qué se mide, cómo se mide a bordo, valor basal, umbrales por estado, acciones, contramedidas, limitaciones y fuentes. La interfaz y la documentación referencian esas fichas y no copian sus valores, así que no hay datos que se desincronicen.

### Evaluación basada en reglas documentadas

El estado de un indicador (verde, amarillo o rojo) se determina con reglas y umbrales tomados de su ficha, no con una caja negra. Cada valor médico lleva fuente, por lo que cualquier resultado se puede rastrear y defender. La IA queda como capa opcional.

### Guía para el astronauta, sin diagnosticar

Los textos que ve el astronauta usan frases cortas y sin jerga, y no diagnostican. Cuando no hay fuente que respalde una indicación, remiten al cirujano de vuelo. Cada ficha indica cuándo contactarlo y qué hace la tripulación si no hay comunicación en tiempo real, algo que importa por la distancia de la Tierra.

### Datos de demostración sintéticos

Como no hay datos individuales reales disponibles, la demo usa datos sintéticos con tres escenarios: normal, deterioro gradual y evento agudo.

Las funciones exactas del MVP se definen en el Alcance del MVP (_pendiente_).

---

## Indicadores por dominio

| Dominio                 | Indicadores o temas                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Cardiovascular          | Presión arterial, frecuencia cardiaca                                                  |
| Metabolismo y nutrición | Glucosa, nutrición                                                                     |
| Musculoesquelético      | Densidad ósea, músculo                                                                 |
| Inmunidad y temperatura | Temperatura corporal, señales inmunes                                                  |
| Conductual              | Sueño, estado de ánimo                                                                 |
| Transversal             | Los cinco peligros del vuelo, medición a bordo y entornos (documento de Investigación) |

---

## Documentación

| Documento                               | Contenido                                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`guia-equipo.md`](docs/guia-equipo.md) | **Guía del Equipo**: reglas de trabajo, calendario, reparto de tareas y decisiones.       |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)    | **Guía de contribución**: desarrollo local, convención de commits, ramas y pull requests. |
| `docs/investigacion.md` _(pendiente)_   | **Investigación**: peligros del vuelo, efecto por sistema del cuerpo y medición a bordo.  |
| `data/` _(pendiente)_                   | **Catálogo de Indicadores**: una ficha YAML por indicador y datos de demostración.        |
| `docs/alcance-mvp.md` _(pendiente)_     | **Alcance del MVP**: funciones, stack, organización del código y evaluación de estados.   |
| `docs/entrega/` _(pendiente)_           | **Entrega**: checklist, descripción del proyecto, guion del pitch y plan de la demo.      |

Diseño de interfaz: Figma _(pendiente)_.

---

## Stack técnico

_Pendiente_. Se define en el Alcance del MVP. La aplicación y los archivos de `data/` están en inglés, porque la aplicación carga esos archivos y la persona usuaria final es una tripulación que opera en inglés.

---

## Equipo

| Nombre                                                                | Rol / área                                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Montano Valencia, Mike Armando](https://github.com/MikeArmando)      | Coordinador del equipo y responsable del Alcance del MVP                     |
| [Montoya García, José Antonio](https://github.com/josemontoya83-del)  | Responsable del Catálogo de Indicadores                                      |
| [Rovera Nava, José Pablo](https://github.com/Jose-Pablo-programacion) | Proyecto base del código, stack y organización del código                    |
| [Perez Aguirre, Mextli Citlal](https://github.com/mxcitali)           | Datos de demostración y video                                                |
| [Rojas Arroyo, Kenan](https://github.com/KenanRojasArroyo)            | Diseñador UX/UI                                                              |
| [Moreno Calderon, Troy Leonardo](https://github.com/Troy2404)         | Investigación transversal, README y entrega (descripción, checklist y pitch) |

---

<sub>Proyecto desarrollado por el equipo Unreal Coders (UABC Ensenada) para el NASA Space Apps Challenge 2026.</sub>
