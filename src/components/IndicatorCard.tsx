import type { CSSProperties } from 'react'
import type { StatusResult } from '../domain/types.ts'
import { StatusBadge } from './StatusBadge.tsx'

interface IndicatorCardProps {
  name: string
  unit?: string | null
  result: StatusResult
}

/** Shows one indicator. It renders the StatusResult it receives and decides nothing itself. */
export function IndicatorCard({ name, unit, result }: IndicatorCardProps) {
  const value = result.evaluated ? Object.values(result.evaluated).join(' / ') : null

  return (
    <article style={cardStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>{name}</h2>
        <StatusBadge kind={result.kind} label={result.label} />
      </header>
      {value !== null && (
        <p style={valueStyle}>
          {value}
          {unit ? ` ${unit}` : ''}
        </p>
      )}
      <p style={textStyle}>{result.text}</p>
      {result.outdated && <p style={noteStyle}>This reading is older than the recommended interval.</p>}
    </article>
  )
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.5rem',
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
}

const valueStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-xl)',
  fontWeight: 'var(--font-weight-bold)',
}

const textStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
}

const noteStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-status-caution)',
  fontSize: 'var(--font-size-xs)',
}