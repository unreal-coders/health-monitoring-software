import { useCallback, useState, useSyncExternalStore } from 'react'
import { getSheet } from '../catalog/sheets.ts'
import { EntryForm } from '../components/EntryForm.tsx'
import { HistoryChart } from '../components/HistoryChart.tsx'
import { MetricDetail, type Trend } from '../components/MetricDetail.tsx'
import { Modal } from '../components/Modal.tsx'
import { RadialHealth, type Segment } from '../components/RadialHealth.tsx'
import { SpacePlant } from '../components/SpacePlant.tsx'
import { StatusPanel } from '../components/StatusPanel.tsx'
import { evaluateStatus } from '../domain/evaluate.ts'
import { toPoints } from '../domain/history.ts'
import { overallStatus, plantGrowth, streakDays, type OverallKind } from '../domain/health.ts'
import type { Entry, IndicatorSheet, StatusResult } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'
import { buildEntries, SCENARIOS } from './quickScenarios.ts'
import './dashboard.css'

// The eight metrics of the dashboard, in clockwise order from the top.
const METRICS = [
  { id: 'heart-rate', unit: 'bpm' },
  { id: 'blood-pressure', unit: 'mmHg' },
  { id: 'oxygen-saturation', unit: '%' },
  { id: 'blood-glucose', unit: 'mg/dL' },
  { id: 'body-temperature', unit: '°C' },
  { id: 'immune-symptoms', unit: 'signs' },
  { id: 'sleep-hours', unit: 'hours' },
  { id: 'mood', unit: 'points of 6' },
] as const

type MetricId = (typeof METRICS)[number]['id']
type ModalKind = 'charts' | 'register' | null

const OVERALL_LABEL: Record<OverallKind, string> = {
  green: 'Optimal',
  yellow: 'Caution',
  red: 'Critical',
  missing: 'No data',
}

function valueOf(result: StatusResult): string {
  return result.evaluated ? Object.values(result.evaluated).join('/') : '—'
}

/** Direction of the last change, from the chart's points. Null when there are fewer than two. */
function trendOf(sheet: IndicatorSheet, entries: readonly Entry[], now: Date): Trend {
  const points = toPoints(sheet, entries, now)
  const last = points.at(-1)
  const previous = points.at(-2)
  if (!last || !previous) return null
  const difference = last.value - previous.value
  if (Math.abs(difference) < 1e-9) return 'stable'
  return difference > 0 ? 'up' : 'down'
}

interface DashboardProps {
  onOpenDetail: (id: string) => void
}

export function Dashboard({ onOpenDetail }: DashboardProps) {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  const [now] = useState(() => new Date())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalKind>(null)
  const [chartId, setChartId] = useState<MetricId>('heart-rate')
  const [registerId, setRegisterId] = useState<MetricId>('heart-rate')

  const closeModal = useCallback(() => setModal(null), [])
  const selectSegment = useCallback(
    (id: string) => setSelectedId((current) => (current === id ? null : id)),
    [],
  )

  const metrics = METRICS.map((metric) => {
    const sheet = getSheet(metric.id)
    return { ...metric, sheet, result: evaluateStatus(sheet, entries, now) }
  })
  const results = metrics.map((metric) => metric.result)
  const overall = overallStatus(results)
  const covered = results.filter((result) => result.kind !== 'missing' && !result.outdated).length
  const streak = streakDays(entries, now)
  const growth = plantGrowth(covered, METRICS.length, streak)
  const flagged = metrics
    .filter((metric) => metric.result.color === 'yellow' || metric.result.color === 'red')
    .map((metric) => metric.sheet.name)
  const contact = results.some((result) => result.contactFlightSurgeon === true)

  const segments: Segment[] = metrics.map((metric) => ({
    id: metric.sheet.id,
    name: metric.sheet.name,
    valueText: valueOf(metric.result),
    unit: metric.unit,
    tone: metric.result.color ?? 'none',
  }))

  // Hovering or focusing a segment previews it; clicking keeps it selected.
  const focusId = hoverId ?? selectedId
  const focused = metrics.find((metric) => metric.sheet.id === focusId)

  return (
    <div className="dash-root">
      <div className="dash">
        <section className="dash-main" aria-label="Crew status">
          <div className="dash-profile">
            <div className="avatar" tabIndex={0} aria-label="Crew member profile">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
              </svg>
              <span className="avatar-tip">Crew member · rank pending</span>
            </div>
            <div>
              <p className="dash-name">Crew member</p>
              <p className="muted">Biometric link: simulated</p>
            </div>
          </div>

          <RadialHealth
            segments={segments}
            selectedId={selectedId}
            overall={overall}
            overallLabel={OVERALL_LABEL[overall]}
            onSelect={selectSegment}
            onHover={setHoverId}
          />

          <div className="detail-slot">
            {focused ? (
              <MetricDetail
                sheet={focused.sheet}
                result={focused.result}
                trend={trendOf(focused.sheet, entries, now)}
                unit={focused.unit}
                selected={focused.sheet.id === selectedId}
                onOpenDetail={() => onOpenDetail(focused.sheet.id)}
              />
            ) : (
              <p className="muted">Hover or select a segment to see its details.</p>
            )}
          </div>

          <div className="dash-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModal('charts')}>
              Charts
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setModal('register')}>
              Register
            </button>
          </div>
        </section>

        <aside className="dash-side">
          <StatusPanel overall={overall} label={OVERALL_LABEL[overall]} flagged={flagged} contact={contact} />
          <SpacePlant growth={growth} streak={streak} overall={overall} />
        </aside>
      </div>

      <details className="card dash-sim">
        <summary>Test panel</summary>
        <p className="muted">
          Replaces the saved entries with a test scenario. Use it for demonstrations only.
        </p>
        <div className="dash-actions">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className="btn btn-secondary"
              onClick={() => entryStore.replaceEntries(buildEntries(scenario, new Date()))}
            >
              {scenario.label}
            </button>
          ))}
          <button type="button" className="btn btn-secondary" onClick={() => entryStore.clearEntries()}>
            Clear
          </button>
        </div>
      </details>

      {modal === 'charts' && (
        <Modal title="History" onClose={closeModal}>
          <label className="field">
            <span>Indicator</span>
            <select value={chartId} onChange={(event) => setChartId(event.target.value as MetricId)}>
              {METRICS.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {getSheet(metric.id).name}
                </option>
              ))}
            </select>
          </label>
          <HistoryChart sheet={getSheet(chartId)} entries={entries} now={now} />
        </Modal>
      )}

      {modal === 'register' && (
        <Modal title="Register a reading" onClose={closeModal}>
          <label className="field">
            <span>Indicator</span>
            <select value={registerId} onChange={(event) => setRegisterId(event.target.value as MetricId)}>
              {METRICS.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {getSheet(metric.id).name}
                </option>
              ))}
            </select>
          </label>
          <EntryForm key={registerId} sheet={getSheet(registerId)} />
        </Modal>
      )}
    </div>
  )
}