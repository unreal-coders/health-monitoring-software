// Guidance from the sheet as an accordion. Every text comes from the sheet or
// from the current StatusResult; the first section starts open.
import type { ReactNode } from 'react'
import type { IndicatorSheet, StatusResult } from '../domain/types.ts'
import { hazardName } from './format.ts'

interface GuidancePanelProps {
  sheet: IndicatorSheet
  result: StatusResult
}

function Section({ title, open = false, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details className="guide-section" open={open}>
      <summary className="guide-summary">{title}</summary>
      <div className="guide-body">{children}</div>
    </details>
  )
}

export function GuidancePanel({ sheet, result }: GuidancePanelProps) {
  const { mechanism, measurement, flight_surgeon: surgeon } = sheet

  return (
    <section className="card guide" aria-labelledby="guidance-title">
      <h2 id="guidance-title" className="card-title">
        Guidance
      </h2>

      <Section title="Why we measure it" open>
        <p>{mechanism.summary}</p>
        {mechanism.detail?.map((item) => (
          <p key={item.text}>{item.text}</p>
        ))}
        {mechanism.hazards.length > 0 && (
          <div className="guide-tags">
            <span className="label-mono">Spaceflight hazards</span>
            <ul>
              {mechanism.hazards.map((hazard) => (
                <li key={hazard} className="guide-tag">
                  {hazardName(hazard)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="How to measure on board">
        {measurement.method && <p>{measurement.method}</p>}
        {sheet.astronaut_text.how_to && <p>{sheet.astronaut_text.how_to}</p>}
      </Section>

      <Section title="What to do now">
        <p>{result.text}</p>
      </Section>

      <Section title="When to contact the flight surgeon">
        <p>{surgeon.when_to_contact}</p>
      </Section>

      <Section title="If there is no real-time contact">
        <p>{surgeon.if_no_real_time_contact}</p>
      </Section>

      {sheet.countermeasures.length > 0 && (
        <Section title="Countermeasures">
          <ul>
            {sheet.countermeasures.map((item) => (
              <li key={item.text}>{item.text}</li>
            ))}
          </ul>
        </Section>
      )}

      {sheet.limitations.length > 0 && (
        <Section title="Limitations">
          <ul>
            {sheet.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`Sources (${sheet.sources.length})`}>
        <ul>
          {sheet.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <span className="guide-source-meta">
                {` · ${source.publisher}${source.locator ? ` (${source.locator})` : ''}`}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </section>
  )
}
