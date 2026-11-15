// Types for the indicator sheets in data/indicators/ (see data/indicator-schema.md)
// and for the entries the astronaut logs. Only the fields the application reads
// are typed; the sheets carry more documentation fields.

export type Color = 'green' | 'yellow' | 'red'
export type EntryKind = 'measurement' | 'self-report' | 'log'
export type InputKind = 'number' | 'checklist' | 'questionnaire'
export type ContactFlag = boolean | 'if-symptoms'

export interface Rule {
  color: Color
  label: string
  when: string
  text: string
  contact_flight_surgeon: ContactFlag
  source: string | string[]
}

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  locator?: string
}

export interface ValidRange {
  min: number
  max: number | null
  basis: 'definition' | 'design'
  note: string
}

export interface QuestionnaireItem {
  id: string
  text: string
}

export interface QuestionnaireOption {
  label: string
  score: number
}

export interface Mechanism {
  summary: string
  hazards: string[]
  detail?: { text: string; source: string | string[] }[]
  sources: string[]
}

export interface Countermeasure {
  text: string
  source: string | string[]
}

export interface IndicatorSheet {
  id: string
  name: string
  domain: string
  entry_kind: EntryKind
  unit: string | null
  input?: InputKind
  fields?: string[]
  /** `mission` when the status uses the sum of all entries instead of the last one. */
  accumulation?: 'mission'
  mechanism: Mechanism
  measurement: {
    method: string | null
    sources?: string[]
    interval: string | null
    interval_basis?: 'source' | 'definition' | 'design'
    interval_source?: string
    interval_note: string
  }
  /** Accepted values per value name; entries outside are rejected as typing errors. */
  valid_range?: Record<string, ValidRange>
  checklist?: { id: string; label: string }[]
  questionnaire?: {
    prompt: string
    items: QuestionnaireItem[]
    options: QuestionnaireOption[]
    score: 'sum'
  }
  daily_target?: { value: number; unit: string; text: string }
  thresholds: {
    evaluation: 'first-match'
    applies_to?: string
    rules: Rule[]
    note: string
  }
  countermeasures: Countermeasure[]
  limitations: string[]
  flight_surgeon: {
    when_to_contact: string
    if_no_real_time_contact: string
  }
  astronaut_text: {
    missing: string
    no_contact: string
    no_reference?: string
    how_to?: string
    reminder?: string
    progress?: string
  }
  sources: Source[]
}

/** One logged entry. `values` holds one number per field: `value` for most
 * indicators, `systolic` and `diastolic` for blood pressure, one score per item
 * for a questionnaire, and 1 for each checked item of a checklist. */
export interface Entry {
  indicatorId: string
  takenAt: string // ISO 8601 date and time
  values: Record<string, number>
}

export type StatusKind = Color | 'no-reference' | 'missing'

export interface StatusResult {
  kind: StatusKind
  color: Color | null
  label: string | null
  text: string
  contactFlightSurgeon: ContactFlag
  /** The values the rules were evaluated with, or null when there is no entry. */
  evaluated: Record<string, number> | null
  /** True when the last entry is older than the sheet's measurement interval. */
  outdated: boolean
  rule: Rule | null
}