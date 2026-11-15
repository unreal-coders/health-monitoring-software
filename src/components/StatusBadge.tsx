import type { StatusKind } from '../domain/types.ts'

interface StatusBadgeProps {
  kind: StatusKind
  /** Name of the status from the sheet's rule. Falls back to a generic name. */
  label?: string | null
}

const APPEARANCE: Record<StatusKind, { icon: string; color: string; fallback: string }> = {
  green: { icon: '✓', color: 'var(--color-status-normal-text)', fallback: 'Normal' },
  yellow: { icon: '!', color: 'var(--color-status-caution)', fallback: 'Caution' },
  red: { icon: '✕', color: 'var(--color-status-critical)', fallback: 'Critical' },
  'no-reference': { icon: '?', color: 'var(--color-status-missing)', fallback: 'No reference' },
  missing: { icon: '–', color: 'var(--color-status-missing)', fallback: 'No data' },
}

/** Shows the status with an icon and text, so it never depends on color alone. */
export function StatusBadge({ kind, label }: StatusBadgeProps) {
  const { icon, color, fallback } = APPEARANCE[kind]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.625rem',
        border: `1px solid ${color}`,
        borderRadius: '999px',
        background: 'var(--color-surface)',
        color,
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label ?? fallback}</span>
    </span>
  )
}