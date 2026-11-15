// Top navigation: the brand on the left, which returns to the dashboard from any
// view, and the active crew profile on the right.
import { OrbitIcon } from './icons.tsx'
import { ProfileChip, type ProfileChipProps } from './ProfileChip.tsx'
import './topnav.css'

interface TopNavProps {
  profile: ProfileChipProps
  /** Goes back to the dashboard. */
  onHome: () => void
}

export function TopNav({ profile, onHome }: TopNavProps) {
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <button
          type="button"
          className="topnav-brand topnav-home"
          aria-label="Astronaut Health Monitor, go to dashboard"
          onClick={onHome}
        >
          <OrbitIcon />
          <span className="topnav-brand-name">Astronaut Health Monitor</span>
        </button>

        <ProfileChip {...profile} />
      </div>
    </header>
  )
}
