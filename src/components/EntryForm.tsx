import { useState, type CSSProperties, type FormEvent } from 'react'
import type { IndicatorSheet } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'

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
  const unit = sheet.unit ? ` (${sheet.unit})` : ''
  if (name === 'value') return `${sheet.name}${unit}`
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}${unit}`
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

/** Local date and time formatted for <input type="datetime-local">. */
function toLocalInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function EntryForm({ sheet }: { sheet: IndicatorSheet }) {
  const [takenAt, setTakenAt] = useState(() => toLocalInput(new Date()))
  const [raw, setRaw] = useState<RawValues>({})
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const update = (name: string, value: string | null) => {
    setRaw((previous) => {
      const next = { ...previous }
      if (value === null) delete next[name]
      else next[name] = value
      return next
    })
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(false)
    try {
      const time = Date.parse(takenAt)
      if (Number.isNaN(time)) throw new FormError('Choose a valid date and time.')
      const values = buildValues(sheet, raw)
      entryStore.addEntry({ indicatorId: sheet.id, takenAt: new Date(time).toISOString(), values })
      setRaw({})
      setTakenAt(toLocalInput(new Date()))
      setError(null)
      setSaved(true)
    } catch (caught) {
      setError(caught instanceof FormError ? caught.message : FORM_ERROR)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={formStyle}>
      {sheet.astronaut_text.how_to && <p style={hintStyle}>{sheet.astronaut_text.how_to}</p>}
      {sheet.entry_kind === 'log' && sheet.astronaut_text.reminder && (
        <p style={hintStyle}>{sheet.astronaut_text.reminder}</p>
      )}

      <label style={fieldStyle}>
        <span>Date and time</span>
        <input type="datetime-local" value={takenAt} onChange={(event) => setTakenAt(event.target.value)} />
      </label>

      {sheet.input === 'questionnaire' && sheet.questionnaire && (
        <>
          <p style={hintStyle}>{sheet.questionnaire.prompt}</p>
          {sheet.questionnaire.items.map((item) => (
            <fieldset key={item.id} style={fieldsetStyle}>
              <legend style={legendStyle}>{item.text}</legend>
              <div style={optionsStyle}>
                {sheet.questionnaire?.options.map((option) => (
                  <label key={option.score} style={optionStyle}>
                    <input
                      type="radio"
                      name={`${sheet.id}-${item.id}`}
                      value={option.score}
                      checked={raw[item.id] === String(option.score)}
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

      {sheet.input === 'checklist' &&
        sheet.checklist?.map((item) => (
          <label key={item.id} style={optionStyle}>
            <input
              type="checkbox"
              checked={raw[item.id] === 'on'}
              onChange={(event) => update(item.id, event.target.checked ? 'on' : null)}
            />
            {item.label}
          </label>
        ))}

      {(sheet.input === undefined || sheet.input === 'number') &&
        fieldNames(sheet).map((name) => (
          <label key={name} style={fieldStyle}>
            <span>{fieldLabel(sheet, name)}</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={raw[name] ?? ''}
              onChange={(event) => update(name, event.target.value)}
            />
          </label>
        ))}

      {error && (
        <p role="alert" style={errorStyle}>
          {error}
        </p>
      )}
      {saved && (
        <p role="status" style={hintStyle}>
          Entry saved.
        </p>
      )}
      <button type="submit" style={buttonStyle}>
        Save entry
      </button>
    </form>
  )
}

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
}

const fieldsetStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  border: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
}

const legendStyle: CSSProperties = {
  padding: 0,
  marginBottom: '0.375rem',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
}

const optionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
}

const optionStyle: CSSProperties = {
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: 'var(--font-size-sm)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
}

const errorStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-status-critical)',
  fontSize: 'var(--font-size-sm)',
}

const buttonStyle: CSSProperties = {
  minHeight: '44px',
  alignSelf: 'flex-start',
  padding: '0 1rem',
  background: 'var(--color-text)',
  color: 'var(--color-bg)',
  border: 0,
  borderRadius: '8px',
  font: 'inherit',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
}