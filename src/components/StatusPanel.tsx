import type { OverallKind } from '../domain/health.ts'
import { StatusBadge } from './StatusBadge.tsx'

const MESSAGE: Record<OverallKind, string> = {
  green: 'All logged indicators are within their reference ranges.',
  yellow: 'Some indicators need attention.',
  red: 'Some indicators need urgent attention.',
  missing: 'No readings yet. Log a measurement to see your status.',
}

interface StatusPanelProps {
  overall: OverallKind
  label: string
  flagged: readonly string[]
  contact: boolean
}

export function StatusPanel({ overall, label, flagged, contact }: StatusPanelProps) {
  return (
    <section className={`card status-card status-${overall}`} aria-labelledby="status-title">
      <h2 id="status-title" className="card-title">
        Status
      </h2>
      <StatusBadge kind={overall} label={label} />
      <p className="muted">{MESSAGE[overall]}</p>
      {flagged.length > 0 && <p>Review: {flagged.join(', ')}.</p>}
      {contact && <p>Share the flagged readings with the flight surgeon.</p>}
    </section>
  )
}