// Create a crew profile: validated form, computed age, avatar choice, and a live
// preview of the card as it will look in the picker.
import { useRef, useState, type FormEvent } from 'react'
import { AvatarIcon } from '../components/icons.tsx'
import { ProfileCard } from '../components/ProfileCard.tsx'
import {
  ageFrom,
  AVATARS,
  callSignOf,
  CREW_ROLES,
  profileStore,
  type Avatar,
  type CrewRole,
} from '../profiles/profileStore.ts'
import { SimpleHeader } from './SimpleHeader.tsx'
import '../components/form.css'
import './profiles.css'

type Field = 'name' | 'birthDate'
type Errors = Partial<Record<Field, string>>

function today(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function validate(name: string, birthDate: string): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = "Enter the crew member's name."
  if (!birthDate) errors.birthDate = 'Enter a date of birth.'
  else if (birthDate > today()) errors.birthDate = "Date of birth can't be in the future."
  else {
    const age = ageFrom(birthDate)
    if (!Number.isFinite(age) || age < 18 || age > 80) errors.birthDate = 'Enter a valid date of birth.'
  }
  return errors
}

interface ProfileSetupProps {
  onBack: () => void
}

export function ProfileSetup({ onBack }: ProfileSetupProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [role, setRole] = useState<CrewRole>('Mission specialist')
  const [callSign, setCallSign] = useState('')
  const [avatar, setAvatar] = useState<Avatar>('helmet')
  const [errors, setErrors] = useState<Errors>({})
  const [created, setCreated] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const age = birthDate && birthDate <= today() ? ageFrom(birthDate) : null
  const previewCallSign = callSignOf({ name: name || 'Crew member', callSign })

  const clearError = (field: Field) => setErrors((previous) => ({ ...previous, [field]: undefined }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(name, birthDate)
    setErrors(found)
    if (found.name) return nameRef.current?.focus()
    if (found.birthDate) return dateRef.current?.focus()

    const trimmedCallSign = callSign.trim().toUpperCase()
    profileStore.addProfile({
      name: name.trim(),
      birthDate,
      role,
      avatar,
      ...(trimmedCallSign ? { callSign: trimmedCallSign } : {}),
    })
    setCreated(name.trim())
    setName('')
    setBirthDate('')
    setCallSign('')
    setRole('Mission specialist')
    setAvatar('helmet')
    requestAnimationFrame(() => successRef.current?.focus())
  }

  return (
    <>
      <SimpleHeader meta="Profile setup // New" />
      <main className="app-main profiles-main">
        <div className="setup">
          <button type="button" className="link-action back-link" onClick={onBack}>
            Back to profiles
          </button>
          <p className="label-mono">Profile setup</p>
          <h1 className="setup-title">Create crew profile</h1>
          <p className="picker-subtitle">Add a crew member to this device so they can log readings.</p>

          {created && (
            <div ref={successRef} tabIndex={-1} role="status" className="alert alert-normal setup-success">
              <p className="label-mono setup-success-title">✓ Profile created</p>
              <p>{created} was added to the crew roster.</p>
              <button type="button" className="link-action" onClick={onBack}>
                Go to profiles
              </button>
            </div>
          )}

          <div className="setup-columns">
            <form className="card setup-form" onSubmit={handleSubmit} noValidate>
              <div className="setup-meta">
                <span className="label-mono">Crew profile // New</span>
                <span className="label-mono">Required *</span>
              </div>

              <label className="form-field">
                <span className="form-label">Full name *</span>
                <input
                  ref={nameRef}
                  type="text"
                  autoComplete="name"
                  value={name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  onChange={(event) => {
                    setName(event.target.value)
                    clearError('name')
                  }}
                />
                {errors.name && (
                  <span id="name-error" className="field-error">
                    {errors.name}
                  </span>
                )}
              </label>

              <div className="form-row">
                <label className="form-field">
                  <span className="form-label">Date of birth *</span>
                  <input
                    ref={dateRef}
                    type="date"
                    max={today()}
                    value={birthDate}
                    aria-invalid={errors.birthDate ? true : undefined}
                    aria-describedby={errors.birthDate ? 'birth-error' : undefined}
                    onChange={(event) => {
                      setBirthDate(event.target.value)
                      clearError('birthDate')
                    }}
                  />
                </label>
                <label className="form-field">
                  <span className="form-label">Age</span>
                  <input type="text" className="num" value={age === null ? '' : String(age)} readOnly tabIndex={-1} />
                </label>
              </div>
              {errors.birthDate && (
                <span id="birth-error" className="field-error">
                  {errors.birthDate}
                </span>
              )}

              <div className="form-row">
                <label className="form-field">
                  <span className="form-label">Crew role</span>
                  <select value={role} onChange={(event) => setRole(event.target.value as CrewRole)}>
                    {CREW_ROLES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span className="form-label">Call sign</span>
                  <input
                    type="text"
                    className="callsign-input"
                    maxLength={6}
                    placeholder={name.trim() ? callSignOf({ name }) : 'Initials'}
                    value={callSign}
                    onChange={(event) => setCallSign(event.target.value.toUpperCase())}
                  />
                </label>
              </div>

              <fieldset className="form-fieldset">
                <legend className="form-label">Avatar</legend>
                <div className="avatar-options">
                  {AVATARS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="avatar-option"
                      aria-pressed={item === avatar}
                      aria-label={item}
                      onClick={() => setAvatar(item)}
                    >
                      <AvatarIcon avatar={item} size={36} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <p className="setup-note">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="setup-lock">
                  <rect x="5" y="11" width="14" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                Profile data stays on this device. Nothing is sent to a server.
              </p>

              <div className="setup-actions">
                <button type="submit" className="btn btn-primary">
                  Create profile
                </button>
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                  Cancel
                </button>
              </div>
            </form>

            <aside className="setup-preview" aria-label="Preview">
              <p className="label-mono">Preview</p>
              <ProfileCard name={name.trim()} role={role} callSign={previewCallSign} avatar={avatar} />
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
