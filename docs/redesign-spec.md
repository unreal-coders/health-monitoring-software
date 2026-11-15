# Rediseño del front — Astronaut Health Monitor

Especificación para implementar el rediseño en el repo. Prototipo visual de referencia: canvas "Astronaut Health Monitor — redesign" (pantallas: Profile selection, Create crew profile, Dashboard (wheel), Indicator detail, Tokens and components, Grid alternative).

Trabaja en una rama nueva (`feat/redesign`). No hagas push a `main`.

---

## 0. Reglas que no se rompen

1. **Ningún valor ni texto médico escrito en el front.** Todo sale de la ficha (`getSheet(id)`) o del `StatusResult` (`rule.text`, `sheet.astronaut_text`, etc.). En el prototipo aparecen como `[sheet: ...]`; aquí van los campos reales.
2. **El estado nunca se comunica solo con color.** Siempre ícono + texto (y en la gráfica, además, forma del punto).
3. **Aviso legal siempre visible** (footer fijo abajo en todas las pantallas):
   > This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a medical device, does not diagnose conditions, and does not replace the flight surgeon. Demo data is synthetic. Unofficial interface inspired by the NASA Web Design System. Not affiliated with NASA.
4. **Colores y fuentes solo como variables CSS** en `index.css`. Cero hex sueltos en componentes.
5. **Toda la UI en inglés.**
6. **Navegación con estado de React**, sin rutas de URL (GitHub Pages).
7. **`prefers-reduced-motion`** respetado y responsive hasta 320 px.
8. **No tocar** `domain/`, `catalog/`, `data/indicators/*.yaml`. `storage/` solo según la sección 6.
9. No usar el logo de la NASA (meatball/worm).

---

## 1. Design tokens (`src/index.css`)

Reemplaza los tokens actuales por estos. Se conservan los nombres existentes donde aplica.

```css
:root {
  color-scheme: dark;

  /* Surfaces */
  --color-bg: #111E2B;
  --color-surface: #1B2B3C;
  --color-footer: #0D1722;
  --color-border: #2A3E52;          /* reglas decorativas, bordes de tarjeta */
  --color-border-strong: #5C768D;   /* inputs, botones secundarios (≥3:1) */

  /* Text */
  --color-text: #E2E8F0;
  --color-text-muted: #94A3B8;
  --color-active: #CBD5E1;          /* pestaña activa, botón primario (texto: --color-bg) */
  --color-focus: #CBD5E1;

  /* Status: fill/borde/ícono vs texto */
  --color-status-normal: #4ADE80;
  --color-status-normal-text: #4ADE80;
  --color-status-caution: #EAB308;
  --color-status-caution-text: #EAB308;
  --color-status-critical: #E05252;       /* solo rellenos, bordes, íconos */
  --color-status-critical-text: #F58A8A;  /* texto rojo (E05252 falla AA como texto) */
  --color-status-missing: #5C768D;
  --color-status-missing-text: #94A3B8;

  /* Tints (fondo de segmentos de la rueda / anillo central) */
  --color-tint-normal: #1F3D3E;
  --color-tint-caution: #33392F;
  --color-tint-critical: #352B37;

  /* Stars */
  --color-star: #E2E8F0;

  /* Type */
  --font-display: 'Inter', 'Helvetica Neue', sans-serif;   /* h1, h2 */
  --font-family: 'Public Sans', system-ui, sans-serif;      /* body, botones */
  --font-mono: 'DM Mono', 'IBM Plex Mono', monospace;       /* números, etiquetas, tags, nav */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;
  --font-size-2xl: 2.25rem;

  /* Spacing (8px base) */
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px;
  --space-5: 32px; --space-6: 48px; --space-7: 64px;

  /* Shape */
  --radius: 2px;          /* todo; 50% solo en avatares y anillo de estado */
  --max-width: 1200px;
}
```

