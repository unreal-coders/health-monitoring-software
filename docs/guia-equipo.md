# Guía del Equipo

| Campo                     | Detalle                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Equipo                    | Unreal Coders (6 integrantes, UABC Ensenada)                                               |
| Evento                    | NASA Space Apps Challenge 2026, reto _Health Monitoring Software_                          |
| Enunciado oficial         | https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details |
| Versión del documento     | 1.0.0                                                                                      |
| Fecha de creación         | 2 de noviembre de 2026                                                                     |
| Estado                    | Publicado                                                                                  |
| Responsable del documento | Mike Armando Montano Valencia                                                              |

Este documento define cómo trabaja el equipo, qué se construye y quién es responsable de cada pieza. Es el único lugar donde se registran las decisiones del equipo.

## Historial de cambios

| Versión  | Fecha                  | Cambio                                                                                                    |
| -------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| Borrador | 2 de noviembre de 2026 | Creación del documento.                                                                                   |
| 1.0.0    | 4 de noviembre de 2026 | Primera versión publicada en el repositorio, con los ajustes posteriores a la reunión del 3 de noviembre. |

---

## 1. Equipo y roles

Cada integrante tiene dos responsabilidades:

- **Investigación:** un dominio y los indicadores o temas que cubre. El resultado son sus fichas del Catálogo (en el caso de Troy, la Investigación).
- **Rol en el proyecto:** lo que hace además de investigar, es decir, los documentos y piezas de las que es responsable.

| Nombre                        | Investigación: dominio  | Investigación: indicadores o temas                                                                                                                                           | Rol en el proyecto                                                                                                                        |
| ----------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Mike Armando Montano Valencia | Cardiovascular          | Presión arterial, frecuencia cardiaca                                                                                                                                        | Coordina al equipo, redacta el Alcance del MVP (funciones)                                                                                |
| José Antonio Montoya García   | Metabolismo y nutrición | Glucosa, nutrición                                                                                                                                                           | Define el esquema del Catálogo (estados, reglas de redacción y formato de fuentes) y redacta la evaluación de estados del Alcance del MVP |
| José Pablo Rovera Nava        | Musculoesquelético      | Densidad ósea, músculo                                                                                                                                                       | Proyecto base del código; stack y organización del código del Alcance del MVP                                                             |
| Mextli Citlal Perez Aguirre   | Inmunidad y temperatura | Temperatura corporal, señales inmunes                                                                                                                                        | Datos de demostración y video                                                                                                             |
| Kenan Rojas Arroyo            | Conductual              | Sueño, estado de ánimo                                                                                                                                                       | UX/UI: Diseño de interfaz                                                                                                                 |
| Troy Leonardo Moreno Calderon | Transversal             | Los cinco peligros del vuelo (radiación, aislamiento y confinamiento, distancia de la Tierra, campos gravitatorios y entornos cerrados hostiles), medición a bordo, entornos | Redacta el README, la descripción del proyecto, la checklist de entrega y el guion del pitch con las diapositivas                         |

---

## 2. Mapa de documentos

| Documento               | Propósito                                                                                                            | Dueño        | Colaboradores                                                                                          | Ubicación                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Guía del Equipo         | Reglas de trabajo, calendario, reparto, decisiones                                                                   | Mike         | —                                                                                                      | `docs/guia-equipo.md`         |
| Investigación           | Conocimiento transversal a todos los indicadores: peligros del vuelo y medición a bordo                              | Troy         | —                                                                                                      | `docs/investigacion.md`       |
| Catálogo de Indicadores | Una ficha YAML por indicador (investigación, umbrales, acciones y textos para el astronauta) y datos de demostración | José Antonio | Mike, José Pablo, Mextli y Kenan (cada quien las fichas de su dominio); Mextli (datos de demostración) | `data/`                       |
| Alcance del MVP         | Qué hace la aplicación, con qué se construye y cómo evalúa los estados                                               | Mike         | José Antonio (evaluación de estados); José Pablo (stack y organización del código)                     | `docs/alcance-mvp.md`         |
| Diseño de interfaz      | Flujos, guía visual, diseño final y prototipo                                                                        | Kenan        | —                                                                                                      | Figma (enlace en `README.md`) |
| Entrega                 | Checklist de entrega, descripción del proyecto, guion de pitch y demo                                                | Troy         | Mextli (video demo o capturas); Todos (fuentes de su dominio en el README y ensayo de la demo)         | `docs/entrega/`               |

### Contenido por documento

