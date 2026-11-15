// Decorative background: twinkling stars and shooting stars. Positions come from
// a fixed seed, so they stay the same on every render. Hidden from assistive tech.
import { useMemo } from 'react'
import './starfield.css'

interface StarfieldProps {
  stars?: number
  meteors?: number
  /** Length of each shooting star in pixels. */
  meteorLength?: number
}

/** Small deterministic pseudo-random generator (mulberry32). */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SIZES = [1.5, 2.2, 3.2]

export function Starfield({ stars = 140, meteors = 7, meteorLength = 160 }: StarfieldProps) {
  const field = useMemo(() => {
    const random = seeded(20261114)
    const starList = Array.from({ length: stars }, () => ({
      left: random() * 100,
      top: random() * 100,
      size: SIZES[Math.floor(random() * SIZES.length)],
      opacity: 0.45 + random() * 0.55,
      twinkle: random() < 0.4,
      delay: random() * 4,
    }))
    const meteorList = Array.from({ length: meteors }, (_, i) => ({
      left: 30 + random() * 70,
      top: random() * 45,
      duration: 7 + random() * 6,
      delay: i * 1.6 + random() * 2,
    }))
    return { starList, meteorList }
  }, [stars, meteors])

  return (
    <div className="starfield" aria-hidden="true">
      {field.starList.map((star, i) => (
        <span
          key={`s${i}`}
          className={star.twinkle ? 'star star-twinkle' : 'star'}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      {field.meteorList.map((meteor, i) => (
        <span
          key={`m${i}`}
          className="meteor"
          style={{
            left: `${meteor.left}%`,
            top: `${meteor.top}%`,
            width: meteorLength,
            animationDuration: `${meteor.duration}s`,
            animationDelay: `${meteor.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
