// Header for the profile screens: brand and a telemetry line, without tabs.
import { OrbitIcon } from '../components/icons.tsx'
import '../components/topnav.css'

export function SimpleHeader({ meta }: { meta: string }) {
  return (
    <header className="topnav">
      <div className="topnav-inner simple-header">
        <div className="topnav-brand">
          <OrbitIcon />
          <span>Astronaut Health Monitor</span>
        </div>
        <span className="label-mono">{meta}</span>
      </div>
    </header>
  )
}
