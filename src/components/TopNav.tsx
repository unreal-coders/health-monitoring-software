interface TopNavProps {
  activeId: string
}

// Only the dashboard is in the MVP scope. The other tabs are shown disabled until they are defined.
const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', enabled: true },
  { id: 'log', label: 'Medical log', enabled: false },
  { id: 'missions', label: 'Mission & habits', enabled: false },
  { id: 'settings', label: 'Settings', enabled: false },
] as const

export function TopNav({ activeId }: TopNavProps) {
  return (
    <nav aria-label="Main" className="topnav">
      <ul>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              disabled={!item.enabled}
              aria-current={item.id === activeId ? 'page' : undefined}
              title={item.enabled ? undefined : 'Not in the MVP scope yet'}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}