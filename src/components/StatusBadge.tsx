// Status tag (NASAWDS style): icon + text, outlined in the status color.
// The status never depends on color alone.
import type { StatusKind } from '../domain/types.ts'
import { ClockIcon, StatusIcon } from './icons.tsx'
import './status.css'

interface StatusBadgeProps {
  kind: StatusKind
  /** Adds an OUTDATED tag when the last reading is older than the sheet's interval. */
  outdated?: boolean
  size?: 'md' | 'lg'
}

const TEXT: Record<StatusKind, string> = {
  green: 'Normal',
  yellow: 'Caution',
  red: 'Critical',
  missing: 'No data',
  'no-reference': 'No reference',
}

export function StatusBadge({ kind, outdated = false, size = 'md' }: StatusBadgeProps) {
  const iconSize = size === 'lg' ? 16 : 12
  return (
    <span className="badge-group">
      <span className={`badge badge-${kind} badge-${size}`}>
        <StatusIcon kind={kind} size={iconSize} />
        {TEXT[kind]}
      </span>
      {outdated && (
        <span className={`badge badge-outdated badge-${size}`}>
          <ClockIcon size={iconSize} />
          Outdated
        </span>
      )}
    </span>
  )
}