Fuentes (en `index.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Public+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Contraste verificado (AA ≥ 4.5:1): text/surface 11.69 · muted/surface 5.62 · normal/surface 8.27 · caution/surface 7.51 · critical-text/surface 6.10 · bg sobre active 11.37.

### Reglas globales de estilo (NASAWDS)
- Esquinas `var(--radius)` (2px) en todo. Nada redondeado excepto avatares y el círculo central de la rueda.
- Separación con bordes de 1px (`--color-border`), sin sombras.
- **Etiquetas/telemetría:** `font-family: var(--font-mono)`, mayúsculas, `letter-spacing: 0.08em`, 11–13px. Ej.: `CARDIOVASCULAR`, `BIOMETRIC LINK: SIMULATED`.
- **Números de mediciones:** `var(--font-mono)` + `font-variant-numeric: tabular-nums`.
- **Botones:** padding `12px 20px`, min-height 44px, texto bold. Primario: fondo `--color-active`, texto `--color-bg`. Secundario: transparente, borde `--color-border-strong`.
- **Foco:** `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }`
- **Enlaces de acción** terminan en ` ->` ("View details ->").
- **Alertas:** fondo `--color-surface`, borde 1px `--color-border` y **borde izquierdo 4px** del color de estado.

---

## 2. Componentes base

### `Starfield.tsx` (nuevo) — fondo de estrellas + lluvia de estrellas
- Capa `position:absolute; inset:0; pointer-events:none; z-index:0; overflow:hidden` dentro de la raíz de cada pantalla (raíz con `position:relative`). El contenido va encima con `position:relative; z-index:1`.
- ~140 estrellas (`<span>` circulares 1.5 / 2.2 / 3.2 px, color `--color-star`, opacidad 0.45–1) con posiciones pseudoaleatorias **deterministas** (semilla fija, `useMemo`) para que no cambien en cada render. ~40% parpadean (`@keyframes twinkle`, 4s).
- 7 estrellas fugaces: barra de 160×2px con gradiente de `#FFFFFF` a transparente, cabeza circular brillante (`::before`), rotada −35°; `@keyframes shoot` las desplaza `translate3d(-640px, 450px, 0)` en el primer 12% del ciclo y quedan invisibles el resto. Duración 7–13s, retrasos escalonados (`i*1.6s + random*2s`).
- Props: `stars?: number`, `meteors?: number`, `meteorLength?: number` (para la versión chica dentro de Space garden: 28 estrellas, 2 meteoros de 60px).
- `@media (prefers-reduced-motion: reduce)`: meteoros `display:none`, estrellas sin animación.
- Se usa en **todas** las pantallas.

### `StatusBadge.tsx` — tag de estado
Recibe `StatusResult` (o `kind`). Estilo tag NASAWDS: `inline-flex`, gap 4px, `var(--font-mono)` 11px, mayúsculas, `letter-spacing .08em`, padding `2px 8px`, borde 1px del color de estado, **sin relleno**, texto en el `*-text` del estado.

| `kind` | Ícono (SVG stroke) | Texto | Borde / texto |
|---|---|---|---|
| `green` | check ✓ | `Normal` | normal / normal-text |
| `yellow` | triángulo ! | `Caution` | caution / caution-text |
| `red` | octágono ! | `Critical` | critical / critical-text |
| `missing` | guion – | `No data` | missing / missing-text |
| `no-reference` | signo ? | `No reference` | missing / missing-text (borde punteado) |

Si `outdated === true`, agregar al lado un tag `⏱ OUTDATED` en caution-text.

### `EscalationAlert.tsx`
Se muestra cuando `contactFlightSurgeon === true` (y, si es `'if-symptoms'`, con texto condicional que venga de la ficha). Alerta con borde izquierdo 4px `--color-status-critical`, ícono de teléfono, título `Contact the flight surgeon` en `--color-status-critical-text`, cuerpo = `StatusResult.text`, y una sub-caja "If there is no real-time contact" con el texto correspondiente de la ficha. `role="alert"`.

### `Disclaimer` (footer)
`<footer role="note">` `position: sticky; bottom: 0; z-index: 2;` fondo `--color-footer`, borde superior 1px, ícono info, texto del aviso (regla 3) a 12px en `--color-text-muted`.