**Investigación.** Los cinco peligros del vuelo y su efecto por sistema del cuerpo, incluido lo que implica la distancia de la Tierra para la atención médica (retardo de comunicación y autonomía de la tripulación); medición a bordo, con métodos, dispositivos y restricciones. Lo específico de cada indicador no se repite aquí: vive en la ficha.

**Catálogo.** Esquema de la ficha, que incluye el significado de cada estado (verde, amarillo, rojo) y a quién se avisa en cada uno, el formato de citas y las reglas de redacción de los textos para el astronauta (frases cortas, sin jerga, sin diagnosticar, y remitir al cirujano de vuelo cuando no haya fuente); una ficha por indicador y datos sintéticos con tres escenarios (normal, deterioro gradual, evento agudo). Cada ficha incluye mecanismo (por qué se mide el indicador y qué peligros del vuelo lo afectan), método de medición, valor basal con su tipo (referencia terrestre o específico de vuelo), umbrales por estado, acciones, contramedidas, cuándo contactar al cirujano de vuelo y qué hace la tripulación si no hay contacto en tiempo real, textos para el astronauta, limitaciones, fuentes completas, autor y revisor.

**Alcance del MVP.** Una a dos páginas con tres partes: las funciones de la aplicación en imprescindibles, deseables y fuera de alcance, a partir de lo obligatorio y lo opcional del enunciado y con el aviso de que es un prototipo de apoyo a decisión y no un dispositivo médico; el stack y la organización del código; y cómo la aplicación evalúa el estado de un indicador a partir de su ficha, con los casos límite (dato faltante, valor fuera de rango, medición antigua).

**Diseño de interfaz.** Cuatro páginas: flujos de usuario, guía visual con componentes (ej: paleta de estados accesible, tipografía, tarjeta de indicador, semáforo, gráfica, panel de guía, formulario de captura, alerta de escalamiento) y diseño final con prototipo.

**Entrega.** Checklist de requisitos de entrega, descripción del proyecto, guion del pitch y de la demo con plan alterno.

### Orden de dependencia

`Catálogo` (esquema) → fichas de `Catálogo` e `Investigación` en paralelo → `Alcance del MVP` → `Diseño de interfaz` y datos de demostración en paralelo → código → `Entrega`.

---

## 3. Estructura del repositorio

```
README.md
CONTRIBUTING.md
docs/
  guia-equipo.md
  investigacion.md
  alcance-mvp.md
  repository-config.md
  entrega/
data/
  esquema-indicador.md
  indicadores/        (un archivo YAML por indicador)
  demo/
src/
```

---

## 4. Calendario

| Fecha         | Hito                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3 nov         | Reunión de acuerdo, reparto y creación de org y repo                                                                                             |
| 4 nov         | Esquema de la ficha listo                                                                                                                        |
| 4–8 nov       | Investigación y fichas por dominio                                                                                                               |
| 9–13 nov      | Alcance del MVP (decisión y redacción), diseño de interfaz y datos de demostración                                                               |
| 13 nov        | Se publican los Resources y las guías de Project Submission y Judging & Awards; Troy cierra el checklist de entrega; cada quien ajusta lo propio |
| 14–15 nov     | Evento: construcción, pitch y entrega                                                                                                            |
| 15 nov, 23:59 | Cierre de la entrega, hora local (abre el sábado 14 a las 9:00)                                                                                  |
| 16 nov        | Inicio de evaluación                                                                                                                             |

---

## 5. Reparto de tareas

**Fase 0 · Arranque (3–4 nov)**

| Entregable                                                                                       | Documento       | Resp.        |
| ------------------------------------------------------------------------------------------------ | --------------- | ------------ |
| Crear org, repo, estructura y tablero                                                            | Guía del Equipo | Mike         |
| Definir el esquema de la ficha y validarlo con una ficha real antes de repartir la investigación | Catálogo        | José Antonio |

**Fase 1 · Investigación (4–8 nov)**

| Entregable                                             | Documento     | Resp.                                          |
| ------------------------------------------------------ | ------------- | ---------------------------------------------- |
| Fichas de los indicadores de cada dominio              | Catálogo      | Mike, José Antonio, José Pablo, Mextli y Kenan |
| Peligros del vuelo y efecto por sistema                | Investigación | Troy                                           |
| Medición a bordo: métodos, dispositivos, restricciones | Investigación | Troy                                           |

**Fase 2 · Definición y diseño (9–13 nov)**

