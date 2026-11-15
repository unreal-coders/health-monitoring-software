// Synthetic demo scenarios for the dashboard. They replace the demo scenarios in
// data/demo/, which are not in the repository yet. Values are synthetic test
// inputs, not thresholds: the status of every reading is still decided by the
// sheets through domain/.
import type { Entry } from '../domain/types.ts'

type Values = Record<string, Record<string, number>>

export interface Scenario {
  id: string
  label: string
  /** The last day of the scenario. */
  values: Values
}

/** Number of days of readings each scenario generates, ending today. */
export const SCENARIO_DAYS = 7

const NORMAL: Values = {
  'heart-rate': { value: 72 },
  'blood-pressure': { systolic: 118, diastolic: 76 },
  'oxygen-saturation': { value: 98 },
  'blood-glucose': { value: 88 },
  'body-temperature': { value: 36.8 },
  'immune-symptoms': {},
  exercise: { value: 95 },
  'sleep-hours': { value: 7.5 },
  mood: { interest: 0, down: 1 },
}

export const SCENARIOS: readonly Scenario[] = [
  { id: 'normal', label: 'Normal', values: NORMAL },
  {
    id: 'gradual',
    label: 'Gradual change',
    values: {
      'heart-rate': { value: 88 },
      'blood-pressure': { systolic: 132, diastolic: 84 },
      'oxygen-saturation': { value: 95 },
      'blood-glucose': { value: 102 },
      'body-temperature': { value: 37.2 },
      'immune-symptoms': { 'skin-rash': 1 },
      exercise: { value: 60 },
      'sleep-hours': { value: 6 },
      mood: { interest: 2, down: 1 },
    },
  },
  {
    id: 'acute',
    label: 'Acute event',
    values: {
      'heart-rate': { value: 125 },
      'blood-pressure': { systolic: 186, diastolic: 112 },
      'oxygen-saturation': { value: 88 },
      'blood-glucose': { value: 50 },
      'body-temperature': { value: 38.6 },
      'immune-symptoms': { 'allergic-reaction': 1, 'skin-rash': 1 },
      exercise: { value: 20 },
      'sleep-hours': { value: 4 },
      mood: { interest: 3, down: 3 },
    },
  },
]

/** Decimal places kept when blending, per indicator. Questionnaire and checklist answers stay whole. */
const DECIMALS: Record<string, number> = { 'body-temperature': 1, 'sleep-hours': 1 }

/** Blends the normal day into the scenario's last day. t = 0 is normal, t = 1 is the last day. */
function blend(indicatorId: string, last: Record<string, number>, t: number): Record<string, number> {
  const start = NORMAL[indicatorId] ?? {}
  const factor = 10 ** (DECIMALS[indicatorId] ?? 0)
  const names = new Set([...Object.keys(start), ...Object.keys(last)])
  const values: Record<string, number> = {}
  for (const name of names) {
    const a = start[name] ?? 0
    const b = last[name] ?? 0
    const value = Math.round((a + (b - a) * t) * factor) / factor
    // Checklist items are 1 when checked; leave unchecked ones out, as the form does.
    if (indicatorId === 'immune-symptoms' && value < 1) continue
    values[name] = value
  }
  return values
}

/**
 * One reading per indicator per day for SCENARIO_DAYS days, ending a minute before now.
 * - Normal: every day is normal.
 * - Gradual change: each day moves a step from normal toward the last day.
 * - Acute event: normal days, then the event on the last day.
 */
export function buildEntries(scenario: Scenario, now: Date): Entry[] {
  const entries: Entry[] = []
  for (let day = 0; day < SCENARIO_DAYS; day++) {
    const takenAt = new Date(now.getTime() - 60_000)
    takenAt.setDate(takenAt.getDate() - (SCENARIO_DAYS - 1 - day))
    const isLast = day === SCENARIO_DAYS - 1
    const t =
      scenario.id === 'gradual' ? day / (SCENARIO_DAYS - 1) : scenario.id === 'acute' && isLast ? 1 : 0
    for (const indicatorId of Object.keys(scenario.values)) {
      entries.push({
        indicatorId,
        takenAt: takenAt.toISOString(),
        values: blend(indicatorId, scenario.values[indicatorId], t),
      })
    }
  }
  return entries
}
