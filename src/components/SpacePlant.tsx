import type { OverallKind } from '../domain/health.ts'

// The plant grows with logging consistency. The overall status only changes the message.
const MESSAGE: Record<OverallKind, string> = {
  green: 'Your plant is growing with your routine.',
  yellow: 'Your plant needs a closer look. Review the flagged indicators.',
  red: 'Your plant is asking for attention. Contact the flight surgeon.',
  missing: 'Log readings to start growing your plant.',
}

interface SpacePlantProps {
  growth: number
  streak: number
  overall: OverallKind
}

export function SpacePlant({ growth, streak, overall }: SpacePlantProps) {
  const stemHeight = 20 + growth * 1.2
  const top = 150 - stemHeight
  const leafCount = Math.min(5, Math.ceil(growth / 25))
  const level = Math.floor(growth / 20) + 1
  const leaves = Array.from({ length: leafCount }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1
    const y = 150 - stemHeight * ((index + 1) / (leafCount + 1))
    return { key: index, x: 100 + side * 14, y, angle: side * -30 }
  })

  return (
    <section className="card plant-card" aria-labelledby="plant-title">
      <header className="plant-head">
        <h2 id="plant-title" className="card-title">
          Space garden
        </h2>
        <span className="level">Level {level}</span>
      </header>

      <svg className="plant-svg" viewBox="0 0 200 200" role="img" aria-label={`Plant growth ${growth} percent`}>
        <rect className="plant-pot" x="60" y="150" width="80" height="34" rx="17" />
        <line className="plant-stem" x1="100" y1="150" x2="100" y2={top} />
        {leaves.map((leaf) => (
          <ellipse
            key={leaf.key}
            className="plant-leaf"
            cx={leaf.x}
            cy={leaf.y}
            rx="14"
            ry="7"
            transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
          />
        ))}
        {growth >= 80 && <circle className="plant-bloom" cx="100" cy={top} r="7" />}
      </svg>

      <div
        className="progress"
        role="progressbar"
        aria-label="Plant growth"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={growth}
      >
        <div className="progress-bar" style={{ width: `${growth}%` }} />
      </div>
      <p className="muted">{MESSAGE[overall]}</p>
      <p className="muted">
        Logging streak: {streak} {streak === 1 ? 'day' : 'days'}
      </p>
    </section>
  )
}