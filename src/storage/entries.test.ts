import { describe, expect, it, vi } from 'vitest'
import { createEntryStore, type KeyValueStorage, STORAGE_KEY, validateEntry } from './entries.ts'
import type { Entry } from '../domain/types.ts'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  const storage: KeyValueStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
  return { storage, data }
}

const heartRate = (value: number, takenAt = '2026-11-15T08:00:00Z'): Entry => ({
  indicatorId: 'heart-rate',
  takenAt,
  values: { value },
})

describe('createEntryStore', () => {
  it('starts empty and saves added entries to storage', () => {
    const { storage, data } = fakeStorage()
    const store = createEntryStore(storage)
    expect(store.getEntries()).toEqual([])

    store.addEntry(heartRate(72))
    expect(store.getEntries()).toEqual([heartRate(72)])
    expect(JSON.parse(data.get(STORAGE_KEY)!)).toEqual([heartRate(72)])
  })

  it('keeps entries across reloads', () => {
    const { storage } = fakeStorage()
    createEntryStore(storage).addEntry(heartRate(72))
    expect(createEntryStore(storage).getEntries()).toEqual([heartRate(72)])
  })

  it('keeps entries sorted by date, oldest first', () => {
    const store = createEntryStore(fakeStorage().storage)
    store.addEntry(heartRate(80, '2026-11-15T10:00:00Z'))
    store.addEntry(heartRate(70, '2026-11-15T06:00:00Z'))
    expect(store.getEntries().map((entry) => entry.values.value)).toEqual([70, 80])
  })

  it('returns the same array until something changes, as useSyncExternalStore needs', () => {
    const store = createEntryStore(fakeStorage().storage)
    const first = store.getEntries()
    expect(store.getEntries()).toBe(first)
    store.addEntry(heartRate(72))
    expect(store.getEntries()).not.toBe(first)
  })

  it('notifies listeners after each change until they unsubscribe', () => {
    const store = createEntryStore(fakeStorage().storage)
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.addEntry(heartRate(72))
    store.clearEntries()
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
    store.addEntry(heartRate(72))
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('clears every entry', () => {
    const { storage, data } = fakeStorage()
    const store = createEntryStore(storage)
    store.addEntry(heartRate(72))
    store.clearEntries()
    expect(store.getEntries()).toEqual([])
    expect(data.has(STORAGE_KEY)).toBe(false)
  })

  it('replaces all entries, for example with a demonstration scenario', () => {
    const store = createEntryStore(fakeStorage().storage)
    store.addEntry(heartRate(72))
    store.replaceEntries([heartRate(60), heartRate(65, '2026-11-14T08:00:00Z')])
    expect(store.getEntries().map((entry) => entry.values.value)).toEqual([65, 60])
  })

  it('rejects invalid entries without saving anything', () => {
    const { storage, data } = fakeStorage()
    const store = createEntryStore(storage)
    expect(() => store.addEntry({ indicatorId: 'nope', takenAt: '2026-11-15T08:00:00Z', values: { value: 1 } })).toThrow(
      /No indicator sheet/,
    )
    expect(() => store.addEntry({ indicatorId: 'blood-pressure', takenAt: '2026-11-15T08:00:00Z', values: { systolic: 120 } })).toThrow(
      /diastolic/,
    )
    expect(() => store.addEntry(heartRate(72, 'yesterday'))).toThrow(/valid takenAt/)
    expect(() => store.addEntry(heartRate(Number.NaN))).toThrow(/numeric values/)
    expect(() => store.addEntry(heartRate(900))).toThrow(/outside the accepted values/)
    expect(() => store.replaceEntries([heartRate(72), heartRate(Number.NaN)])).toThrow()
    expect(store.getEntries()).toEqual([])
    expect(data.has(STORAGE_KEY)).toBe(false)
  })

  it('does not change the list when storage refuses to save', () => {
    const { storage } = fakeStorage()
    const store = createEntryStore({
      ...storage,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })
    expect(() => store.addEntry(heartRate(72))).toThrow(/QuotaExceeded/)
    expect(store.getEntries()).toEqual([])
  })

  it('keeps unreadable data aside instead of losing it', () => {
    const { storage, data } = fakeStorage({ [STORAGE_KEY]: '{not json' })
    expect(createEntryStore(storage).getEntries()).toEqual([])
    expect(data.get(`${STORAGE_KEY}.unreadable`)).toBe('{not json')
    expect(data.has(STORAGE_KEY)).toBe(false)
  })

  it('skips saved entries that no longer have the right shape', () => {
    const saved = [heartRate(72), { indicatorId: 'heart-rate', takenAt: 'bad', values: {} }, 'junk']
    const { storage } = fakeStorage({ [STORAGE_KEY]: JSON.stringify(saved) })
    expect(createEntryStore(storage).getEntries()).toEqual([heartRate(72)])
  })
})

describe('validateEntry', () => {
  it('accepts entries that fit their sheet', () => {
    expect(() => validateEntry(heartRate(72))).not.toThrow()
    expect(() =>
      validateEntry({ indicatorId: 'mood', takenAt: '2026-11-15T08:00:00Z', values: { interest: 1, down: 2 } }),
    ).not.toThrow()
  })
})
