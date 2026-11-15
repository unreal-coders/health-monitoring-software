// Shared SVG icons. They draw with currentColor, so the caller sets the color
// with a CSS variable. All are decorative (aria-hidden): the text next to them
// carries the meaning.
import type { StatusKind } from '../domain/types.ts'

interface IconProps {
  size?: number
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Status icons: check, warning triangle, octagon, dash, and question mark. */
export function StatusIcon({ kind, size = 12 }: IconProps & { kind: StatusKind }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...stroke}>
      {kind === 'green' && <polyline points="5 12.5 10 17.5 19 7" />}
      {kind === 'yellow' && (
        <>
          <path d="M12 3 L22 20 H2 Z" />
          <line x1="12" y1="9.5" x2="12" y2="14" />
          <line x1="12" y1="17" x2="12" y2="17.01" />
        </>
      )}
      {kind === 'red' && (
        <>
          <polygon points="8 2.5 16 2.5 21.5 8 21.5 16 16 21.5 8 21.5 2.5 16 2.5 8" />
          <line x1="12" y1="7.5" x2="12" y2="13" />
          <line x1="12" y1="16.5" x2="12" y2="16.51" />
        </>
      )}
      {kind === 'missing' && <line x1="6" y1="12" x2="18" y2="12" />}
      {kind === 'no-reference' && (
        <>
          <path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.2V15" />
          <line x1="12" y1="18.5" x2="12" y2="18.51" />
        </>
      )}
    </svg>
  )
}

export function ClockIcon({ size = 12 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  )
}

export function PhoneIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...stroke}>
      <path d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 7.1 7.1l1.4-2.3L21 15.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
    </svg>
  )
}

export function OrbitIcon({ size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" {...stroke} strokeWidth={1.75}>
      <circle cx="16" cy="16" r="5" />
      <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(-25 16 16)" />
      <circle cx="27.2" cy="10.6" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export type AvatarKind = 'helmet' | 'rocket' | 'planet' | 'satellite'

/** Crew profile avatars. */
export function AvatarIcon({ avatar, size = 28 }: IconProps & { avatar: AvatarKind }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" {...stroke} strokeWidth={1.75}>
      {avatar === 'helmet' && (
        <>
          <path d="M6 18a10 10 0 0 1 20 0v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
          <path d="M10 17a6 4 0 0 1 12 0v2a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
          <line x1="16" y1="5" x2="16" y2="8" />
        </>
      )}
      {avatar === 'rocket' && (
        <>
          <path d="M16 3c4.5 3.5 6 8.5 5 15h-10c-1-6.5.5-11.5 5-15z" />
          <circle cx="16" cy="11.5" r="2" />
          <path d="M11 15l-4 4v4l4.5-2M21 15l4 4v4l-4.5-2" />
          <path d="M14 21.5v4M18 21.5v4" />
        </>
      )}
      {avatar === 'planet' && (
        <>
          <circle cx="16" cy="16" r="7.5" />
          <ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(-20 16 16)" />
        </>
      )}
      {avatar === 'satellite' && (
        <>
          <rect x="12.5" y="12.5" width="7" height="7" transform="rotate(45 16 16)" />
          <rect x="3" y="6" width="7" height="5" transform="rotate(45 6.5 8.5)" />
          <rect x="22" y="21" width="7" height="5" transform="rotate(45 25.5 23.5)" />
          <path d="M9 9l3.5 3.5M23 23l-3.5-3.5" />
          <path d="M21.5 6.5a5 5 0 0 1 4 4" />
        </>
      )}
    </svg>
  )
}
