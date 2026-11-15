import { useState, useSyncExternalStore } from 'react'
import { getSheet } from './catalog/sheets.ts'
import { Disclaimer } from './components/Disclaimer.tsx'
import { Starfield } from './components/Starfield.tsx'
import { TopNav } from './components/TopNav.tsx'
import { ageFrom, callSignOf, profileStore, scenarioFor } from './profiles/profileStore.ts'
import { entryStore } from './storage/entries.ts'
import { Dashboard } from './screens/Dashboard.tsx'
import { IndicatorDetail, type DetailFocus } from './screens/IndicatorDetail.tsx'
import { ProfilePicker } from './screens/ProfilePicker.tsx'
import { ProfileSetup } from './screens/ProfileSetup.tsx'
import { buildEntries, SCENARIOS } from './screens/quickScenarios.ts'
import './screens/dashboard.css'

// Navigation lives in React state, not URL paths, so a reload works on GitHub Pages.
type Screen = 'profiles' | 'profile-setup' | 'dashboard' | 'detail'

/**
 * Picking a profile loads its demo scenario (option A: one shared set of
 * readings). A profile without a scenario starts with no readings.
 */
function loadReadingsFor(id: string) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioFor({ id }))
  if (scenario) entryStore.replaceEntries(buildEntries(scenario, new Date()))
  else entryStore.clearEntries()
}

function App() {
  const profiles = useSyncExternalStore(profileStore.subscribe, profileStore.getProfiles)
  const activeId = useSyncExternalStore(profileStore.subscribe, profileStore.getActiveId)
  const profile = profiles.find((item) => item.id === activeId) ?? null

  const [screen, setScreen] = useState<Screen>(() => (profileStore.getActiveId() ? 'dashboard' : 'profiles'))
  const [detail, setDetail] = useState<{ id: string; focus: DetailFocus } | null>(null)
  const [lastId, setLastId] = useState<string | null>(null)

  // Without an active profile, the app always shows the profile screens.
  const current: Screen = !profile && (screen === 'dashboard' || screen === 'detail') ? 'profiles' : screen

  if (current === 'profiles' || current === 'profile-setup') {
    return (
      <div className="app-shell">
        <Starfield />
        {current === 'profiles' ? (
          <ProfilePicker
            onPick={(id) => {
              loadReadingsFor(id)
              profileStore.setActive(id)
              setDetail(null)
              setLastId(null)
              setScreen('dashboard')
            }}
            onAdd={() => setScreen('profile-setup')}
          />
        ) : (
          <ProfileSetup onBack={() => setScreen('profiles')} />
        )}
        <Disclaimer />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Starfield />
      {profile && (
        <TopNav
          activeId="dashboard"
          onNavigate={() => setScreen('dashboard')}
          profile={{
            name: profile.name,
            callSign: callSignOf(profile),
            age: ageFrom(profile.birthDate),
            avatar: profile.avatar,
            onClick: () => setScreen('profiles'),
          }}
        />
      )}
      <main className="app-main">
        {current === 'detail' && detail ? (
          <IndicatorDetail
            key={`${detail.id}-${detail.focus}`}
            sheet={getSheet(detail.id)}
            focus={detail.focus}
            onBack={() => {
              setLastId(detail.id)
              setScreen('dashboard')
            }}
          />
        ) : (
          <Dashboard
            initialSelectedId={lastId}
            onOpenDetail={(id, focus = null) => {
              setDetail({ id, focus })
              setScreen('detail')
            }}
          />
        )}
      </main>
      <Disclaimer />
    </div>
  )
}

export default App
