import { useState } from 'react'
import { getSheet } from './catalog/sheets.ts'
import { Disclaimer } from './components/Disclaimer.tsx'
import { Starfield } from './components/Starfield.tsx'
import { TopNav } from './components/TopNav.tsx'
import { Dashboard } from './screens/Dashboard.tsx'
import { IndicatorDetail, type DetailFocus } from './screens/IndicatorDetail.tsx'
import './screens/dashboard.css'

// Placeholder until the profile store exists (redesign step 6).
const SAMPLE_PROFILE = { name: 'Commander', callSign: 'CDR', avatar: 'helmet' } as const

function App() {
  const [detail, setDetail] = useState<{ id: string; focus: DetailFocus } | null>(null)
  const [lastId, setLastId] = useState<string | null>(null)

  return (
    <div className="app-shell">
      <Starfield />
      <TopNav activeId="dashboard" profile={SAMPLE_PROFILE} />
      <main className="app-main">
        {detail ? (
          <IndicatorDetail
            key={`${detail.id}-${detail.focus}`}
            sheet={getSheet(detail.id)}
            focus={detail.focus}
            onBack={() => {
              setLastId(detail.id)
              setDetail(null)
            }}
          />
        ) : (
          <Dashboard initialSelectedId={lastId} onOpenDetail={(id, focus = null) => setDetail({ id, focus })} />
        )}
      </main>
      <Disclaimer />
    </div>
  )
}

export default App