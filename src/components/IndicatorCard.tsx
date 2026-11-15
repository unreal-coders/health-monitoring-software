import type { CSSProperties } from 'react'
import type { StatusResult } from '../domain/types.ts'
import { StatusBadge } from './StatusBadge.tsx'

interface IndicatorCardProps {
  name: string
  unit?: string | null
  result: StatusResult
  /** When given, the name becomes a button that opens the indicator's detail. */
  onOpen?: () => void
}

/** Shows one indicator. It renders the StatusResult it receives and decides nothing itself. */
export function IndicatorCard({ name, unit, result, onOpen }: IndicatorCardProps) {
  const value = result.evaluated ? Object.values(result.evaluated).join(' / ') : null

  return (
    <article style={cardStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>
          {onOpen ? (
            <button type="button" onClick={onOpen} style={titleButtonStyle}>
              {name}
            </button>
          ) : (
            name
          )}
        </h2>
        <StatusBadge kind={result.kind} outdated={result.outdated} />
      </header>
      {value !== null && (
        <p style={valueStyle}>
          {value}
          {unit ? ` ${unit}` : ''}
        </p>
      )}
      {result.label && <p className="label-mono" style={{ margin: 0 }}>{result.label}</p>}
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

const titleButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  padding: 0,
  background: 'none',
  border: 0,
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
}

const valueStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-xl)',
  fontWeight: 'var(--font-weight-bold)',
  fontVariantNumeric: 'tabular-nums',
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