import { describe, expect, it } from 'vitest'
import { getSheet } from '../catalog/sheets.ts'
import { evaluateStatus, OutOfRangeError, parseInterval } from './evaluate.ts'
import type { Entry } from './types.ts'

const NOW = new Date('2026-11-15T12:00:00')

function entry(indicatorId: string, values: Record<string, number>, takenAt = '2026-11-15T08:00:00'): Entry {
  return { indicatorId, takenAt, values }
}

function statusOf(indicatorId: string, values: Record<string, number>) {
  const result = evaluateStatus(getSheet(indicatorId), [entry(indicatorId, values)], NOW)
  return `${result.kind}: ${result.label ?? '-'}`
}

describe('evaluateStatus with the real sheets', () => {
  it('blood pressure follows the AHA categories in order', () => {
    expect(statusOf('blood-pressure', { systolic: 115, diastolic: 75 })).toBe('green: Normal')
    expect(statusOf('blood-pressure', { systolic: 125, diastolic: 75 })).toBe('yellow: Elevated')
    expect(statusOf('blood-pressure', { systolic: 115, diastolic: 85 })).toBe('yellow: Stage 1 hypertension')
    expect(statusOf('blood-pressure', { systolic: 145, diastolic: 85 })).toBe('yellow: Stage 2 hypertension')
    expect(statusOf('blood-pressure', { systolic: 185, diastolic: 100 })).toBe('red: Severe hypertension')
    expect(statusOf('blood-pressure', { systolic: 85, diastolic: 55 })).toBe('yellow: Low blood pressure')
  })

  it('heart rate is green from 60 to 100 bpm', () => {
    expect(statusOf('heart-rate', { value: 59 })).toBe('yellow: Below the normal resting range')
    expect(statusOf('heart-rate', { value: 60 })).toBe('green: Normal resting range')
    expect(statusOf('heart-rate', { value: 100 })).toBe('green: Normal resting range')
    expect(statusOf('heart-rate', { value: 101 })).toBe('yellow: Above the normal resting range')
  })

  it('oxygen saturation uses the MedlinePlus levels', () => {
    expect(statusOf('oxygen-saturation', { value: 95 })).toBe('green: Normal')
    expect(statusOf('oxygen-saturation', { value: 94 })).toBe('yellow: Below the normal range')
    expect(statusOf('oxygen-saturation', { value: 92 })).toBe('yellow: Contact a provider')
    expect(statusOf('oxygen-saturation', { value: 88 })).toBe('red: Seek immediate medical attention')
  })

  it('blood glucose uses the CDC fasting ranges', () => {
    expect(statusOf('blood-glucose', { value: 53 })).toBe('red: Severe low blood sugar')
    expect(statusOf('blood-glucose', { value: 69 })).toBe('yellow: Low blood sugar')
    expect(statusOf('blood-glucose', { value: 70 })).toBe('green: Normal')
    expect(statusOf('blood-glucose', { value: 99 })).toBe('green: Normal')
    expect(statusOf('blood-glucose', { value: 100 })).toBe('yellow: In the prediabetes range for a fasting test')
    expect(statusOf('blood-glucose', { value: 126 })).toBe('yellow: In the diabetes range for a fasting test')
  })

  it('body temperature flags hypothermia and fever', () => {
    expect(statusOf('body-temperature', { value: 34.9 })).toBe('red: Hypothermia')
    expect(statusOf('body-temperature', { value: 37 })).toBe('green: No fever or hypothermia')
    expect(statusOf('body-temperature', { value: 38 })).toBe('yellow: Fever')
  })

  it('sleep hours are green at 7 hours or more', () => {
    expect(statusOf('sleep-hours', { value: 6.5 })).toBe('yellow: Below the recommended amount')
    expect(statusOf('sleep-hours', { value: 7 })).toBe('green: Recommended amount')
  })

  it('returns the text and flight surgeon flag of the matching rule', () => {
    const result = evaluateStatus(getSheet('oxygen-saturation'), [entry('oxygen-saturation', { value: 85 })], NOW)
    expect(result.contactFlightSurgeon).toBe(true)
    expect(result.text).toBe(result.rule?.text)
    expect(result.evaluated).toEqual({ value: 85 })
  })
})

