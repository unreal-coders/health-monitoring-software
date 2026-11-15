// Health wheel: one segment per indicator, colored ONLY by that indicator's
// status kind (never by domain). The center shows the overall status.
// Keyboard users select indicators with the chips under the wheel, so the
// segments are pointer-only and the SVG is hidden from assistive tech.
import type { OverallKind } from '../domain/health.ts'
import type { StatusKind } from '../domain/types.ts'
import { KIND_SYMBOL, KIND_TEXT } from './statusText.ts'
import './radial.css'

export interface Segment {
  id: string
  name: string
  valueText: string
  unit: string | null
  kind: StatusKind
}

interface RadialHealthProps {
  segments: readonly Segment[]
  selectedId: string | null
  overall: OverallKind
  onSelect: (id: string) => void
}

const SIZE = 600
const C = SIZE / 2
const R_OUT = 290
const R_IN = 150
const R_TEXT = 222
const START = -110 // degrees, SVG convention (0 = right, clockwise): the first segment is centered at the top
const GAP = 1.6

function point(radius: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180
  return [C + radius * Math.cos(radians), C + radius * Math.sin(radians)]
}

function segmentPath(from: number, to: number): string {
  const [x1, y1] = point(R_OUT, from)
  const [x2, y2] = point(R_OUT, to)
  const [x3, y3] = point(R_IN, to)
  const [x4, y4] = point(R_IN, from)
  return `M ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 0 0 ${x4} ${y4} Z`
}

export function RadialHealth({ segments, selectedId, overall, onSelect }: RadialHealthProps) {
  const span = 360 / Math.max(segments.length, 1)

  return (
    <svg className="radial" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
      {segments.map((segment, index) => {
        const from = START + index * span + GAP / 2
        const to = START + (index + 1) * span - GAP / 2
        const [x, y] = point(R_TEXT, (from + to) / 2)
        const selected = segment.id === selectedId
        return (
          <g
            key={segment.id}
            className={`radial-segment kind-${segment.kind}${selected ? ' is-selected' : ''}`}
            onClick={() => onSelect(segment.id)}
          >
            <path className="radial-wedge" d={segmentPath(from, to)} />
            <text className="radial-name" x={x} y={y - 38}>
              {segment.name}
            </text>
            <text className="radial-value" x={x} y={y - 12}>
              {segment.valueText}
            </text>
            {segment.unit && segment.kind !== 'missing' && (
              <text className="radial-unit" x={x} y={y + 11}>
                {segment.unit}
              </text>
            )}
            <text className="radial-status" x={x} y={y + 34}>
              <tspan className="radial-symbol">{KIND_SYMBOL[segment.kind]}</tspan>
              <tspan className="radial-word" dx="6">
                {KIND_TEXT[segment.kind]}
              </tspan>
            </text>
          </g>
        )
      })}

      <circle className="radial-core-outer" cx={C} cy={C} r={142} />
      <circle className={`radial-core kind-${overall}`} cx={C} cy={C} r={128} />
      <text className={`radial-core-icon kind-${overall}`} x={C} y={C - 30}>
        {KIND_SYMBOL[overall]}
      </text>
      <text className={`radial-core-label kind-${overall}`} x={C} y={C + 14}>
        {KIND_TEXT[overall]}
      </text>
      <text className="radial-core-sub" x={C} y={C + 44}>
        Overall status
      </text>
    </svg>
  )
}
