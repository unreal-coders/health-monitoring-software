// Crew profile card, used by the profile picker and the live preview in setup.
// Option A: profiles share one set of readings, so the card shows no status.
import { AvatarIcon, type AvatarKind } from './icons.tsx'

interface ProfileCardProps {
  name: string
  role: string
  callSign: string
  avatar: AvatarKind
}

/** The square tile with the call sign and the avatar. */
export function ProfileTile({ callSign, avatar }: Pick<ProfileCardProps, 'callSign' | 'avatar'>) {
  return (
    <span className="profile-tile">
      <span className="profile-tile-callsign">{callSign}</span>
      <span className="profile-tile-avatar">
        <AvatarIcon avatar={avatar} size={64} />
      </span>
    </span>
  )
}

/** Tile plus name and role. */
export function ProfileCard({ name, role, callSign, avatar }: ProfileCardProps) {
  return (
    <span className="profile-card">
      <ProfileTile callSign={callSign} avatar={avatar} />
      <span className="profile-card-name">{name || 'Crew member'}</span>
      <span className="profile-card-role">{role}</span>
    </span>
  )
}
