// Permanent notice (MVP Scope, section 1), fixed to the bottom of every screen.
// The first line is the exact MVP text; the second is the design attribution.
// It publishes its height as --disclaimer-height so floating buttons can sit
// above it without covering it.
import { useEffect, useRef } from 'react'

export function Disclaimer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = ref.current
    if (!footer) return
    const root = document.documentElement
    const update = () => root.style.setProperty('--disclaimer-height', `${footer.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(footer)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--disclaimer-height')
    }
  }, [])

  return (
    <footer ref={ref} role="note" className="disclaimer">
      <svg className="disclaimer-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
      <div>
        <p className="disclaimer-text">
          This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a medical device,
          does not diagnose conditions, and does not replace the flight surgeon. Demo data is synthetic.
        </p>
        <p className="disclaimer-credit">
          Unofficial interface inspired by the NASA Web Design System. Not affiliated with NASA.
        </p>
      </div>
    </footer>
  )
}
