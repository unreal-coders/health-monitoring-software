// Escalation alert, shown when the current status asks to contact the flight surgeon.
// Style follows the status kind: red is critical, yellow is caution, and a value no
// source can evaluate (no-reference) is a neutral box. All text comes from the
// StatusResult and the sheet.
import type { StatusResult } from '../domain/types.ts'
import { PhoneIcon } from './icons.tsx'
import './status.css'

interface EscalationAlertProps {
  result: StatusResult
  /** The sheet's astronaut_text.no_contact: what to do without real-time contact. */
  noContactText: string
}

type Tone = 'critical' | 'caution' | 'neutral'

function toneOf(result: StatusResult): Tone | null {
  if (result.kind === 'missing' || result.contactFlightSurgeon === false) return null
  if (result.kind === 'red') return 'critical'
  if (result.kind === 'no-reference') return 'neutral'
  // Yellow (or green) with contact: true, or 'if-symptoms', where the rule's text says when.
  return 'caution'
}

export function EscalationAlert({ result, noContactText }: EscalationAlertProps) {
  const tone = toneOf(result)
  if (!tone) return null

  return (
    <section
      role={tone === 'neutral' ? 'status' : 'alert'}
      aria-labelledby="escalation-title"
      className={`escalation alert escalation-${tone}`}
    >
      <div className="escalation-head">
        <span className="escalation-icon">
          <PhoneIcon />
        </span>
        <h3 id="escalation-title" className="escalation-title">
          Contact the flight surgeon
        </h3>
      </div>
      <p className="escalation-body">{result.text}</p>
      <div className="escalation-fallback">
        <p className="label-mono">If there is no real-time contact</p>
        <p>{noContactText}</p>
      </div>
    </section>
  )
}
