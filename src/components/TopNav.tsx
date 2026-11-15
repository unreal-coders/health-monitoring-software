// Top navigation: brand, tabs, and the active crew profile.
// Only the dashboard is in the MVP scope; the other tabs are visible but marked "Coming soon".
import { OrbitIcon } from './icons.tsx'
import { ProfileChip, type ProfileChipProps } from './ProfileChip.tsx'
import './topnav.css'

interface TopNavProps {
  activeId: string
  profile: ProfileChipProps
  onNavigate?: (id: string) => void
}

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', enabled: true },
  { id: 'log', label: 'Medical log', enabled: false },
  { id: 'missions', label: 'Mission and habits', enabled: false },
  { id: 'settings', label: 'Settings', enabled: false },
] as const

export function TopNav({ activeId, profile, onNavigate }: TopNavProps) {
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <div className="topnav-brand">
          <OrbitIcon />
          <span>Astronaut Health Monitor</span>
        </div>

        <nav aria-label="Main" className="topnav-tabs">
          <ul>
            {ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="topnav-tab"
                  aria-current={item.id === activeId ? 'page' : undefined}
                  aria-disabled={item.enabled ? undefined : 'true'}
                  aria-describedby={item.enabled ? undefined : 'topnav-soon'}
                  onClick={item.enabled ? () => onNavigate?.(item.id) : undefined}
                >
                  {item.label}
                  {!item.enabled && <span className="topnav-soon">Coming soon</span>}
                </button>
              </li>
            ))}
          </ul>
          <span id="topnav-soon" hidden>
            Coming soon. Not in the MVP scope yet.
          </span>
        </nav>

        <ProfileChip {...profile} />
      </div>
    </header>
  )
}
