// Health overview: the wheel of indicators with its keyboard chips, and a side
// column with one card (global alert, indicators to review, selected indicator)
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
import { KIND_TEXT } from '../components/statusText.ts'
import { shortUnit } from '../components/format.ts'
import { overallStatus, streakDays } from '../domain/health.ts'
import type { StatusKind } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'
import type { DetailFocus } from './IndicatorDetail.tsx'
import { safeStatus, valueText } from './safeStatus.ts'
import './dashboard.css'

// The wheel's order, clockwise from the top.
const INDICATOR_IDS = [
  'heart-rate',
  'blood-pressure',
  'oxygen-saturation',
  'blood-glucose',
  'body-temperature',
  'immune-symptoms',
  'exercise',
  'sleep-hours',
  'mood',
] as const

interface ReviewItem {
  id: string
  name: string
  kind: StatusKind
}

interface DashboardProps {
  onOpenDetail: (id: string, focus?: DetailFocus) => void
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

  const review: ReviewItem[] = indicators
    .filter(({ result }) => result.kind === 'red' || result.kind === 'yellow')
    .sort((a, b) => (a.result.kind === 'red' ? 0 : 1) - (b.result.kind === 'red' ? 0 : 1))
    .map(({ sheet, result }) => ({ id: sheet.id, name: sheet.name, kind: result.kind }))
  const critical = review.filter((item) => item.kind === 'red')

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

      {/* In the DOM right after the title, so the tab order is unchanged; shown fixed at the bottom right. */}
      <div className="fab" role="group" aria-label="Quick actions">
        <button type="button" className="btn btn-primary" onClick={() => onOpenDetail(selected.sheet.id, 'form')}>
          Register
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onOpenDetail(selected.sheet.id, 'chart')}>
          Charts
        </button>
      </div>

      <div className="dash">
        <section className="dash-main" aria-label="Indicators">
          <RadialHealth segments={segments} selectedId={selected.sheet.id} overall={overall} onSelect={setSelectedId} />

          <ul className="chips" aria-label="Select an indicator">
            {indicators.map(({ sheet, result }) => (
              <li key={sheet.id}>
                <button
                  type="button"
                  className={`chip kind-${result.kind}`}
                  aria-pressed={sheet.id === selected.sheet.id}
                  onClick={() => setSelectedId(sheet.id)}
                >
                  <StatusIcon kind={result.kind} size={12} />
                  {sheet.name}
                  <span className="visually-hidden">, {KIND_TEXT[result.kind]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="dash-side">
          <article className="card selected-card" aria-labelledby="selected-name">
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

            {/* b) Indicators to review, critical first. */}
            {review.length > 0 && (
              <div className="review">
                <p className="label-mono">Review</p>
                <ul className="review-chips">
                  {review.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`review-chip kind-${item.kind}`}
                        aria-pressed={item.id === selected.sheet.id}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <StatusIcon kind={item.kind} size={12} />
                        {item.name}
                        <span className="visually-hidden">, {KIND_TEXT[item.kind]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* c) The selected indicator. Everything comes from the sheet or the StatusResult. */}
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

            {/* d) The selected indicator's escalation, when its status asks for it. */}
            <EscalationAlert result={selected.result} noContactText={selected.sheet.astronaut_text.no_contact} />

            {/* e) Actions. */}
            <div className="selected-actions">
              <button type="button" className="link-action" onClick={() => onOpenDetail(selected.sheet.id)}>
                View details
              </button>
              <button type="button" className="link-action" onClick={() => onOpenDetail(selected.sheet.id, 'form')}>
                Log this indicator
              </button>
            </div>
          </article>

          <SpacePlant readings={entries.length} streak={streak} hasCritical={critical.length > 0} />
        </aside>
      </div>
    </div>
  )
}
