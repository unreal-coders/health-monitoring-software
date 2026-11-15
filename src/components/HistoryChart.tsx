// Values over time. Each point shows its status by color AND shape:
// circle = normal, diamond = caution, square = critical, hollow circle = no status.
// No reference bands: thresholds stay in the sheets.
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Point } from '../domain/history.ts'
import type { StatusKind } from '../domain/types.ts'
import { formatDateTime, formatDay } from './format.ts'
import { KIND_TEXT } from './statusText.ts'
import './history.css'

interface DotProps {
  cx?: number
  cy?: number
  payload?: Point
}

/** One status marker, also used by the legend. */
export function StatusShape({ kind, cx, cy, size = 6 }: { kind: StatusKind; cx: number; cy: number; size?: number }) {
  const className = `dot dot-${kind}`
  if (kind === 'green') return <circle className={className} cx={cx} cy={cy} r={size} />
  if (kind === 'yellow') {
    const r = size * 1.3
    return <polygon className={className} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} />
  }
  if (kind === 'red') return <rect className={className} x={cx - size} y={cy - size} width={size * 2} height={size * 2} />
  return <circle className={`${className} dot-hollow`} cx={cx} cy={cy} r={size - 1} />
}

function StatusDot({ cx, cy, payload }: DotProps) {
  if (cx === undefined || cy === undefined || !payload) return null
  return <StatusShape kind={payload.kind} cx={cx} cy={cy} />
}

interface TooltipProps {
  active?: boolean
  payload?: { payload: Point }[]
  unit: string | null
}

function ChartTooltip({ active, payload, unit }: TooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="chart-tooltip">
      <p className="label-mono">{formatDateTime(point.time)}</p>
      <p>
        <span className="num chart-tooltip-value">{point.value}</span>
        {unit && <span className="chart-tooltip-unit"> {unit}</span>}
      </p>
      <p className={`chart-tooltip-status kind-${point.kind}`}>{KIND_TEXT[point.kind]}</p>
    </div>
  )
}

interface HistoryChartProps {
  points: readonly Point[]
  unit: string | null
  /** Accessible name, e.g. "Blood glucose history". */
  label: string
}

const LEGEND: { kind: StatusKind; text: string }[] = [
  { kind: 'green', text: 'Normal (circle)' },
  { kind: 'yellow', text: 'Caution (diamond)' },
  { kind: 'red', text: 'Critical (square)' },
]

export function HistoryChart({ points, unit, label }: HistoryChartProps) {
  const hasNoStatus = points.some((point) => point.kind === 'no-reference' || point.kind === 'missing')

  return (
    <figure className="history-chart">
      <div className="history-chart-plot" role="img" aria-label={`${label}: ${points.length} readings`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points as Point[]} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatDay(Number(value))}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis width={44} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
              isAnimationActive={false}
              dot={(props: DotProps & { index?: number }) => (
                <StatusDot key={props.index} cx={props.cx} cy={props.cy} payload={props.payload} />
              )}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="history-legend">
        {LEGEND.map((item) => (
          <span key={item.kind} className="history-legend-item">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <StatusShape kind={item.kind} cx={8} cy={8} size={4.5} />
            </svg>
            {item.text}
          </span>
        ))}
        {hasNoStatus && (
          <span className="history-legend-item">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <StatusShape kind="no-reference" cx={8} cy={8} size={4.5} />
            </svg>
            No status (hollow circle)
          </span>
        )}
      </figcaption>
    </figure>
  )
}
