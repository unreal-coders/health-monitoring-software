// History for the detail screen: chart points and the latest readings.
// Everything is computed through domain/ (toPoints, evaluateStatus via
// safeStatus); this file only guards against errors and picks what to show.
import { toPoints, type Point } from '../domain/history.ts'
import type { Entry, IndicatorSheet, StatusKind } from '../domain/types.ts'
import { safeStatus, valueText } from './safeStatus.ts'

function sameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function ownEntries(sheet: IndicatorSheet, entries: readonly Entry[]): Entry[] {
  return entries
    .filter((entry) => entry.indicatorId === sheet.id)
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))
}

/**
 * Chart points. A reading that domain/ cannot evaluate is kept as "no-reference"
 * instead of breaking the chart. For a daily log (exercise), each point is the
 * day's total, so it takes the status of that day.
 */
export function historyPoints(sheet: IndicatorSheet, entries: readonly Entry[], now: Date): Point[] {
  const own = ownEntries(sheet, entries)
  let points: Point[]
  try {
    points = toPoints(sheet, own, now)
  } catch {
    const key = sheet.fields?.[0] ?? 'value'
    points = own.flatMap((entry): Point[] => {
      try {
        return toPoints(sheet, [entry], now)
      } catch {
        const value = entry.values[key]
        return Number.isFinite(value) ? [{ time: Date.parse(entry.takenAt), value, kind: 'no-reference' }] : []
      }
    })
  }

  if (sheet.entry_kind === 'log') {
    points = points.map((point) => {
      const day = new Date(point.time)
      const dayEntries = own.filter((entry) => sameLocalDay(new Date(entry.takenAt), day))
      return { ...point, kind: safeStatus(sheet, dayEntries, day).kind }
    })
  }
  return points
}

export interface Reading {
  key: string
  time: number
  value: string
  kind: StatusKind
}

/** The latest readings, newest first. A daily log lists one row per day with the day's total. */
export function latestReadings(sheet: IndicatorSheet, entries: readonly Entry[], now: Date, limit = 6): Reading[] {
  if (sheet.entry_kind === 'log') {
    return historyPoints(sheet, entries, now)
      .slice(-limit)
      .reverse()
      .map((point) => ({ key: String(point.time), time: point.time, value: String(point.value), kind: point.kind }))
  }
  return ownEntries(sheet, entries)
    .slice(-limit)
    .reverse()
    .map((entry, index) => {
      const time = Date.parse(entry.takenAt)
      const result = safeStatus(sheet, [entry], new Date(time))
      return { key: `${entry.takenAt}-${index}`, time, value: valueText(result), kind: result.kind }
    })
}
