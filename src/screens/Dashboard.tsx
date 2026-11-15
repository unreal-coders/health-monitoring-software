// Health overview: the wheel of indicators and, below it, one card with the
// global alert, the indicators to review, and the selected indicator. The side
// column holds the space garden and the demo data controls. Register and
// Charts float at the bottom right, above the disclaimer.
// Every status comes from the sheets through domain/ (see safeStatus.ts).
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
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
import { buildEntries, SCENARIOS } from './quickScenarios.ts'
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
  const [now, setNow] = useState(() => new Date())
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId ?? INDICATOR_IDS[0])
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const confirmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (confirmClear) confirmRef.current?.focus()
  }, [confirmClear])

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

  const loadScenario = (id: string) => {
    const scenario = SCENARIOS.find((candidate) => candidate.id === id)
    if (!scenario) return
    const at = new Date()
    entryStore.replaceEntries(buildEntries(scenario, at))
    setNow(at)
    setScenarioId(id)
  }

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
        </section>

        <aside className="dash-side">
          <SpacePlant readings={entries.length} streak={streak} hasCritical={critical.length > 0} />

          <section className="card demo-card" aria-labelledby="demo-title">
            <h2 id="demo-title" className="card-title">
              Demo data
            </h2>
            <p className="muted">Load a synthetic scenario. It replaces the readings saved on this device.</p>
            <div className="segmented demo-segmented" role="group" aria-label="Demo scenario">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  className="segmented-option"
                  aria-pressed={scenario.id === scenarioId}
                  onClick={() => loadScenario(scenario.id)}
                >
                  {scenario.label}
                </button>
              ))}
            </div>

            {confirmClear ? (
              <div
                ref={confirmRef}
                tabIndex={-1}
                className="alert alert-caution clear-confirm"
                role="alertdialog"
                aria-labelledby="clear-title"
              >
                <p id="clear-title" className="clear-title">
                  Delete all saved readings?
                </p>
                <p className="muted">This removes every reading on this device. It cannot be undone.</p>
                <div className="clear-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-danger"
                    onClick={() => {
                      entryStore.clearEntries()
                      setScenarioId(null)
                      setConfirmClear(false)
                    }}
                  >
                    Delete readings
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-secondary dash-clear" onClick={() => setConfirmClear(true)}>
                Clear all readings
              </button>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
