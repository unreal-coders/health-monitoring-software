import { entryValues, evaluateStatus } from './evaluate.ts'
import type { Entry, IndicatorSheet, StatusKind } from './types.ts'

export interface Point {
  time: number
  value: number
  kind: StatusKind
}

/**
 * Points for the chart. Single readings are plotted one by one with their status.
 * Logs are summed per day and mission accumulations are running totals. Their
 * points get no status color, because the status applies to the day or the
 * mission, not to each entry.
 */
export function toPoints(sheet: IndicatorSheet, entries: readonly Entry[], now: Date): Point[] {
  const own = entries
    .filter((entry) => entry.indicatorId === sheet.id)
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))

  if (sheet.entry_kind === 'log') {
    const byDay = new Map<string, Point>()
    for (const entry of own) {
      const time = Date.parse(entry.takenAt)
      const day = new Date(time).toDateString()
      const total = (byDay.get(day)?.value ?? 0) + entryValues(sheet, entry).value
      byDay.set(day, { time, value: total, kind: 'no-reference' })
    }
    return [...byDay.values()]
  }

  if (sheet.accumulation === 'mission') {
    let total = 0
    return own.map((entry): Point => {
      total += entryValues(sheet, entry).value
      return { time: Date.parse(entry.takenAt), value: total, kind: 'no-reference' }
    })
  }

  const key = sheet.fields?.[0] ?? 'value'
  return own.map(
    (entry): Point => ({
      time: Date.parse(entry.takenAt),
      value: entryValues(sheet, entry)[key],
      kind: evaluateStatus(sheet, [entry], now).kind,
    }),
  )
}