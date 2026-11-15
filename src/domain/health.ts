// Overall health and gamification inputs. Derived only from each indicator's
// StatusResult: no thresholds and no medical text live here.
import type { Entry, StatusResult } from './types.ts'

export type OverallKind = 'green' | 'yellow' | 'red' | 'missing'

/** The worst evaluated color wins. Indicators without a color do not count. */
export function overallStatus(results: readonly StatusResult[]): OverallKind {
  if (results.some((result) => result.color === 'red')) return 'red'
  if (results.some((result) => result.color === 'yellow')) return 'yellow'
  if (results.some((result) => result.color === 'green')) return 'green'
  return 'missing'
}

function dayStart(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/**
 * Consecutive days with at least one logged entry. If today has no entry yet,
 * the streak continues from yesterday.
 */
export function streakDays(entries: readonly Entry[], now: Date): number {
  const days = new Set(entries.map((entry) => dayStart(new Date(entry.takenAt))))
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1)

  let count = 0
  while (days.has(cursor.getTime())) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

/**
 * Plant growth from 0 to 100. Up to 60 points come from indicators covered by a
 * recent reading; up to 40 come from a 14-day logging streak. Status never
 * affects growth, so nothing rewards or punishes a particular value.
 */
export function plantGrowth(covered: number, total: number, streak: number): number {
  const coverage = total === 0 ? 0 : covered / total
  const consistency = Math.min(streak, 14) / 14
  return Math.round(coverage * 60 + consistency * 40)
}