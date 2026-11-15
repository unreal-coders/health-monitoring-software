import { Overview } from './screens/Overview.tsx'

function App() {
  return (
    <main style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Astronaut Health Monitor</h1>
      <p
        role="note"
        style={{
          margin: '0 0 1.5rem',
          padding: '0.75rem 1rem',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        This is a decision-support prototype built for the NASA Space Apps Challenge. It is not a
        medical device, does not diagnose conditions, and does not replace the flight surgeon. Demo
        data is synthetic.
      </p>
      <Overview />
    </main>
  )
}

export default App