### `TopNav.tsx`
- Izquierda: marca (ícono órbita SVG simple + "Astronaut Health Monitor", Inter 700).
- Pestañas: `Dashboard`, `Medical log`, `Mission and habits`, `Settings` — `var(--font-mono)` 13px mayúsculas; activa con texto `--color-text` y borde inferior 2px `--color-active`.
- Fondo semitransparente (`color-mix(in srgb, var(--color-bg) 60%, transparent)`) para que se vean las estrellas.
- **Derecha: `ProfileChip`** — botón que abre la pantalla de perfiles. Texto alineado a la derecha: nombre (Inter 700, 15px) y debajo `CALLSIGN · AGE NN` (mono 11px muted). Avatar circular 48px, borde 2px `--color-active`, fondo `--color-surface`, con el ícono del avatar del perfil. `aria-label="{name}, switch profile"`.

---

## 3. Pantallas

`App.tsx` controla todo con estado:
```ts
type Screen = 'profiles' | 'profile-setup' | 'dashboard' | 'detail'
const [screen, setScreen] = useState<Screen>('profiles')
const [profileId, setProfileId] = useState<string | null>(null)
const [selectedId, setSelectedId] = useState<string | null>(null) // indicador
```
Arranca en `profiles` (o directo en `dashboard` si ya hay un perfil activo guardado).

### 3.1 Profile selection (`screens/ProfilePicker.tsx`, nuevo)
- Header simple (marca + `CREW ROSTER // N MEMBERS` en mono).
- Centrado vertical: etiqueta `START OF SHIFT`, h1 **"Who's checking in?"** (44px), subtítulo "Choose your crew profile to log readings and see your status."
- Lista `<ul>` de perfiles (flex wrap, gap 32px). Cada perfil es un `<button>`:
  - Tarjeta 140×140, fondo surface, borde 1px, **borde superior 4px del color del estado general** de ese perfil, call sign arriba a la izquierda (mono), avatar SVG grande abajo centrado.
  - Debajo: nombre (17px), rol (mono 11px), `StatusBadge` del estado general del perfil.
  - Hover/focus: borde `--color-text` y `translateY(-4px)` (sin movimiento con reduced-motion). Foco: outline 3px.
- Último elemento: "Add crew member" (tarjeta con borde punteado y ícono +) → `profile-setup`.
- Botón secundario `MANAGE PROFILES ->` → `profile-setup` (modo edición, opcional).
- Starfield + Disclaimer.

### 3.2 Create crew profile (`screens/ProfileSetup.tsx`, nuevo)
- "Back to profiles", etiqueta `PROFILE SETUP`, h1 "Create crew profile", subtítulo.
- Formulario (tarjeta con barra meta superior `CREW PROFILE // NEW` y `REQUIRED *`):
  - **Full name \*** (text, `autocomplete="name"`).
  - **Date of birth \*** (`type="date"`, `max` = hoy) + **Age** calculada y de solo lectura.
  - **Crew role** (select: Commander, Pilot, Flight engineer, Mission specialist, Payload specialist).
  - **Call sign** (text, máx 6, mono, mayúsculas; si está vacío se usan iniciales).
  - **Avatar**: 4 botones 72×72 con `aria-pressed` (helmet, rocket, planet, satellite).
  - Nota con candado: "Profile data stays on this device. Nothing is sent to a server."
  - Botones: `Create profile` (primario, submit) y `Cancel` (secundario).
- Validación al enviar: nombre vacío → "Enter the crew member's name."; sin fecha → "Enter a date of birth."; fecha futura → "Date of birth can't be in the future."; edad fuera de 18–80 → "Enter a valid date of birth." Error en `--color-status-critical-text` bajo el campo, `aria-invalid` + borde crítico en el input; se limpia al editar. No avanza hasta que sea válido.
- Al guardar: alerta de éxito (borde izquierdo 4px normal) "✓ PROFILE CREATED — {name} was added to the crew roster." + `Go to profiles ->`.
- Columna derecha: **Preview** en vivo de la tarjeta tal como se verá en ProfilePicker.

### 3.3 Dashboard — rueda (`screens/Dashboard.tsx` + `components/RadialHealth.tsx`)
Layout: contenido max-width 1200px. Fila superior: a la izquierda `BIOMETRIC LINK: SIMULATED` (mono) + h1 "Health overview"; a la derecha selector de escenario demo (grupo de 3 botones `Normal` / `Gradual decline` / `Acute event`, activo con fondo `--color-active`) + botón primario **Register** (→ formulario del indicador) + secundario **Charts** (→ detalle/historial).

