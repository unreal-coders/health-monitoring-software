import { describe, expect, it } from 'vitest'
import { ACTIVE_KEY, ageFrom, callSignOf, createProfileStore, PROFILES_KEY, scenarioFor } from './profileStore.ts'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  }
}

describe('profileStore', () => {
  it('creates and saves four demo profiles when none are saved', () => {
    const storage = fakeStorage()
    const store = createProfileStore(storage)
    expect(store.getProfiles().map((profile) => profile.callSign)).toEqual(['CDR', 'FE-1', 'MS-1', 'MS-2'])
    expect(JSON.parse(storage.data.get(PROFILES_KEY) ?? '[]')).toHaveLength(4)
    expect(store.getActiveId()).toBeNull()
  })

  it('keeps saved profiles and adds new ones', () => {
    const storage = fakeStorage()
    const first = createProfileStore(storage)
    const added = first.addProfile({ name: 'Ana Ruiz', birthDate: '1991-02-03', role: 'Pilot', avatar: 'rocket' })
    const second = createProfileStore(storage)
    expect(second.getProfiles()).toHaveLength(5)
    expect(second.getProfiles().at(-1)).toEqual(added)
  })

  it('saves the active profile and drops an unknown one', () => {
    const storage = fakeStorage()
    const store = createProfileStore(storage)
    store.setActive('demo-fe1')
    expect(createProfileStore(storage).getActiveId()).toBe('demo-fe1')
    storage.data.set(ACTIVE_KEY, 'missing')
    expect(createProfileStore(storage).getActiveId()).toBeNull()
  })

  it('notifies listeners and returns the same array until something changes', () => {
    const store = createProfileStore(fakeStorage())
    const before = store.getProfiles()
    expect(store.getProfiles()).toBe(before)
    let calls = 0
    const stop = store.subscribe(() => calls++)
    store.setActive('demo-cdr')
    store.addProfile({ name: 'Ana Ruiz', birthDate: '1991-02-03', role: 'Pilot', avatar: 'rocket' })
    stop()
    store.setActive(null)
    expect(calls).toBe(2)
    expect(store.getProfiles()).not.toBe(before)
  })

  it('ignores broken saved data', () => {
    const store = createProfileStore(fakeStorage({ [PROFILES_KEY]: '{not json' }))
    expect(store.getProfiles()).toHaveLength(4)
  })
})

describe('ageFrom and callSignOf', () => {
  it('counts whole years and waits for the birthday', () => {
    expect(ageFrom('1990-11-15', new Date(2026, 10, 14))).toBe(35)
    expect(ageFrom('1990-11-14', new Date(2026, 10, 14))).toBe(36)
  })

  it('uses initials when there is no call sign', () => {
    expect(callSignOf({ name: 'ana maria ruiz soto' })).toBe('AMR')
    expect(callSignOf({ name: 'Ana Ruiz', callSign: ' fe-2 ' })).toBe('FE-2')
  })
})

describe('scenarioFor', () => {
  it('gives each demo profile a scenario and new profiles none', () => {
    const store = createProfileStore(fakeStorage())
    expect(store.getProfiles().map((profile) => scenarioFor(profile))).toEqual(['normal', 'gradual', 'acute', 'normal'])
    const added = store.addProfile({ name: 'Ana Ruiz', birthDate: '1991-02-03', role: 'Pilot', avatar: 'rocket' })
    expect(scenarioFor(added)).toBeNull()
  })
})
