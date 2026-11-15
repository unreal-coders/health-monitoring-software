// Form to log a reading. Fields, unit, and the "how to measure" text come from
// the sheet; validation of the value happens in storage/ against the sheet.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { OutOfRangeError } from '../domain/evaluate.ts'
import type { IndicatorSheet } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'
import './form.css'

type RawValues = Record<string, string>

const FORM_ERROR = 'Fill in every field before saving.'

class FormError extends Error {}

/** Names of the values the form asks for, depending on how the sheet is entered. */
function fieldNames(sheet: IndicatorSheet): string[] {
  if (sheet.input === 'questionnaire') return sheet.questionnaire?.items.map((item) => item.id) ?? []
  if (sheet.input === 'checklist') return sheet.checklist?.map((item) => item.id) ?? []
  return sheet.fields ?? ['value']
}

function fieldLabel(sheet: IndicatorSheet, name: string): string {
  if (name === 'value') return sheet.name
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
}

/** Turns what the astronaut typed or selected into the values the sheet expects. */
function buildValues(sheet: IndicatorSheet, raw: RawValues): Record<string, number> {
  const values: Record<string, number> = {}
  if (sheet.input === 'checklist') {
    for (const name of fieldNames(sheet)) values[name] = raw[name] === 'on' ? 1 : 0
    return values
  }
  for (const name of fieldNames(sheet)) {
    const text = raw[name]?.trim() ?? ''
    const number = Number(text)
    if (text === '' || !Number.isFinite(number)) throw new FormError(FORM_ERROR)
    values[name] = number
  }
  return values
}

function pad(number: number): string {
  return String(number).padStart(2, '0')
}

function localDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function localTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface EntryFormProps {
  sheet: IndicatorSheet
  /** Moves focus to the first value field when the form appears. */
  autoFocus?: boolean
}

export function EntryForm({ sheet, autoFocus = false }: EntryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [date, setDate] = useState(() => localDate(new Date()))
  const [time, setTime] = useState(() => localTime(new Date()))
  const [raw, setRaw] = useState<RawValues>({})
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!autoFocus) return
    const first = formRef.current?.querySelector<HTMLInputElement>('[data-first-field]')
    first?.focus()
    formRef.current?.scrollIntoView({ block: 'center' })
  }, [autoFocus])

  const update = (name: string, value: string | null) => {
    setRaw((previous) => {
      const next = { ...previous }
      if (value === null) delete next[name]
      else next[name] = value
      return next
    })
    setSaved(false)
    setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(false)
    try {
      const takenAt = new Date(`${date}T${time}`)
      if (Number.isNaN(takenAt.getTime())) throw new FormError('Choose a valid date and time.')
      const values = buildValues(sheet, raw)
      entryStore.addEntry({ indicatorId: sheet.id, takenAt: takenAt.toISOString(), values })
      const now = new Date()
      setRaw({})
      setDate(localDate(now))
      setTime(localTime(now))
      setError(null)
      setSaved(true)
    } catch (caught) {
      if (caught instanceof FormError || caught instanceof OutOfRangeError) setError(caught.message)
      else setError(FORM_ERROR)
    }
  }

  const howTo = sheet.astronaut_text.how_to ?? sheet.measurement.method
  const reminder = sheet.entry_kind === 'log' ? sheet.astronaut_text.reminder : undefined
  const numeric = sheet.input === undefined || sheet.input === 'number'

  return (
    <form ref={formRef} className="entry-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label className="form-field">
          <span className="form-label">Date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="form-field">
          <span className="form-label">Time</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
      </div>

      {numeric &&
        fieldNames(sheet).map((name, index) => (
          <label key={name} className="form-field">
            <span className="form-label">{fieldLabel(sheet, name)}</span>
            <span className="input-suffix">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                className="num"
                value={raw[name] ?? ''}
                aria-invalid={error ? true : undefined}
                style={sheet.unit ? { paddingRight: `calc(${Math.min(sheet.unit.length, 18)}ch + 2rem)` } : undefined}
                data-first-field={index === 0 ? '' : undefined}
                onChange={(event) => update(name, event.target.value)}
              />
              {sheet.unit && <span className="input-suffix-unit">{sheet.unit}</span>}
            </span>
          </label>
        ))}

      {sheet.input === 'questionnaire' && sheet.questionnaire && (
        <>
          <p className="form-prompt">{sheet.questionnaire.prompt}</p>
          {sheet.questionnaire.items.map((item, itemIndex) => (
            <fieldset key={item.id} className="form-fieldset">
              <legend className="form-label">{item.text}</legend>
              <div className="form-options">
                {sheet.questionnaire?.options.map((option, optionIndex) => (
                  <label key={option.score} className="form-option">
                    <input
                      type="radio"
                      name={`${sheet.id}-${item.id}`}
                      value={option.score}
                      checked={raw[item.id] === String(option.score)}
                      data-first-field={itemIndex === 0 && optionIndex === 0 ? '' : undefined}
                      onChange={() => update(item.id, String(option.score))}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </>
      )}

      {sheet.input === 'checklist' && (
        <fieldset className="form-fieldset">
          <legend className="form-label">Symptoms you have now</legend>
          <div className="form-options form-options-column">
            {sheet.checklist?.map((item, index) => (
              <label key={item.id} className="form-option">
                <input
                  type="checkbox"
                  checked={raw[item.id] === 'on'}
                  data-first-field={index === 0 ? '' : undefined}
                  onChange={(event) => update(item.id, event.target.checked ? 'on' : null)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {(howTo || reminder) && (
        <div className="how-to">
          <p className="label-mono">How to measure</p>
          {howTo && <p>{howTo}</p>}
          {reminder && <p>{reminder}</p>}
        </div>
      )}

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary form-submit">
        Save reading
      </button>

      {saved && (
        <p role="status" className="alert alert-normal form-saved">
          ✓ Reading saved. Status updated.
        </p>
      )}
    </form>
  )
}
