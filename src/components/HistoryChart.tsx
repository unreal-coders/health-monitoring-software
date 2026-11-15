import type { CSSProperties } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { entryValues, evaluateStatus } from '../domain/evaluate.ts'
import type { Entry, IndicatorSheet, StatusKind } from '../domain/types.ts'

export interface Point {
  time: number
  value: number
  kind: StatusKind
}

const DOT_COLOR: Record<StatusKind, string> = {
  green: 'var(--color-status-normal)',
  yellow: 'var(--color-status-caution)',
  red: 'var(--color-status-critical)',
  'no-reference': 'var(--color-status-missing)',
  missing: 'var(--color-status-missing)',
}

/**
 * Points for the chart. Single readings are plotted one by one with their status.
 * Logs are summed per day and mission accumulations are running totals. Their
 * points get no status color, because the status applies to the day or the
 * mission, not to each entry.
 */
export function toPoints(sheet: IndicatorSheet, entries: readonly Entry[], now: Date): Point[] {
  const own = entries
    .filter((entry) => entry.indicatorId === sheet.id)
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))

  if (sheet.entry_kind === 'log') {
    const byDay = new Map<string, Point>()
    for (const entry of own) {
      const time = Date.parse(entry.takenAt)
      const day = new Date(time).toDateString()
      const total = (byDay.get(day)?.value ?? 0) + entryValues(sheet, entry).value
      byDay.set(day, { time, value: total, kind: 'no-reference' })
    }
    return [...byDay.values()]
  }

  if (sheet.accumulation === 'mission') {
    let total = 0
    return own.map((entry): Point => {
      total += entryValues(sheet, entry).value
      return { time: Date.parse(entry.takenAt), value: total, kind: 'no-reference' }
    })
  }

  const key = sheet.fields?.[0] ?? 'value'
  return own.map(
    (entry): Point => ({
      time: Date.parse(entry.takenAt),
      value: entryValues(sheet, entry)[key],
      kind: evaluateStatus(sheet, [entry], now).kind,
    }),
  )
}

function formatTime(time: number): string {
  return new Date(time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface DotProps {
  cx?: number
  cy?: number
  payload?: Point
}

function StatusDot({ cx, cy, payload }: DotProps) {
  if (cx === undefined || cy === undefined || !payload) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      style={{ fill: DOT_COLOR[payload.kind], stroke: 'var(--color-bg)', strokeWidth: 2 }}
    />
  )
}

interface HistoryChartProps {
  sheet: IndicatorSheet
  entries: readonly Entry[]
  now: Date
}

/** Values over time. Each dot is colored by the status of that reading. */
export function HistoryChart({ sheet, entries, now }: HistoryChartProps) {
  const points = toPoints(sheet, entries, now)
  if (points.length === 0) return <p style={mutedStyle}>{sheet.astronaut_text.missing}</p>

  return (
    <figure style={figureStyle}>
      <figcaption style={captionStyle}>
        History of {sheet.name}
        {sheet.unit ? ` (${sheet.unit})` : ''}
      </figcaption>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatTime(Number(value))}
              stroke="currentColor"
              fontSize={12}
            />
            <YAxis stroke="currentColor" fontSize={12} width={48} />
            <Tooltip labelFormatter={(label) => formatTime(Number(label))} contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              isAnimationActive={false}
              dot={(props) => <StatusDot {...props} />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

const figureStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-muted)',
}

const captionStyle: CSSProperties = {
  marginBottom: '0.5rem',
  fontSize: 'var(--font-size-sm)',
}

const mutedStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
}

const tooltipStyle: CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  color: 'var(--color-text)',
}