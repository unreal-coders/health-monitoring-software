import type { IndicatorSheet, StatusResult } from '../domain/types.ts'
import { StatusBadge } from './StatusBadge.tsx'

export type Trend = 'up' | 'down' | 'stable' | null

const TREND_TEXT: Record<'up' | 'down' | 'stable', string> = {
  up: 'Higher than the previous reading',
  down: 'Lower than the previous reading',
  stable: 'Same as the previous reading',
}

interface MetricDetailProps {
  sheet: IndicatorSheet
  result: StatusResult
  trend: Trend
  unit: string
  /** The button appears only for a selected segment, so the pointer can reach it. */
  selected: boolean
  onOpenDetail: () => void
}

export function MetricDetail({ sheet, result, trend, unit, selected, onOpenDetail }: MetricDetailProps) {
  const optimal = sheet.thresholds.rules.find((rule) => rule.color === 'green')?.label
  const value = result.evaluated ? Object.values(result.evaluated).join('/') : null

  return (
    <aside className="card detail-card" aria-label={`${sheet.name} details`}>
      <header className="detail-head">
        <h2 className="detail-title">{sheet.name}</h2>
        <StatusBadge kind={result.kind} label={result.label} />
      </header>
      {value !== null && (
        <p className="detail-value">
          {value} <span className="detail-unit">{unit}</span>
        </p>
      )}
      {optimal && <p className="muted">Optimal: {optimal}</p>}
      <p className="muted">{trend ? TREND_TEXT[trend] : 'Not enough readings to show a trend.'}</p>
      {result.outdated && <p className="note">Older than the recommended interval.</p>}
      {selected && (
        <button type="button" className="btn btn-secondary" onClick={onOpenDetail}>
          View details
        </button>
      )}
    </aside>
  )
}