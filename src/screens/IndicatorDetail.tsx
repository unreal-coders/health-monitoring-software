// One indicator, in one of three views:
// - register: the entry form (opened by the floating Register button)
// - charts:   the history chart and latest readings (floating Charts button)
// - guidance: the sheet's guidance and what each status means ("View details")
// All views share "Back to overview", the header (domain, name, current value,
// status), and the escalation alert. All medical text comes from the sheet or
// the StatusResult.
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { getSheet } from '../catalog/sheets.ts'
import { EntryForm } from '../components/EntryForm.tsx'
import { EscalationAlert } from '../components/EscalationAlert.tsx'
import { GuidancePanel } from '../components/GuidancePanel.tsx'
import { HistoryChart } from '../components/HistoryChart.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { formatDateTime } from '../components/format.ts'
import { StatusIcon } from '../components/icons.tsx'
import type { IndicatorSheet, StatusResult } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'
import { historyPoints, latestReadings } from './history.ts'
import { INDICATOR_IDS } from './indicators.ts'
import { safeStatus, valueText } from './safeStatus.ts'
import './detail.css'

export type DetailMode = 'register' | 'charts' | 'guidance'

const RANGES = [
  { id: '7', label: '7 days', days: 7 },
  { id: '14', label: '14 days', days: 14 },
  { id: 'all', label: 'All', days: null },
] as const

type RangeId = (typeof RANGES)[number]['id']

const DAY = 24 * 60 * 60 * 1000

/** The chart plots the sheet's first field; name it when the sheet has several (e.g. "Systolic"). */
function seriesLabel(sheet: IndicatorSheet): string | undefined {
  const first = sheet.fields && sheet.fields.length > 1 ? sheet.fields[0] : undefined
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : undefined
}

interface IndicatorDetailProps {
  sheet: IndicatorSheet
  mode: DetailMode
  /** Switches the indicator shown in the register and charts views. */
  onChangeIndicator: (id: string) => void
  onBack: () => void
}

export function IndicatorDetail({ sheet, mode, onChangeIndicator, onBack }: IndicatorDetailProps) {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  const [now] = useState(() => new Date())
  const result = safeStatus(sheet, entries, now)
  // Focus moves into the view only when it opens, not when the selector changes the indicator.
  const [opening, setOpening] = useState(true)
  const topRef = useRef<HTMLButtonElement>(null)
  const historyRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (mode === 'charts') historyRef.current?.focus()
    else if (mode === 'guidance') topRef.current?.focus()
    // The register view focuses its first field through EntryForm's autoFocus.
  }, [mode])

  const changeIndicator = (id: string) => {
    setOpening(false)
    onChangeIndicator(id)
  }

  return (
    <div className={`detail detail-${mode}`}>
      <button ref={topRef} type="button" className="link-action detail-back" onClick={onBack}>
        Back to overview
      </button>

      <header className="detail-header">
        <div>
          <p className="label-mono">{sheet.domain}</p>
          <h1 className="detail-name">{sheet.name}</h1>
        </div>
        <div className="detail-status">
          {result.evaluated && (
            <p className="detail-current">
              <span className="num">{valueText(result)}</span>
              {sheet.unit && <span className="detail-current-unit">{sheet.unit}</span>}
            </p>
          )}
          <StatusBadge kind={result.kind} outdated={result.outdated} size="lg" />
          {result.label && <p className="detail-label">{result.label}</p>}
        </div>
      </header>

      <EscalationAlert result={result} noContactText={sheet.astronaut_text.no_contact} />

      {mode !== 'guidance' && <IndicatorSelect value={sheet.id} onChange={changeIndicator} />}

      {mode === 'register' && (
        <section className="card detail-form-card" aria-labelledby="log-title">
          <h2 id="log-title" className="card-title detail-card-title">
            Log a reading
          </h2>
          <EntryForm key={sheet.id} sheet={sheet} autoFocus={opening} />
        </section>
      )}

      {mode === 'charts' && <HistoryView sheet={sheet} now={now} headingRef={historyRef} />}

      {mode === 'guidance' && (
        <div className="detail-columns">
          <div className="detail-left">
            <GuidancePanel sheet={sheet} result={result} />
          </div>
          <div className="detail-right">
            <StatusMeaning sheet={sheet} result={result} />
          </div>
        </div>
      )}
    </div>
  )
}

/** Picks which indicator the register and charts views show. */
function IndicatorSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <label className="form-field detail-select">
      <span className="form-label">Indicator</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {INDICATOR_IDS.map((id) => (
          <option key={id} value={id}>
            {getSheet(id).name}
          </option>
        ))}
      </select>
    </label>
  )
}

interface HistoryViewProps {
  sheet: IndicatorSheet
  now: Date
  headingRef: RefObject<HTMLHeadingElement | null>
}

function HistoryView({ sheet, now, headingRef }: HistoryViewProps) {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  const [rangeId, setRangeId] = useState<RangeId>('7')
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[0]
  const allPoints = historyPoints(sheet, entries, now)
  const points = range.days === null ? allPoints : allPoints.filter((p) => p.time >= now.getTime() - range.days * DAY)
  const readings = latestReadings(sheet, entries, now)

  return (
    <section className="card detail-history" aria-labelledby="history-title">
      <div className="detail-card-head">
        <h2 id="history-title" ref={headingRef} tabIndex={-1} className="card-title">
          History
        </h2>
        <div className="segmented" role="group" aria-label="Time range">
          {RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="segmented-option"
              aria-pressed={item.id === rangeId}
              onClick={() => setRangeId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {points.length > 0 ? (
        <HistoryChart points={points} unit={sheet.unit} label={`${sheet.name} history`} seriesLabel={seriesLabel(sheet)} />
      ) : (
        <p className="muted">{allPoints.length > 0 ? 'No readings in this time range.' : sheet.astronaut_text.missing}</p>
      )}

      {readings.length > 0 && (
        <div className="readings">
          <p className="label-mono">Latest readings</p>
          <ul className="readings-list">
            {readings.map((reading) => (
              <li key={reading.key} className="readings-row">
                <span className="readings-time">{formatDateTime(reading.time)}</span>
                <span className="num readings-value">{reading.value}</span>
                <StatusBadge kind={reading.kind} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

/** Every rule of the sheet, with the current one marked. */
function StatusMeaning({ sheet, result }: { sheet: IndicatorSheet; result: StatusResult }) {
  const rules = sheet.thresholds.rules
  return (
    <section className="card" aria-labelledby="meaning-title">
      <h2 id="meaning-title" className="card-title detail-card-title">
        What the status means
      </h2>
      {rules.length > 0 ? (
        <ul className="rules">
          {rules.map((rule) => {
            const current = rule === result.rule
            return (
              <li key={`${rule.color}-${rule.when}`} className={`rule kind-${rule.color}${current ? ' is-current' : ''}`}>
                <StatusIcon kind={rule.color} size={16} />
                <span className="rule-label">{rule.label}</span>
                {current && <span className="label-mono rule-current">Current</span>}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="muted">{sheet.astronaut_text.no_reference ?? sheet.thresholds.note}</p>
      )}
    </section>
  )
}
