import type { CSSProperties } from 'react'
import type { ContactFlag } from '../domain/types.ts'

interface EscalationAlertProps {
  contact: ContactFlag
  /** The sheet's astronaut_text.no_contact: what to do without real-time contact. */
  noContactText: string
}

/** Shown when the sheet says the flight surgeon must be contacted for the current status. */
export function EscalationAlert({ contact, noContactText }: EscalationAlertProps) {
  if (contact !== true) return null

  return (
    <section role="alert" aria-labelledby="escalation-title" style={boxStyle}>
      <h3 id="escalation-title" style={titleStyle}>
        <span aria-hidden="true">!</span> Contact the flight surgeon
      </h3>
      <p style={textStyle}>{noContactText}</p>
    </section>
  )
}

const boxStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1rem',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-status-caution)',
  borderRadius: '12px',
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
}

const textStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-sm)',
}