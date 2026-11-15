import { useState } from 'react'
import { getSheet } from './catalog/sheets.ts'
import { Disclaimer } from './components/Disclaimer.tsx'
import { Starfield } from './components/Starfield.tsx'
import { TopNav } from './components/TopNav.tsx'
import { Dashboard } from './screens/Dashboard.tsx'
import { IndicatorDetail } from './screens/IndicatorDetail.tsx'
import './screens/dashboard.css'

// Placeholder until the profile store exists (redesign step 6).
const SAMPLE_PROFILE = { name: 'Commander', callSign: 'CDR', avatar: 'helmet' } as const

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="app-shell">
      <Starfield />
      <TopNav activeId="dashboard" profile={SAMPLE_PROFILE} />
      <main className="app-main">
        {selectedId ? (
          <IndicatorDetail sheet={getSheet(selectedId)} onBack={() => setSelectedId(null)} />
        ) : (
          <Dashboard onOpenDetail={setSelectedId} />
        )}
      </main>
      <Disclaimer />
    </div>
  )
}

export default App