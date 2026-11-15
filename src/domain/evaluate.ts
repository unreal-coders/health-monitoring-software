// Status evaluation: the only place where the status of an indicator is decided
// (MVP Scope, section 2.2). It receives a sheet, the logged entries, and the
// current time, and returns the status. It contains no thresholds or medical
// text: everything comes from the sheet.

import { compileCondition, type Condition } from './condition.ts'
import type { Entry, IndicatorSheet, Rule, StatusResult } from './types.ts'

const conditions = new WeakMap<Rule, Condition>()

export function conditionOf(rule: Rule): Condition {
  let condition = conditions.get(rule)
  if (!condition) {
    condition = compileCondition(rule.when)
    conditions.set(rule, condition)
  }
  return condition
}

const HOUR = 60 * 60 * 1000
const INTERVAL = /^(\d+(?:\.\d+)?)\s*(hours?|days?)$/

/** Converts a sheet interval such as "14 days" to milliseconds, or null when the sheet gives none. */
export function parseInterval(interval: string | null): number | null {
  if (interval === null) return null
  const match = INTERVAL.exec(interval.trim())
  if (!match) throw new Error(`Unknown measurement interval "${interval}"`)
  const amount = Number(match[1])
  return match[2].startsWith('day') ? amount * 24 * HOUR : amount * HOUR
}

/** Names of the values a sheet's conditions can read. */
export function conditionVariables(sheet: IndicatorSheet): string[] {
  return sheet.fields ?? ['value']
}

function requireNumber(values: Record<string, number>, name: string, sheet: IndicatorSheet): number {
  const value = values[name]
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Entry for "${sheet.id}" is missing a number for "${name}"`)
  }
  return value
}

/** Turns one entry into the values its sheet's conditions read. */
export function entryValues(sheet: IndicatorSheet, entry: Entry): Record<string, number> {
  if (sheet.input === 'questionnaire') {
    const questionnaire = sheet.questionnaire
    if (!questionnaire) throw new Error(`Sheet "${sheet.id}" has no questionnaire`)
    const allowed = new Set(questionnaire.options.map((option) => option.score))
    let total = 0
    for (const item of questionnaire.items) {
      const score = requireNumber(entry.values, item.id, sheet)
      if (!allowed.has(score)) {
        throw new Error(`Entry for "${sheet.id}" has an invalid score ${score} for "${item.id}"`)
      }
      total += score
    }
    return { value: total }
  }
  if (sheet.input === 'checklist') {
    const items = sheet.checklist ?? []
    const checked = items.filter((item) => entry.values[item.id] === 1).length
    return { value: checked }
  }
  const values: Record<string, number> = {}
  for (const name of conditionVariables(sheet)) {
    const value = requireNumber(entry.values, name, sheet)
    const range = sheet.valid_range?.[name]
    if (range && (value < range.min || (range.max !== null && value > range.max))) {
      throw new OutOfRangeError(sheet, name, value, range.min, range.max)
    }
    values[name] = value
  }
  return values
}

/** An entry value outside the sheet's valid_range, most likely a typing error. */
export class OutOfRangeError extends Error {
  readonly indicatorId: string
  readonly field: string
  readonly value: number
  readonly min: number
  readonly max: number | null

  constructor(sheet: IndicatorSheet, field: string, value: number, min: number, max: number | null) {
    const accepted = max === null ? `${min} or more` : `${min} to ${max}`
    super(`${sheet.name}: ${value} is outside the accepted values for "${field}" (${accepted}). Check the entry.`)
    this.name = 'OutOfRangeError'
    this.indicatorId = sheet.id
    this.field = field
    this.value = value
    this.min = min
    this.max = max
  }
}

function sameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function noEntry(sheet: IndicatorSheet): StatusResult {
  return {
    kind: 'missing',
    color: null,
    label: null,
    text: sheet.astronaut_text.missing,
    contactFlightSurgeon: false,
    evaluated: null,
    outdated: false,
    rule: null,
  }
}

/**
 * Status of one indicator.
 *
 * - Most indicators use their latest entry.
 * - A `log` (e.g. exercise) uses the sum of today's entries.
 *
 * The rules are checked in order and the first that matches decides the status.
 * When none matches, the result is `no-reference` with the sheet's text.
 */
export function evaluateStatus(sheet: IndicatorSheet, entries: readonly Entry[], now: Date = new Date()): StatusResult {
  const own = entries
    .filter((entry) => entry.indicatorId === sheet.id)
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))

  let evaluated: Record<string, number>
  let outdated = false

  if (sheet.entry_kind === 'log') {
    const today = own.filter((entry) => sameLocalDay(new Date(entry.takenAt), now))
    if (today.length === 0) return noEntry(sheet)
    evaluated = { value: today.reduce((sum, entry) => sum + entryValues(sheet, entry).value, 0) }
  } else {
    const latest = own.at(-1)
    if (!latest) return noEntry(sheet)
    evaluated = entryValues(sheet, latest)
    const interval = parseInterval(sheet.measurement.interval)
    outdated = interval !== null && now.getTime() - Date.parse(latest.takenAt) > interval
  }

  const rule = sheet.thresholds.rules.find((candidate) => conditionOf(candidate).evaluate(evaluated))
  if (rule) {
    return {
      kind: rule.color,
      color: rule.color,
      label: rule.label,
      text: rule.text,
      contactFlightSurgeon: rule.contact_flight_surgeon,
      evaluated,
      outdated,
      rule,
    }
  }

  const text = sheet.astronaut_text.no_reference
  if (!text) throw new Error(`Sheet "${sheet.id}" has no rule for this value and no "no_reference" text`)
  return {
    kind: 'no-reference',
    color: null,
    label: null,
    text,
    // Project rule: a value no source can evaluate is shared with the flight surgeon.
    contactFlightSurgeon: true,
    evaluated,
    outdated,
    rule: null,
  }
}
