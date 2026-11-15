// Overall status card: badge, a short summary, and the indicators to review
// (critical first). The contact box appears only when something is critical.
import type { OverallKind } from '../domain/health.ts'
import type { StatusKind } from '../domain/types.ts'
import { StatusBadge } from './StatusBadge.tsx'
import { StatusIcon } from './icons.tsx'

const MESSAGE: Record<OverallKind, string> = {
  green: 'All logged indicators are within their reference ranges.',
  yellow: 'Some indicators need attention.',
  red: 'Some indicators need urgent attention.',
  missing: 'No readings yet. Log a measurement to see your status.',
}

export interface ReviewItem {
  id: string
  name: string
  kind: StatusKind
}

interface StatusPanelProps {
  overall: OverallKind
  /** Indicators in caution or critical, critical first. */
  review: readonly ReviewItem[]
  onSelect: (id: string) => void
}

export function StatusPanel({ overall, review, onSelect }: StatusPanelProps) {
  const hasCritical = review.some((item) => item.kind === 'red')

  return (
    <section
      className={`card status-card${hasCritical ? ' has-critical' : ''}`}
      aria-labelledby="status-title"
    >
      <div className="status-head">
        <h2 id="status-title" className="card-title">
          Status
        </h2>
        <StatusBadge kind={overall} />
      </div>
      <p className="muted">{MESSAGE[overall]}</p>

      {review.length > 0 && (
        <div className="review">
          <p className="label-mono">Review</p>
          <ul className="review-list">
            {review.map((item) => (
              <li key={item.id}>
                <button type="button" className={`review-item kind-${item.kind}`} onClick={() => onSelect(item.id)}>
                  <StatusIcon kind={item.kind} size={14} />
                  <span>{item.name}</span>
                  <span className="visually-hidden">, {item.kind === 'red' ? 'critical' : 'caution'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasCritical && (
        <div className="alert alert-critical status-contact">
          Contact the flight surgeon. Share the flagged readings.
        </div>
      )}
    </section>
  )
}