Dos columnas (flex-wrap; la derecha baja en móvil):

**Izquierda — `RadialHealth`** (SVG `viewBox 0 0 600 600`, ancho 100% hasta 600px):
- 9 segmentos de 40° (radio exterior 290, interior 150, separación 1.6°), empezando en −110° en el orden: Heart rate, Blood pressure, Oxygen saturation, Blood glucose, Body temperature, Immune symptoms, Exercise, Sleep hours, Mood.
- **Color del segmento = estado del indicador** (relleno `--color-tint-*`, borde del color de estado). **Nunca color por dominio.** Faltante / sin referencia: relleno surface, borde missing.
- Dentro de cada segmento, centrado en el radio 222: nombre (13px), valor (mono 22px) + unidad (11px), y línea `{símbolo} {label}` (✓ ! ✕ – ?) en el color de texto del estado.
- Segmento seleccionado: borde 3px `--color-text`. Click selecciona.
- Centro: círculo `--color-footer` r142 + círculo r128 con tint/borde del estado general; ícono + label (Normal / Caution / Critical) + "Overall status".
- Debajo de la rueda: fila de chips (`<button aria-pressed>`) con los 9 nombres para seleccionar con teclado.
- Tarjeta del indicador seleccionado (`aria-live="polite"`): dominio (mono), nombre, `StatusBadge`, valor grande, texto del `StatusResult`, botones `View details ->` y `Log this indicator ->`.

**Derecha:**
- `StatusPanel`: título Status, badge del estado general, frase (de `domain/health.ts` o del resultado), lista **Review** con botones para cada indicador en caution/critical (críticos primero; click selecciona en la rueda). Si hay algún crítico: caja con borde izquierdo crítico "Contact the flight surgeon. Share the flagged readings." Borde de la tarjeta en `--color-status-critical` cuando hay críticos.
- `SpacePlant` (ver 3.5).

### 3.4 Indicator detail (`screens/IndicatorDetail.tsx`)
- "Back to overview", dominio (mono), h1 nombre, valor actual grande + unidad, `StatusBadge` grande.
- `EscalationAlert` si aplica.
- Dos columnas:
  - **Izquierda:** tarjeta **History** con selector `7 days / 14 days / All` y `HistoryChart`; lista de últimas lecturas (fecha, valor mono, tag de estado). Debajo, **Guidance** (`GuidancePanel`) como acordeón `<details>` (primera sección abierta): Why we measure it · How to measure on board · What to do now · When to contact the flight surgeon · If there is no real-time contact · Countermeasures · Limitations · Sources. Todo el texto de la ficha.
  - **Derecha:** `EntryForm` ("Log a reading"): Date + Time, campo(s) del indicador con la unidad como sufijo dentro del input, caja "HOW TO MEASURE" con el texto de la ficha, botón primario `Save reading`, confirmación "✓ Reading saved. Status updated." (`role="status"`). Debajo, tarjeta "What the status means" con las 3 reglas (verde/amarillo/rojo) de la ficha, cada una con ícono + label.

### 3.5 `HistoryChart.tsx` (Recharts)
- Líneas de cuadrícula `--color-border`, ejes con texto muted 11px.
- Bandas de referencia (`ReferenceArea`) de caution y critical con el color de estado al 7–8% de opacidad y bordes punteados; umbrales **desde la ficha**.
- Línea `--color-active` 2px.
- **Puntos con color y forma por estado** (custom `dot`): círculo = normal, rombo = caution, cuadrado = critical, borde 2px `--color-bg`.
- Leyenda: "Normal (circle) · Caution (diamond) · Critical (square)".
- Tooltip con fondo surface, borde 1px, valor en mono.

