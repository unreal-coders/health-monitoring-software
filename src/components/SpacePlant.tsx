// Space garden: a plant that grows with the number of readings logged. It rewards
// keeping up with the routine, never the values measured, so nothing encourages
// hiding a reading. The status only adds a message when something is critical.
import { Starfield } from './Starfield.tsx'
import './plant.css'

const STAGES = [
  { name: 'Seed', at: 0 },
  { name: 'Sprout', at: 3 },
  { name: 'Seedling', at: 8 },
  { name: 'Young plant', at: 15 },
  { name: 'In bloom', at: 25 },
] as const

interface SpacePlantProps {
  /** Total readings logged. */
  readings: number
  /** Consecutive days with at least one reading (domain/health.ts streakDays). */
  streak: number
  hasCritical: boolean
}

/** Leaves per stage: [y, side] along the stem, from the bottom up. */
const LEAVES: [number, -1 | 1][][] = [
  [],
  [[132, -1], [132, 1]],
  [[138, -1], [126, 1], [112, -1], [100, 1]],
  [[140, -1], [128, 1], [114, -1], [100, 1], [86, -1], [72, 1]],
  [[140, -1], [128, 1], [114, -1], [100, 1], [86, -1], [72, 1]],
]

const STEM_TOP = [150, 122, 92, 62, 52]

function Plant({ stage }: { stage: number }) {
  const top = STEM_TOP[stage]
  return (
    <svg className="plant-svg" viewBox="0 0 200 190" aria-hidden="true">
      {stage > 0 && <line key={stage} className="plant-stem" x1="100" y1="152" x2="100" y2={top} />}
      {LEAVES[stage].map(([y, side]) => (
        <g key={`${stage}-${y}-${side}`} transform={`rotate(${side * -28} ${100 + side * 13} ${y})`}>
          <ellipse className="plant-leaf" cx={100 + side * 13} cy={y} rx="13" ry="6" />
        </g>
      ))}
      {stage === 4 && (
        <g className="plant-flower">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              className="plant-petal"
              cx="100"
              cy={top - 9}
              rx="5"
              ry="9"
              transform={`rotate(${angle} 100 ${top})`}
            />
          ))}
          <circle className="plant-flower-center" cx="100" cy={top} r="5" />
        </g>
      )}
      <path className="plant-soil" d="M66 152 h68" />
      <path className="plant-pot" d="M62 152 h76 l-8 30 h-60 z" />
      {stage === 0 && <ellipse className="plant-seed" cx="100" cy="148" rx="6" ry="4" />}
    </svg>
  )
}

export function SpacePlant({ readings, streak, hasCritical }: SpacePlantProps) {
  let stage = 0
  STAGES.forEach((item, index) => {
    if (readings >= item.at) stage = index
  })
  const current = STAGES[stage]
  const next = STAGES[stage + 1]
  const progress = next ? Math.round(((readings - current.at) / (next.at - current.at)) * 100) : 100
  const streakText = `Logging streak: ${streak} ${streak === 1 ? 'day' : 'days'}`

  return (
    <section className="card plant-card" aria-labelledby="plant-title">
      <header className="plant-head">
        <h2 id="plant-title" className="card-title">
          Space garden
        </h2>
        <span className="badge plant-level">Level {stage + 1}</span>
      </header>

      <div className="grow-chamber">
        <Starfield stars={28} meteors={2} meteorLength={60} />
        <span className="grow-light" aria-hidden="true" />
        <span className="label-mono grow-label">
          VEG-01 · Stage {stage + 1}/{STAGES.length}
        </span>
        <Plant stage={stage} />
      </div>

      <div className="plant-info">
        <p className="plant-stage">{current.name}</p>
        <p className="muted">
          <span className="num">{readings}</span> {readings === 1 ? 'reading' : 'readings'} logged
        </p>
        <div
          className="progress"
          role="progressbar"
          aria-label={next ? `Progress to ${next.name}` : 'Fully grown'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="muted">
          {next ? `${next.at - readings} more to ${next.name} · ${streakText}` : `Fully grown · ${streakText}`}
        </p>
        {hasCritical && (
          <p className="plant-alert">Your plant is asking for attention. Contact the flight surgeon.</p>
        )}
      </div>
    </section>
  )
}
