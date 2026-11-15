import { describe, expect, it } from 'vitest'
import { getSheet, parseSheet, SheetError, sheets } from './sheets.ts'

const FILE = 'data/indicators/test-indicator.yaml'

const VALID = `
id: test-indicator
name: Test indicator
domain: Cardiovascular
entry_kind: measurement
unit: bpm
mechanism: {summary: x, hazards: [], hazards_note: x, sources: []}
measurement: {method: x, sources: [], interval: 1 day, interval_basis: design, interval_note: x}
valid_range:
  value: {min: 0, max: 10, basis: design, note: x}
baseline: {value: null, type: null, note: x}
thresholds:
  evaluation: first-match
  rules:
    - {color: green, label: Ok, when: "value >= 1", text: Fine., contact_flight_surgeon: false, source: s1}
  note: x
  sources: [s1]
countermeasures: []
countermeasures_note: x
flight_surgeon: {when_to_contact: x, if_no_real_time_contact: x, sources: []}
astronaut_text: {missing: Nothing yet., no_contact: x, no_reference: No reference.}
limitations: []
sources:
  - {id: s1, title: x, publisher: x, url: "https://example.org"}
author: x
reviewer: null
`

function withChange(find: string, replace: string): string {
  if (!VALID.includes(find)) throw new Error(`Test setup: "${find}" not found`)
  return VALID.replace(find, replace)
}

describe('the bundled catalog', () => {
  it('loads the ten sheets of the MVP Scope', () => {
    expect(sheets.map((sheet) => sheet.id)).toEqual([
      'blood-glucose',
      'blood-pressure',
      'body-temperature',
      'exercise',
      'heart-rate',
      'immune-symptoms',
      'mood',
      'oxygen-saturation',
      'radiation-dose',
      'sleep-hours',
    ])
  })

  it('finds a sheet by id', () => {
    expect(getSheet('heart-rate').name).toBe('Heart rate')
    expect(() => getSheet('nope')).toThrow(/No indicator sheet/)
  })
})

describe('parseSheet', () => {
  it('accepts a valid sheet', () => {
    expect(parseSheet(VALID, FILE).id).toBe('test-indicator')
  })

  it('rejects a missing required field', () => {
    expect(() => parseSheet(withChange('reviewer: null', ''), FILE)).toThrow(/missing required field "reviewer"/)
  })

  it('rejects an id that does not match the file name', () => {
    expect(() => parseSheet(VALID, 'data/indicators/other.yaml')).toThrow(/does not match the file name/)
  })

  it('rejects an unknown color', () => {
    expect(() => parseSheet(withChange('color: green', 'color: blue'), FILE)).toThrow(SheetError)
  })

  it('rejects a malformed condition and names the file and rule', () => {
    expect(() => parseSheet(withChange('value >= 1', 'value => 1'), FILE)).toThrow(
      /test-indicator\.yaml: rule 1 \("Ok"\)/,
    )
  })

  it('rejects a condition that reads a value the sheet does not have', () => {
    expect(() => parseSheet(withChange('value >= 1', 'systolic >= 1'), FILE)).toThrow(/unknown value "systolic"/)
  })

  it('rejects a rule that cites an unknown source', () => {
    expect(() => parseSheet(withChange('source: s1}', 'source: s9}'), FILE)).toThrow(/unknown source "s9"/)
  })

  it('rejects an unknown measurement interval', () => {
    expect(() => parseSheet(withChange('interval: 1 day', 'interval: weekly'), FILE)).toThrow(/Unknown measurement interval/)
  })

  it('rejects an unknown interval basis', () => {
    expect(() => parseSheet(withChange('interval_basis: design', 'interval_basis: guess'), FILE)).toThrow(/interval_basis/)
  })

  it('requires a listed source when the interval comes from a source', () => {
    expect(() => parseSheet(withChange('interval_basis: design', 'interval_basis: source'), FILE)).toThrow(
      /interval_source/,
    )
    expect(
      parseSheet(withChange('interval_basis: design', 'interval_basis: source, interval_source: s1'), FILE).id,
    ).toBe('test-indicator')
  })

  it('requires a valid range for a number input', () => {
    expect(() => parseSheet(withChange('  value: {min: 0, max: 10, basis: design, note: x}', ''), FILE)).toThrow(
      /needs a valid_range/,
    )
    expect(() => parseSheet(withChange('  value: {min: 0', '  systolic: {min: 0'), FILE)).toThrow(
      /valid_range must cover exactly: value/,
    )
  })

  it('rejects a valid range with max below min or an unknown basis', () => {
    expect(() => parseSheet(withChange('max: 10', 'max: -1'), FILE)).toThrow(/max must be null or above min/)
    expect(() => parseSheet(withChange('basis: design, note', 'basis: hunch, note'), FILE)).toThrow(/basis/)
  })

  it('requires a daily target for a log', () => {
    expect(() => parseSheet(withChange('entry_kind: measurement', 'entry_kind: log'), FILE)).toThrow(/daily_target/)
  })
})