### 3.6 `SpacePlant.tsx` — Space garden
- Tarjeta con título "Space garden" y tag `LEVEL N`.
- "Cámara de cultivo" de 200px de alto: fondo `--color-footer`, borde 1px, `Starfield` chico adentro, barra de luz superior (4px, `--color-active` 50%), etiqueta mono `VEG-01 · STAGE N/5`, maceta y planta SVG centradas abajo.
- **Etapas por número total de lecturas del perfil:** 0 Seed · 3 Sprout · 8 Seedling · 15 Young plant · 25 In bloom (flor con pétalos `--color-text`). Hojas: relleno `--color-tint-normal`, trazo `--color-status-normal`.
- Debajo: nombre de la etapa, `N readings logged`, barra de progreso a la siguiente etapa (`role="progressbar"`), "X more to {next stage} · Logging streak: N day(s)". Si hay algún crítico: "Your plant is asking for attention. Contact the flight surgeon." en critical-text.
- Transición de crecimiento solo sin reduced-motion.

### 3.7 Grid alternative (opcional, solo si sobra tiempo)
Misma información que la rueda en tarjetas agrupadas por dominio. Ver canvas. No es prioridad.

---

## 4. Responsive
- < 900px: columnas de Dashboard y Detail se apilan (la derecha baja).
- < 640px: rueda al 100% del ancho; textos internos de la rueda bajan a 11/18/11px o se ocultan valores y se confía en los chips + tarjeta seleccionada; nav en wrap; perfiles en 2 columnas.
- Funciona a 320px.

---

## 5. Orden de implementación (priorizado para la entrega)

1. Tokens + fuentes + estilos globales + `Disclaimer` + `Starfield`.
2. `StatusBadge`, `EscalationAlert`, `TopNav` + `ProfileChip`.
3. Dashboard con `RadialHealth` (colores por estado), `StatusPanel`, selector de escenarios y botones Register/Charts.
4. `IndicatorDetail` + `HistoryChart` + `EntryForm` + `GuidancePanel`.
5. `SpacePlant` con etapas.
6. `ProfilePicker` + `ProfileSetup` (ver sección 6).
7. Revisión final con el checklist.

Haz commit al terminar cada paso para poder revertir.

---

## 6. Perfiles y almacenamiento — DECISIÓN DEL EQUIPO

`entryStore` hoy no separa registros por persona. Dos opciones:

- **A (sin tocar `storage/`):** crear `src/profiles/profileStore.ts` **nuevo** (perfiles en `localStorage` bajo la llave `ahm.profiles` + `ahm.activeProfile`, con `useSyncExternalStore`). Los registros de salud siguen siendo un único set compartido. La pantalla de perfiles funciona para la demo; se dice en la presentación que la separación de datos por perfil es el siguiente paso.
- **B (requiere aprobación del equipo):** además, hacer que `entryStore` use una llave con prefijo del perfil activo (`entries:{profileId}`). Cambio pequeño, pero toca `storage/`.

**Implementa A por defecto.** Implementa B solo si te confirmo que el equipo lo aprobó.

Modelo de perfil:
```ts
type CrewProfile = {
  id: string
  name: string
  birthDate: string        // ISO yyyy-mm-dd
  role: 'Commander' | 'Pilot' | 'Flight engineer' | 'Mission specialist' | 'Payload specialist'
  callSign?: string
  avatar: 'helmet' | 'rocket' | 'planet' | 'satellite'
}
```
La edad se calcula siempre desde `birthDate`, nunca se guarda.

---

## 7. Checklist antes de entregar
- [ ] `grep` sin hex sueltos en `components/` y `screens/` (solo `var(--...)`).
- [ ] Ningún texto/valor médico hardcodeado; todo viene de ficha o `StatusResult`.
- [ ] Cada estado tiene ícono + texto; puntos de la gráfica cambian de forma.
- [ ] Aviso legal visible en todas las pantallas.
- [ ] Toda la UI en inglés.
- [ ] Sin rutas de URL; recarga en GitHub Pages no rompe.
- [ ] Con `prefers-reduced-motion: reduce` no hay meteoros ni animaciones.
- [ ] Navegable con teclado y foco visible en todo.
- [ ] Se ve bien a 320px, 768px y 1280px.
- [ ] Los 3 escenarios demo funcionan (Normal, Gradual decline, Acute event).
- [ ] `npm run build` sin errores de TypeScript.
