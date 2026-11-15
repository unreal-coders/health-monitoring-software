// Health overview: the wheel of indicators (each segment is a keyboard-focusable
// button), and a side column with one card (global alert, selected indicator)
// above the space garden. Register and Charts float at the bottom left, above
// the disclaimer. Each demo profile loads its own scenario when it is picked
// (see App.tsx), so the dashboard has no scenario selector.
// Every status comes from the sheets through domain/ (see safeStatus.ts).
import { useState, useSyncExternalStore } from 'react'
import { getSheet } from '../catalog/sheets.ts'
import { EscalationAlert } from '../components/EscalationAlert.tsx'
import { RadialHealth, type Segment } from '../components/RadialHealth.tsx'
import { SpacePlant } from '../components/SpacePlant.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { PhoneIcon, StatusIcon } from '../components/icons.tsx'
import { shortUnit } from '../components/format.ts'
import { overallStatus, streakDays } from '../domain/health.ts'
import type { StatusKind } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'
import type { DetailMode } from './IndicatorDetail.tsx'
import { INDICATOR_IDS } from './indicators.ts'
import { safeStatus, valueText } from './safeStatus.ts'
import './dashboard.css'


interface CriticalItem {
  id: string
  name: string
  kind: StatusKind
}

interface DashboardProps {
  /** Opens one indicator in the register, charts, or guidance view. */
  onOpenDetail: (id: string, mode: DetailMode) => void
  /** Indicator selected when the screen opens, e.g. the one the user came back from. */
  initialSelectedId?: string | null
}

export function Dashboard({ onOpenDetail, initialSelectedId = null }: DashboardProps) {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  const [now] = useState(() => new Date())
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId ?? INDICATOR_IDS[0])

  const indicators = INDICATOR_IDS.map((id) => {
    const sheet = getSheet(id)
    return { sheet, result: safeStatus(sheet, entries, now) }
  })
  const results = indicators.map((indicator) => indicator.result)
  const overall = overallStatus(results)
  const streak = streakDays(entries, now)

  const critical: CriticalItem[] = indicators
    .filter(({ result }) => result.kind === 'red')
    .map(({ sheet, result }) => ({ id: sheet.id, name: sheet.name, kind: result.kind }))

  const segments: Segment[] = indicators.map(({ sheet, result }) => ({
    id: sheet.id,
    name: sheet.name,
    valueText: valueText(result),
    unit: shortUnit(sheet.unit),
    kind: result.kind,
  }))

  const selected = indicators.find(({ sheet }) => sheet.id === selectedId) ?? indicators[0]

  return (
    <div className="dash-root">
      <header className="dash-header">
        <p className="label-mono">Biometric link: simulated</p>
        <h1 className="dash-title">Health overview</h1>
      </header>

      {/* In the DOM right after the title, so the tab order is unchanged; shown fixed at the bottom left. */}
      <div className="fab" role="group" aria-label="Quick actions">
        <button type="button" className="btn btn-primary" onClick={() => onOpenDetail(selected.sheet.id, 'register')}>
          Register
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onOpenDetail(selected.sheet.id, 'charts')}>
          Charts
        </button>
      </div>

      {/* Grid: garden | wheel | card on wide screens. The DOM order (wheel, card, garden)
          is the reading, tab, and phone order. */}
      <div className="dash">
        <section className="dash-wheel" aria-label="Indicators">
          <RadialHealth segments={segments} selectedId={selected.sheet.id} overall={overall} onSelect={setSelectedId} />
        </section>

        <article className="card selected-card dash-card" aria-labelledby="selected-name">
          {/* a) Global alert: shown whenever any indicator is critical, whatever is selected. */}
          {critical.length > 0 && (
            <div role="alert" className="alert alert-critical global-alert">
              <p className="global-alert-title">
                <PhoneIcon size={18} />
                Contact the flight surgeon
              </p>
              <ul className="global-alert-list" aria-label="Critical indicators">
                {critical.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="review-chip kind-red"
                      aria-pressed={item.id === selected.sheet.id}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <StatusIcon kind="red" size={12} />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* b) The selected indicator. Everything comes from the sheet or the StatusResult. */}
          <div className="selected" aria-live="polite">
            <p className="label-mono">{selected.sheet.domain}</p>
            <h2 id="selected-name" className="selected-name">
              {selected.sheet.name}
            </h2>
            <StatusBadge kind={selected.result.kind} outdated={selected.result.outdated} />
            {selected.result.evaluated && (
              <p className="selected-value">
                <span className="num">{valueText(selected.result)}</span>
                {selected.sheet.unit && <span className="selected-unit">{selected.sheet.unit}</span>}
              </p>
            )}
            {selected.result.label && <p className="selected-label">{selected.result.label}</p>}
            <p className="selected-text">{selected.result.text}</p>
            {selected.result.kind === 'missing' && selected.sheet.astronaut_text.how_to && (
              <p className="muted">{selected.sheet.astronaut_text.how_to}</p>
            )}
          </div>

          {/* c) The selected indicator's escalation, when its status asks for it. */}
          {/* A red indicator is already covered by the global alert above, so it gets no second
              "Contact the flight surgeon" here. Yellow with contact and no-reference still show it.
              The register, charts, and guidance views keep their escalation alert as is. */}
          {selected.result.kind !== 'red' && (
            <EscalationAlert result={selected.result} noContactText={selected.sheet.astronaut_text.no_contact} />
          )}

          {/* d) Actions. */}
          <div className="selected-actions">
            <button type="button" className="link-action" onClick={() => onOpenDetail(selected.sheet.id, 'guidance')}>
              View details
            </button>
          </div>
        </article>

        <div className="dash-garden">
          <SpacePlant readings={entries.length} streak={streak} hasCritical={critical.length > 0} />
        </div>
      </div>
    </div>
  )
}
