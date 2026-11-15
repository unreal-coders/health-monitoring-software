import { useState } from 'react'
import { getSheet } from './catalog/sheets.ts'
import { TopNav } from './components/TopNav.tsx'
import { Dashboard } from './screens/Dashboard.tsx'
import { IndicatorDetail } from './screens/IndicatorDetail.tsx'
import './screens/dashboard.css'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <TopNav activeId="dashboard" />
      <main className="app-main">
        <p
          role="note"
          className="card"
          style={{ margin: '1rem 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}
        >
          This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a
          medical device, does not diagnose conditions, and does not replace the flight surgeon. Demo
          data is synthetic.
        </p>

        {selectedId ? (
          <IndicatorDetail sheet={getSheet(selectedId)} onBack={() => setSelectedId(null)} />
        ) : (
          <Dashboard onOpenDetail={setSelectedId} />
        )}
      </main>
    </>
  )
}

export default App