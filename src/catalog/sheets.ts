// Loads and checks the indicator sheets in data/indicators/.
//
// The YAML files are bundled at build time (no server needed). Every sheet is
// checked when this module loads, so a broken sheet fails the build and the
// tests instead of failing in front of the astronaut.

import { parse } from 'yaml'
import { conditionOf, conditionVariables, parseInterval } from '../domain/evaluate.ts'
import type { IndicatorSheet } from '../domain/types.ts'

const COLORS = new Set(['green', 'yellow', 'red'])
const ENTRY_KINDS = new Set(['measurement', 'self-report', 'log'])
const INPUTS = new Set(['number', 'checklist', 'questionnaire'])
const CONTACT_FLAGS = new Set<unknown>([true, false, 'if-symptoms'])
const REQUIRED = [
  'id',
  'name',
  'domain',
  'entry_kind',
  'unit',
  'mechanism',
  'measurement',
  'baseline',
  'thresholds',
  'countermeasures',
  'flight_surgeon',
  'astronaut_text',
  'limitations',
  'sources',
  'author',
  'reviewer',
] as const

export class SheetError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`)
    this.name = 'SheetError'
  }
}

function check(condition: unknown, file: string, message: string): asserts condition {
  if (!condition) throw new SheetError(file, message)
}

/** Checks a parsed sheet against data/indicator-schema.md and returns it typed. */
export function validateSheet(raw: unknown, file: string): IndicatorSheet {
  check(raw && typeof raw === 'object', file, 'the sheet is not a YAML mapping')
  const sheet = raw as Record<string, unknown>
  for (const field of REQUIRED) check(field in sheet, file, `missing required field "${field}"`)

  const typed = raw as IndicatorSheet
  const expectedId = file.replace(/^.*\//, '').replace(/\.yaml$/, '')
  check(typed.id === expectedId, file, `id "${typed.id}" does not match the file name`)
  check(ENTRY_KINDS.has(typed.entry_kind), file, `unknown entry_kind "${typed.entry_kind}"`)
  check(typed.input === undefined || INPUTS.has(typed.input), file, `unknown input "${typed.input}"`)
  check(typed.measurement && 'interval' in typed.measurement, file, 'missing measurement.interval')
  try {
    parseInterval(typed.measurement.interval)
  } catch (error) {
    throw new SheetError(file, (error as Error).message)
  }

  if (typed.entry_kind === 'log') check(typed.daily_target, file, 'a log needs a daily_target')
  if (typed.input === 'questionnaire') check(typed.questionnaire?.items?.length, file, 'a questionnaire needs items')
  if (typed.input === 'checklist') check(typed.checklist?.length, file, 'a checklist needs items')

  const sourceIds = new Set((typed.sources ?? []).map((source) => source.id))
  const thresholds = typed.thresholds
  check(thresholds?.evaluation === 'first-match', file, 'thresholds.evaluation must be "first-match"')
  check(Array.isArray(thresholds.rules), file, 'thresholds.rules must be a list')

  const allowed = new Set(conditionVariables(typed))
  thresholds.rules.forEach((rule, index) => {
    const where = `rule ${index + 1} ("${rule.label}")`
    check(COLORS.has(rule.color), file, `${where} has an unknown color "${rule.color}"`)
    check(typeof rule.text === 'string' && rule.text.length > 0, file, `${where} has no text`)
    check(CONTACT_FLAGS.has(rule.contact_flight_surgeon), file, `${where} has an invalid contact_flight_surgeon`)
    const ruleSources = Array.isArray(rule.source) ? rule.source : [rule.source]
    for (const id of ruleSources) check(sourceIds.has(id), file, `${where} cites unknown source "${id}"`)
    let variables: ReadonlySet<string>
    try {
      variables = conditionOf(rule).variables
    } catch (error) {
      throw new SheetError(file, `${where}: ${(error as Error).message}`)
    }
    for (const name of variables) check(allowed.has(name), file, `${where} reads unknown value "${name}"`)
  })

  check(typeof typed.astronaut_text?.missing === 'string', file, 'missing astronaut_text.missing')
  if (thresholds.rules.length === 0) {
    check(typed.astronaut_text.no_reference, file, 'a sheet without rules needs astronaut_text.no_reference')
  }
  return typed
}

export function parseSheet(text: string, file: string): IndicatorSheet {
  return validateSheet(parse(text), file)
}

const files = import.meta.glob<string>('../../data/indicators/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** All indicator sheets, sorted by id. */
export const sheets: readonly IndicatorSheet[] = Object.entries(files)
  .map(([path, text]) => parseSheet(text, path.replace(/^.*\/data\//, 'data/')))
  .sort((a, b) => a.id.localeCompare(b.id))

const byId = new Map(sheets.map((sheet) => [sheet.id, sheet]))

export function getSheet(id: string): IndicatorSheet {
  const sheet = byId.get(id)
  if (!sheet) throw new Error(`No indicator sheet with id "${id}"`)
  return sheet
}
