import type { CSSProperties } from 'react'
import type { OverallKind } from '../domain/health.ts'

export type Tone = 'green' | 'yellow' | 'red' | 'none'

export interface Segment {
  id: string
  name: string
  valueText: string
  unit: string
  tone: Tone
}

interface RadialHealthProps {
  segments: readonly Segment[]
  selectedId: string | null
  overall: OverallKind
  overallLabel: string
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

const SIZE = 400
const CENTER = SIZE / 2
const R_CORE = 96
const R_IN = 110
const R_OUT = 196
const R_LABEL = 153
const HALF_SPAN = 21 // degrees on each side of a wedge's center, leaving a small gap

const TONE_COLOR: Record<Tone, string> = {
  green: 'var(--color-status-normal)',
  yellow: 'var(--color-status-caution)',
  red: 'var(--color-status-critical)',
  none: 'var(--color-status-missing)',
}

const OVERALL_COLOR: Record<OverallKind, string> = {
  green: 'var(--color-status-normal)',
  yellow: 'var(--color-status-caution)',
  red: 'var(--color-status-critical)',
  missing: 'var(--color-status-missing)',
}

/** Point at radius r, angle in degrees clockwise from the top. */
function polar(radius: number, degrees: number): { x: number; y: number } {
  const radians = (degrees * Math.PI) / 180
  return { x: CENTER + radius * Math.sin(radians), y: CENTER - radius * Math.cos(radians) }
}

function wedgePath(center: number): string {
  const start = polar(R_OUT, center - HALF_SPAN)
  const end = polar(R_OUT, center + HALF_SPAN)
  const innerEnd = polar(R_IN, center + HALF_SPAN)
  const innerStart = polar(R_IN, center - HALF_SPAN)
  return [
    `M ${start.x} ${start.y}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

/** Eight wedges, one per metric. Each wedge shows its own status; the core shows the overall one. */
export function RadialHealth({ segments, selectedId, overall, overallLabel, onSelect, onHover }: RadialHealthProps) {
  const overallColor = OVERALL_COLOR[overall]
  const coreStyle = {
    '--glow': overallColor,
    fill: `color-mix(in srgb, ${overallColor} 18%, var(--color-surface))`,
    stroke: overallColor,
    strokeWidth: 2,
  } as CSSProperties

  return (
    <svg className="radial" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Health indicators">
      {segments.map((segment, index) => {
        const center = index * 45
        const label = polar(R_LABEL, center)
        const color = TONE_COLOR[segment.tone]
        const selected = segment.id === selectedId
        return (
          <g
            key={segment.id}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${segment.name}: ${segment.valueText} ${segment.unit}`}
            className={selected ? 'radial-segment is-selected' : 'radial-segment'}
            onClick={() => onSelect(segment.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(segment.id)
              }
            }}
            onMouseEnter={() => onHover(segment.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(segment.id)}
            onBlur={() => onHover(null)}
          >
            <path
              className="radial-wedge"
              d={wedgePath(center)}
              style={{ fill: `color-mix(in srgb, ${color} 22%, var(--color-surface))`, stroke: color }}
            />
            <text className="radial-name" x={label.x} y={label.y - 10}>
              {segment.name}
            </text>
            <text className="radial-value" x={label.x} y={label.y + 8}>
              {segment.valueText}
            </text>
            <text className="radial-unit" x={label.x} y={label.y + 24}>
              {segment.unit}
            </text>
          </g>
        )
      })}
      <circle className="radial-core" cx={CENTER} cy={CENTER} r={R_CORE} style={coreStyle} />
      <text className="radial-core-label" x={CENTER} y={CENTER}>
        {overallLabel}
      </text>
      <text className="radial-core-sub" x={CENTER} y={CENTER + 22}>
        Overall status
      </text>
    </svg>
  )
}