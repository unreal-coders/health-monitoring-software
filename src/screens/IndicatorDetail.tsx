import { useState, useSyncExternalStore, type CSSProperties } from 'react'
import { EntryForm } from '../components/EntryForm.tsx'
import { EscalationAlert } from '../components/EscalationAlert.tsx'
import { GuidancePanel } from '../components/GuidancePanel.tsx'
import { HistoryChart } from '../components/HistoryChart.tsx'
import { IndicatorCard } from '../components/IndicatorCard.tsx'
import { evaluateStatus } from '../domain/evaluate.ts'
import type { IndicatorSheet } from '../domain/types.ts'
import { entryStore } from '../storage/entries.ts'

interface IndicatorDetailProps {
  sheet: IndicatorSheet
  onBack: () => void
}

/** Everything about one indicator: status, escalation, logging, history, and guidance. */
export function IndicatorDetail({ sheet, onBack }: IndicatorDetailProps) {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  const [now] = useState(() => new Date())
  const result = evaluateStatus(sheet, entries, now)

  return (
    <section style={stackStyle}>
      <button type="button" onClick={onBack} style={backStyle}>
        Back to overview
      </button>

      <IndicatorCard name={sheet.name} unit={sheet.unit} result={result} />

      <EscalationAlert contact={result.contactFlightSurgeon} noContactText={sheet.astronaut_text.no_contact} />

      <div style={columnsStyle}>
        <section aria-labelledby="log-title" style={panelStyle}>
          <h3 id="log-title" style={titleStyle}>
            Log a reading
          </h3>
          <EntryForm sheet={sheet} />
        </section>

        <section aria-labelledby="history-title" style={panelStyle}>
          <h3 id="history-title" style={titleStyle}>
            History
          </h3>
          <HistoryChart sheet={sheet} entries={entries} now={now} />
        </section>
      </div>

      <GuidancePanel sheet={sheet} />
    </section>
  )
}

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

const backStyle: CSSProperties = {
  alignSelf: 'flex-start',
  minHeight: '44px',
  padding: '0 1rem',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  font: 'inherit',
  cursor: 'pointer',
}

const columnsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
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