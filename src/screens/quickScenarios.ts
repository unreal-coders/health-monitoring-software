// Temporary test scenarios for the dashboard's test panel. They replace the demo
// scenarios in data/demo/, which are not in the repository yet.
import type { Entry } from '../domain/types.ts'

export interface Scenario {
  id: string
  label: string
  values: Record<string, Record<string, number>>
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'normal',
    label: 'Normal',
    values: {
      'heart-rate': { value: 72 },
      'blood-pressure': { systolic: 118, diastolic: 76 },
      'oxygen-saturation': { value: 98 },
      'blood-glucose': { value: 88 },
      'body-temperature': { value: 36.8 },
      'immune-symptoms': {},
      'sleep-hours': { value: 7.5 },
      mood: { interest: 0, down: 1 },
    },
  },
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
      'sleep-hours': { value: 4 },
      mood: { interest: 3, down: 3 },
    },
  },
]

export function buildEntries(scenario: Scenario, now: Date): Entry[] {
  const takenAt = now.toISOString()
  return Object.entries(scenario.values).map(([indicatorId, values]) => ({ indicatorId, takenAt, values }))
}