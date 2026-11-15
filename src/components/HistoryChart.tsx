import type { CSSProperties } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toPoints, type Point } from '../domain/history.ts'
import type { Entry, IndicatorSheet, StatusKind } from '../domain/types.ts'

const DOT_COLOR: Record<StatusKind, string> = {
  green: 'var(--color-status-normal)',
  yellow: 'var(--color-status-caution)',
  red: 'var(--color-status-critical)',
  'no-reference': 'var(--color-status-missing)',
  missing: 'var(--color-status-missing)',
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