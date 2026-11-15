// Crew profiles, saved in the browser's localStorage under "ahm.profiles" and
// "ahm.activeProfile". Option A of docs/redesign-spec.md (section 6): this store
// is separate from storage/, and the health entries stay one shared set for
// every profile. Separating entries per profile is the next step.

export const CREW_ROLES = [
  'Commander',
  'Pilot',
  'Flight engineer',
  'Mission specialist',
  'Payload specialist',
] as const

export type CrewRole = (typeof CREW_ROLES)[number]

export const AVATARS = ['helmet', 'rocket', 'planet', 'satellite'] as const

export type Avatar = (typeof AVATARS)[number]

export interface CrewProfile {
  id: string
  name: string
  /** ISO date, yyyy-mm-dd. Age is always computed from it, never stored. */
  birthDate: string
  role: CrewRole
  callSign?: string
  avatar: Avatar
}

export const PROFILES_KEY = 'ahm.profiles'
export const ACTIVE_KEY = 'ahm.activeProfile'

/** Synthetic demo crew, created when no profiles are saved yet. */
const DEMO_PROFILES: readonly CrewProfile[] = [
  { id: 'demo-cdr', name: 'Alex Rivera', birthDate: '1984-03-12', role: 'Commander', callSign: 'CDR', avatar: 'helmet' },
  { id: 'demo-fe1', name: 'Sam Okafor', birthDate: '1988-07-25', role: 'Flight engineer', callSign: 'FE-1', avatar: 'rocket' },
  { id: 'demo-ms1', name: 'Jordan Lee', birthDate: '1990-11-02', role: 'Mission specialist', callSign: 'MS-1', avatar: 'planet' },
  { id: 'demo-ms2', name: 'Taylor Kim', birthDate: '1992-05-18', role: 'Mission specialist', callSign: 'MS-2', avatar: 'satellite' },
]

/**
 * Demo scenario each demo profile loads when it is picked (ids from
 * screens/quickScenarios.ts). Profiles created by the user have none and
 * start without readings. Kept by id, so profiles saved before this map
 * existed still get their scenario.
 */
const DEMO_SCENARIOS: Readonly<Record<string, string>> = {
  'demo-cdr': 'normal',
  'demo-fe1': 'gradual',
  'demo-ms1': 'acute',
  'demo-ms2': 'normal',
}

export function scenarioFor(profile: Pick<CrewProfile, 'id'>): string | null {
  return DEMO_SCENARIOS[profile.id] ?? null
}

/** Whole years between the date of birth and now. */
export function ageFrom(birthDate: string, now: Date = new Date()): number {
  const [year, month, day] = birthDate.split('-').map(Number)
  let age = now.getFullYear() - year
  const beforeBirthday = now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)
  if (beforeBirthday) age--
  return age
}

/** Up to three initials, used when a profile has no call sign. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export function callSignOf(profile: Pick<CrewProfile, 'name' | 'callSign'>): string {
  return profile.callSign?.trim() ? profile.callSign.trim().toUpperCase() : initials(profile.name)
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function isProfile(value: unknown): value is CrewProfile {
  if (!value || typeof value !== 'object') return false
  const profile = value as Record<string, unknown>
  return (
    typeof profile.id === 'string' &&
    typeof profile.name === 'string' &&
    typeof profile.birthDate === 'string' &&
    CREW_ROLES.includes(profile.role as CrewRole) &&
    AVATARS.includes(profile.avatar as Avatar) &&
    (profile.callSign === undefined || typeof profile.callSign === 'string')
  )
}

/** In-memory fallback when localStorage is blocked (private mode, previews). */
function memoryStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

function browserStorage(): KeyValueStorage {
  try {
    const storage = window.localStorage
    const probe = '__ahm_probe__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return memoryStorage()
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export interface ProfileStore {
  /** Saved profiles. Returns the same array until something changes. */
  getProfiles(): readonly CrewProfile[]
  /** Id of the active profile, or null. */
  getActiveId(): string | null
  addProfile(profile: Omit<CrewProfile, 'id'>): CrewProfile
  setActive(id: string | null): void
  subscribe(listener: () => void): () => void
}

export function createProfileStore(storage: KeyValueStorage): ProfileStore {
  const listeners = new Set<() => void>()

  function read(): CrewProfile[] | null {
    try {
      const raw = storage.getItem(PROFILES_KEY)
      if (raw === null) return null
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(isProfile) : null
    } catch {
      return null
    }
  }

  function write(next: readonly CrewProfile[]) {
    try {
      storage.setItem(PROFILES_KEY, JSON.stringify(next))
    } catch {
      // Storage full or blocked: keep the profiles in memory for this session.
    }
  }

  let profiles: readonly CrewProfile[] = read() ?? []
  if (profiles.length === 0) {
    profiles = DEMO_PROFILES.map((profile) => ({ ...profile }))
    write(profiles)
  }

  let activeId: string | null = null
  try {
    activeId = storage.getItem(ACTIVE_KEY)
  } catch {
    activeId = null
  }
  if (activeId !== null && !profiles.some((profile) => profile.id === activeId)) activeId = null

  const notify = () => listeners.forEach((listener) => listener())

  return {
    getProfiles: () => profiles,
    getActiveId: () => activeId,
    addProfile(input) {
      const profile: CrewProfile = { ...input, id: newId() }
      profiles = [...profiles, profile]
      write(profiles)
      notify()
      return profile
    },
    setActive(id) {
      activeId = id
      try {
        if (id === null) storage.removeItem(ACTIVE_KEY)
        else storage.setItem(ACTIVE_KEY, id)
      } catch {
        // Blocked storage: the choice lasts for this session only.
      }
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const profileStore: ProfileStore = createProfileStore(
  typeof window === 'undefined' ? memoryStorage() : browserStorage(),
)
