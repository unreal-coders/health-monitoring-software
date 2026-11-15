// Health wheel: one segment per indicator, colored ONLY by that indicator's
// status kind (never by domain). The center shows the overall status.
// Each segment is a focusable button: Tab moves through the segments in the
// wheel's order, Enter or Space selects one, and its name is announced with
// its status (e.g. "Blood glucose, Critical"). Decorative layers are hidden
// from assistive tech.
//
// Glass effect: browsers don't support backdrop-filter on SVG shapes, so the
// frosted layer is a plain <div> per segment clipped to the segment's shape
// (clip-path: url(#clipPath)), and the SVG on top draws the glowing border,
// gloss, sparkle and text.
import { useId } from 'react'
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
const R_TEXT = 220 // middle of the ring: (R_IN + R_OUT) / 2
const R_CORE = 128
const R_CORE_OUTER = 142
const START = -110 // degrees, SVG convention (0 = right, clockwise): the first segment is centered at the top
const GAP = 1.6

function point(radius: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180
  return [C + radius * Math.cos(radians), C + radius * Math.sin(radians)]
}

// scale = 1 gives pixel coordinates for the SVG; scale = SIZE gives 0..1 coordinates for the clipPaths.
function segmentPath(from: number, to: number, scale = 1, rOut = R_OUT, rIn = R_IN): string {
  const s = (n: number) => +(n / scale).toFixed(5)
  const [x1, y1] = point(rOut, from)
  const [x2, y2] = point(rOut, to)
  const [x3, y3] = point(rIn, to)
  const [x4, y4] = point(rIn, from)
  return `M ${s(x1)} ${s(y1)} A ${s(rOut)} ${s(rOut)} 0 0 1 ${s(x2)} ${s(y2)} L ${s(x3)} ${s(y3)} A ${s(rIn)} ${s(rIn)} 0 0 0 ${s(x4)} ${s(y4)} Z`
}

/** Gap between a segment and its keyboard focus ring, in SVG units. */
const FOCUS_OFFSET = 6

export function RadialHealth({ segments, selectedId, overall, onSelect }: RadialHealthProps) {
  const uid = useId().replace(/:/g, '')
  const span = 360 / Math.max(segments.length, 1)
  const angles = (index: number) => ({
    from: START + index * span + GAP / 2,
    to: START + (index + 1) * span - GAP / 2,
  })

  return (
    <div className="radial-wrap">
      {/* Clip shapes for the frosted layers */}
      <svg className="radial-defs" width="0" height="0" focusable="false" aria-hidden="true">
        <defs>
          {segments.map((segment, index) => {
            const { from, to } = angles(index)
            return (
              <clipPath key={segment.id} id={`${uid}-clip-${index}`} clipPathUnits="objectBoundingBox">
                <path d={segmentPath(from, to, SIZE)} />
              </clipPath>
            )
          })}
        </defs>
      </svg>

      {/* Frosted glass layers (blur what is behind the wheel) */}
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          aria-hidden="true"
          className={`radial-glass kind-${segment.kind}`}
          style={{ clipPath: `url(#${uid}-clip-${index})` }}
        />
      ))}
      <div aria-hidden="true" className={`radial-glass radial-glass-core kind-${overall}`} />

      <svg className="radial" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Health indicators">
        <defs>
          <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id={`${uid}-core-gloss`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.65" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {segments.map((segment, index) => {
          const { from, to } = angles(index)
          const d = segmentPath(from, to)
          const [x, y] = point(R_TEXT, (from + to) / 2)
          const [sx, sy] = point(R_OUT - 12, from + 4)
          const selected = segment.id === selectedId
          // Lines stacked around the segment's center point; without a unit the block is shorter and re-centered
          const hasUnit = Boolean(segment.unit) && segment.kind !== 'missing'
          const nameY = y + (hasUnit ? -24 : -15)
          const valueY = y + (hasUnit ? 6 : 13)
          const unitY = y + 30
          return (
            <g
              key={segment.id}
              className={`radial-segment kind-${segment.kind}${selected ? ' is-selected' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${segment.name}, ${KIND_TEXT[segment.kind]}`}
              onClick={() => onSelect(segment.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(segment.id)
                }
              }}
            >
              <path
                className="radial-focus-ring"
                d={segmentPath(from - 0.6, to + 0.6, 1, R_OUT + FOCUS_OFFSET, R_IN - FOCUS_OFFSET)}
              />
              <path className="radial-gloss" d={d} fill={`url(#${uid}-gloss)`} />
              <path className="radial-wedge" d={d} />
              <circle className="radial-spark" cx={sx} cy={sy} r={2.6} />
              <text className="radial-name" x={x} y={nameY}>
                {segment.name}
              </text>
              <text className="radial-value" x={x} y={valueY}>
                {segment.valueText}
              </text>
              {hasUnit && (
                <text className="radial-unit" x={x} y={unitY}>
                  {segment.unit}
                </text>
              )}
            </g>
          )
        })}

        <g aria-hidden="true">
        <circle className="radial-core-outer" cx={C} cy={C} r={R_CORE_OUTER} />
        <circle className={`radial-core-gloss`} cx={C} cy={C} r={R_CORE} fill={`url(#${uid}-core-gloss)`} />
        <circle className={`radial-core kind-${overall}`} cx={C} cy={C} r={R_CORE} />
        <text className={`radial-core-icon kind-${overall}`} x={C} y={C - 30}>
          {KIND_SYMBOL[overall]}
        </text>
        <text className={`radial-core-label kind-${overall}`} x={C} y={C + 14}>
          {KIND_TEXT[overall]}
        </text>
        <text className="radial-core-sub" x={C} y={C + 44}>
          Overall status
        </text>
        </g>
      </svg>
    </div>
  )
}