import type { CSSProperties } from 'react'
import type { IndicatorSheet } from '../domain/types.ts'

/** Explains the indicator from its sheet: why it is measured, countermeasures, limits, and sources. */
export function GuidancePanel({ sheet }: { sheet: IndicatorSheet }) {
  return (
    <section aria-labelledby="guidance-title" style={panelStyle}>
      <h3 id="guidance-title" style={titleStyle}>
        About this indicator
      </h3>
      <p style={textStyle}>{sheet.mechanism.summary}</p>

      {sheet.countermeasures.length > 0 && (
        <>
          <h4 style={subtitleStyle}>What helps</h4>
          <ul style={listStyle}>
            {sheet.countermeasures.map((item) => (
              <li key={item.text}>{item.text}</li>
            ))}
          </ul>
        </>
      )}

      {sheet.limitations.length > 0 && (
        <>
          <h4 style={subtitleStyle}>Limits of this guidance</h4>
          <ul style={listStyle}>
            {sheet.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      <details>
        <summary style={summaryStyle}>Sources ({sheet.sources.length})</summary>
        <ul style={listStyle}>
          {sheet.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer" style={linkStyle}>
                {source.title}
              </a>
              {` · ${source.publisher}${source.locator ? ` (${source.locator})` : ''}`}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
}

const subtitleStyle: CSSProperties = {
  margin: '0.5rem 0 0',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
}

const textStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
}

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
}

const summaryStyle: CSSProperties = {
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
}

const linkStyle: CSSProperties = {
  color: 'var(--color-focus)',
}