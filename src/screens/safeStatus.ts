// Evaluates one indicator without letting a bad value break the whole screen.
// If evaluateStatus() throws (for example a value no rule covers and the sheet
// has no no_reference text), that indicator is shown as "No reference" and the
// rest of the screen keeps working. No thresholds or medical values live here.
import { evaluateStatus } from '../domain/evaluate.ts'
import type { Entry, IndicatorSheet, StatusResult } from '../domain/types.ts'

/** Shown only when the sheet has no no_reference text of its own. */
const FALLBACK_TEXT = 'This reading could not be evaluated. Share it with the flight surgeon.'

export function safeStatus(sheet: IndicatorSheet, entries: readonly Entry[], now: Date): StatusResult {
  try {
    return evaluateStatus(sheet, entries, now)
  } catch (error) {
    console.error(`Could not evaluate "${sheet.id}"`, error)
    return {
      kind: 'no-reference',
      color: null,
      label: null,
      text: sheet.astronaut_text.no_reference ?? FALLBACK_TEXT,
      // Project rule: a value no source can evaluate is shared with the flight surgeon.
      contactFlightSurgeon: true,
      evaluated: null,
      outdated: false,
      rule: null,
    }
  }
}

/** The value of a result as text: "118/76" for blood pressure, "—" without an entry. */
export function valueText(result: StatusResult): string {
  return result.evaluated ? Object.values(result.evaluated).join('/') : '—'
}