describe('entry kinds', () => {
  it('a log adds up only today\'s entries', () => {
    const sheet = getSheet('exercise')
    const entries = [
      entry('exercise', { value: 30 }, '2026-11-14T09:00:00'),
      entry('exercise', { value: 45 }, '2026-11-15T07:00:00'),
      entry('exercise', { value: 50 }, '2026-11-15T11:00:00'),
    ]
    const result = evaluateStatus(sheet, entries, NOW)
    expect(result.evaluated).toEqual({ value: 95 })
    expect(result.kind).toBe('green')
    expect(evaluateStatus(sheet, entries.slice(0, 2), NOW).kind).toBe('yellow')
  })

  it('a log with nothing today is missing', () => {
    const result = evaluateStatus(getSheet('exercise'), [entry('exercise', { value: 90 }, '2026-11-14T09:00:00')], NOW)
    expect(result.kind).toBe('missing')
  })

  it('the PHQ-2 adds up both answers', () => {
    const sheet = getSheet('mood')
    expect(evaluateStatus(sheet, [entry('mood', { interest: 1, down: 1 })], NOW).kind).toBe('green')
    expect(evaluateStatus(sheet, [entry('mood', { interest: 2, down: 1 })], NOW).kind).toBe('yellow')
    expect(() => evaluateStatus(sheet, [entry('mood', { interest: 4, down: 0 })], NOW)).toThrow(/invalid score/)
    expect(() => evaluateStatus(sheet, [entry('mood', { interest: 1 })], NOW)).toThrow(/missing a number for "down"/)
  })

  it('immune symptoms have no rules, so any entry has no color', () => {
    const result = evaluateStatus(getSheet('immune-symptoms'), [entry('immune-symptoms', { 'skin-rash': 1 })], NOW)
    expect(result.kind).toBe('no-reference')
    expect(result.evaluated).toEqual({ value: 1 })
  })
})

describe('edge cases', () => {
  it('no entry gives the sheet\'s missing text', () => {
    const sheet = getSheet('heart-rate')
    const result = evaluateStatus(sheet, [], NOW)
    expect(result).toMatchObject({ kind: 'missing', color: null, text: sheet.astronaut_text.missing })
  })

  it('uses the latest entry and ignores other indicators', () => {
    const entries = [
      entry('heart-rate', { value: 120 }, '2026-11-15T06:00:00'),
      entry('heart-rate', { value: 72 }, '2026-11-15T09:00:00'),
      entry('blood-glucose', { value: 40 }, '2026-11-15T10:00:00'),
    ]
    expect(evaluateStatus(getSheet('heart-rate'), entries, NOW).evaluated).toEqual({ value: 72 })
  })

  it('marks an entry older than the measurement interval as outdated', () => {
    const sheet = getSheet('mood')
    const recent = evaluateStatus(sheet, [entry('mood', { interest: 0, down: 0 }, '2026-11-10T12:00:00')], NOW)
    const old = evaluateStatus(sheet, [entry('mood', { interest: 0, down: 0 }, '2026-10-20T12:00:00')], NOW)
    expect(recent.outdated).toBe(false)
    expect(old.outdated).toBe(true)
    expect(old.kind).toBe('green')
  })

  it('marks a daily indicator outdated after one day', () => {
    const sheet = getSheet('heart-rate')
    expect(evaluateStatus(sheet, [entry('heart-rate', { value: 70 }, '2026-11-15T08:00:00')], NOW).outdated).toBe(false)
    expect(evaluateStatus(sheet, [entry('heart-rate', { value: 70 }, '2026-11-14T08:00:00')], NOW).outdated).toBe(true)
  })

  it('rejects values outside the valid range as typing errors', () => {
    const reject = (id: string, values: Record<string, number>) => () =>
      evaluateStatus(getSheet(id), [entry(id, values)], NOW)
    expect(reject('blood-pressure', { systolic: 900, diastolic: 80 })).toThrow(OutOfRangeError)
    expect(reject('blood-pressure', { systolic: 120, diastolic: 10 })).toThrow(/"diastolic" \(20 to 200\)/)
    expect(reject('oxygen-saturation', { value: 101 })).toThrow(OutOfRangeError)
    expect(reject('sleep-hours', { value: 25 })).toThrow(OutOfRangeError)
    expect(reject('body-temperature', { value: 50 })).toThrow(/25 to 45/)
    expect(reject('exercise', { value: 1441 })).toThrow(OutOfRangeError)
  })

  it('accepts values at the edges of the valid range', () => {
    expect(statusOf('oxygen-saturation', { value: 100 })).toBe('green: Normal')
    expect(statusOf('sleep-hours', { value: 0 })).toBe('yellow: Below the recommended amount')
  })

  it('gives every sheet a measurement interval', () => {
    for (const id of ['blood-glucose', 'blood-pressure', 'body-temperature', 'exercise', 'heart-rate', 'immune-symptoms', 'mood', 'oxygen-saturation', 'sleep-hours']) {
      expect(parseInterval(getSheet(id).measurement.interval), id).not.toBeNull()
    }
  })

  it('rejects an entry without the values the sheet needs', () => {
    expect(() => evaluateStatus(getSheet('blood-pressure'), [entry('blood-pressure', { systolic: 120 })], NOW)).toThrow(
      /missing a number for "diastolic"/,
    )
  })
})

describe('parseInterval', () => {
  it('reads days and hours', () => {
    expect(parseInterval('14 days')).toBe(14 * 24 * 60 * 60 * 1000)
    expect(parseInterval('1 day')).toBe(24 * 60 * 60 * 1000)
    expect(parseInterval('12 hours')).toBe(12 * 60 * 60 * 1000)
    expect(parseInterval(null)).toBeNull()
  })

  it('rejects unknown formats', () => {
    expect(() => parseInterval('weekly')).toThrow(/Unknown measurement interval/)
  })
})
