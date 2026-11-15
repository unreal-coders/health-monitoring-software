import { useState, useSyncExternalStore, type CSSProperties } from 'react'
import { IndicatorCard } from '../components/IndicatorCard.tsx'
import { sheets } from '../catalog/sheets.ts'
import { evaluateStatus } from '../domain/evaluate.ts'
import { entryStore } from '../storage/entries.ts'

/** Current status of every covered indicator at a glance (MVP Scope 1.1, "Overview"). */
export function Overview() {
  const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)
  // Taken once when the screen mounts, so the render stays pure.
  const [now] = useState(() => new Date())

  return (
    <section>
      <h2 style={headingStyle}>Status overview</h2>
      <div style={gridStyle}>
        {sheets.map((sheet) => (
          <IndicatorCard
            key={sheet.id}
            name={sheet.name}
            unit={sheet.unit}
            result={evaluateStatus(sheet, entries, now)}
          />
        ))}
      </div>
    </section>
  )
}

const headingStyle: CSSProperties = {
  margin: '0 0 1rem',
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1rem',
}