// Start of shift: the crew member picks their profile. Choosing one makes it the
// active profile and opens the dashboard.
import { useSyncExternalStore } from 'react'
import { ProfileCard } from '../components/ProfileCard.tsx'
import { callSignOf, profileStore } from '../profiles/profileStore.ts'
import { SimpleHeader } from './SimpleHeader.tsx'
import './profiles.css'

interface ProfilePickerProps {
  onPick: (id: string) => void
  onAdd: () => void
}

export function ProfilePicker({ onPick, onAdd }: ProfilePickerProps) {
  const profiles = useSyncExternalStore(profileStore.subscribe, profileStore.getProfiles)

  return (
    <>
      <SimpleHeader meta={`Crew roster // ${profiles.length} ${profiles.length === 1 ? 'member' : 'members'}`} />
      <main className="app-main profiles-main">
        <div className="picker">
          <p className="label-mono">Start of shift</p>
          <h1 className="picker-title">Who's checking in?</h1>
          <p className="picker-subtitle">Choose your crew profile to log readings and see your status.</p>

          <ul className="picker-list">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <button type="button" className="picker-option" onClick={() => onPick(profile.id)}>
                  <ProfileCard
                    name={profile.name}
                    role={profile.role}
                    callSign={callSignOf(profile)}
                    avatar={profile.avatar}
                  />
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="picker-option" onClick={onAdd}>
                <span className="profile-card">
                  <span className="profile-tile profile-tile-add" aria-hidden="true">
                    <span className="profile-add-plus">+</span>
                  </span>
                  <span className="profile-card-name">Add crew member</span>
                  <span className="profile-card-role">New profile</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
