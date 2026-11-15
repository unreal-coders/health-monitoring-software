// Active crew profile in the top navigation. Opens the profile screen.
import { AvatarIcon, type AvatarKind } from './icons.tsx'

export interface ProfileChipProps {
  name: string
  callSign: string
  /** Age in years, computed from the date of birth. Omitted when unknown. */
  age?: number
  avatar: AvatarKind
  /** Opens the profile screen. Without it the chip is shown but not actionable. */
  onClick?: () => void
}

export function ProfileChip({ name, callSign, age, avatar, onClick }: ProfileChipProps) {
  const meta = age === undefined ? callSign : `${callSign} · Age ${age}`
  return (
    <button
      type="button"
      className="profile-chip"
      onClick={onClick}
      aria-disabled={onClick ? undefined : 'true'}
      aria-label={`${name}, switch profile`}
      title={onClick ? undefined : 'Coming soon'}
    >
      <span className="profile-chip-text">
        <span className="profile-chip-name">{name}</span>
        <span className="profile-chip-meta label-mono">{meta}</span>
      </span>
      <span className="profile-chip-avatar">
        <AvatarIcon avatar={avatar} size={26} />
      </span>
    </button>
  )
}