| Entregable                                                                                                                          | Documento            | Resp.                         |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------- |
| Decidir el alcance del MVP                                                                                                          | Alcance del MVP      | Todos, por acuerdo o votación |
| Redactar las funciones y el aviso médico                                                                                            | Alcance del MVP      | Mike                          |
| Redactar la evaluación de estados                                                                                                   | Alcance del MVP      | José Antonio                  |
| Redactar el stack y la organización del código                                                                                      | Alcance del MVP      | José Pablo                    |
| Flujos, guía visual, diseño final y prototipo                                                                                       | Diseño de interfaz   | Kenan                         |
| Datos de demostración sintéticos                                                                                                    | Catálogo             | Mextli                        |
| Proyecto base del código (estructura inicial sin funcionalidad: framework, dependencias y carpetas; sujeto a las reglas del evento) | `src/`               | José Pablo                    |
| Checklist de requisitos de entrega (borrador; se cierra el 13 nov con la guía de Project Submission)                                | Entrega              | Troy                          |
| Revisar Resources y la guía de Project Submission, y ajustar lo propio (13 nov)                                                     | Documentos afectados | Todos                         |

**Fase 3 · Evento y entrega (14–15 nov)**

| Entregable                                                      | Documento | Resp.       |
| --------------------------------------------------------------- | --------- | ----------- |
| Implementación según el Alcance del MVP y el diseño de interfaz | `src/`    | Por definir |
| Guion del pitch y diapositivas                                  | Entrega   | Troy        |
| Video demo o capturas                                           | Entrega   | Mextli      |
| README final y descripción del proyecto                         | Entrega   | Troy        |
| Fuentes de cada dominio en el README (cada quien las suyas)     | Entrega   | Todos       |
| Ensayo de la demo                                               | Entrega   | Todos       |

---

## 6. Reglas de trabajo

1. Cada documento tiene un solo dueño, que responde por el documento completo. Puede haber varios colaboradores, que redactan las partes que se les asignan (ver Mapa de documentos). Todos aportan mediante pull request.
2. Todo cambio entra por pull request con al menos una revisión. Los commits, ramas, pull requests y el flujo de trabajo siguen `CONTRIBUTING.md`.
3. Los valores médicos (rangos, umbrales, acciones) existen en un solo lugar: la ficha del indicador. La Investigación, el Alcance del MVP y la interfaz los referencian y no los copian.
4. Todo valor médico lleva fuente.
5. Cada dueño verifica las referencias cruzadas de su documento contra el contenido real antes de darlo por terminado.
6. Los nombres de archivo no llevan acentos ni espacios.
7. Una tarea se considera terminada cuando está en el repositorio, fue revisada por otra persona y no tiene valores sin fuente. Una tarea terminada puede reabrirse para actualizarla.
8. Un bloqueo se comunica en el canal del equipo el mismo día.
9. Toda actualización de un documento de `docs/` sube su versión y se registra en su historial de cambios, con el formato de la sección "Convenciones del proyecto" de `CONTRIBUTING.md`. Excepción: `repository-config.md`, que es una plantilla reutilizable entre proyectos y no lleva tabla de datos ni historial.

---

## 7. Decisiones del equipo

| Decisión                                                                                                                                                    | Motivo                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Un solo repositorio dentro de una org de GitHub                                                                                                             | Mantener documentación y código en un solo lugar                                                                                                                    |
| Documentación en Markdown dentro del repositorio, diseño en Figma                                                                                           | Versionado y revisión por pull request                                                                                                                              |
| MVP basado en reglas y umbrales documentados, con IA como capa opcional                                                                                     | Trazable a fuentes y más simple de defender                                                                                                                         |
| Una ficha YAML por indicador como fuente única de datos médicos                                                                                             | Evita copias y desincronización                                                                                                                                     |
| Los datos de demostración son sintéticos                                                                                                                    | No hay datos individuales reales disponibles (pendiente de verificar)                                                                                               |
| Cada integrante integra su propio trabajo en los documentos; no hay roles de consolidación ni de aprobación aparte de la revisión de pull request           | Evita sobrecarga y dependencias entre personas                                                                                                                      |
| Los requisitos y el diseño técnico se escriben en un solo documento ligero, el Alcance del MVP, sin identificadores de requisitos ni matriz de trazabilidad | Reduce la carga de documentación para dedicar el tiempo a fichas, diseño e implementación                                                                           |
| El significado de los estados, el formato de fuentes y las reglas de redacción se definen una sola vez en el esquema de la ficha, antes de investigar       | Fichas consistentes sin revisión posterior                                                                                                                          |
| La aplicación, incluidos los textos para el astronauta, y los archivos de `data/` están en inglés                                                           | Idioma de la persona usuaria (tripulaciones que operan en inglés) y consistencia entre la interfaz y los datos, ya que la aplicación carga los archivos de `data/`. |
