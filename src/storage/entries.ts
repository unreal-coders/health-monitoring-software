// Saves and reads the logged entries in the browser's localStorage, so they are
// kept when the application is reloaded (MVP Scope 1.1, "History and trend").
// No backend and no accounts (MVP Scope 1.3).
//
// The store follows React's useSyncExternalStore contract, so a screen can read
// it with:
//
//   const entries = useSyncExternalStore(entryStore.subscribe, entryStore.getEntries)

import { getSheet } from '../catalog/sheets.ts'
import { entryValues } from '../domain/evaluate.ts'
import type { Entry } from '../domain/types.ts'

export const STORAGE_KEY = 'health-monitoring.entries.v1'

/** The part of the Web Storage API the store uses, so tests can pass a fake. */
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export interface EntryStore {
  /** All saved entries, oldest first. Returns the same array until something changes. */
  getEntries(): readonly Entry[]
  /** Checks the entry against its sheet, saves it, and returns it. Throws if it is invalid. */
  addEntry(entry: Entry): Entry
  /** Replaces every saved entry, for example to load a demonstration scenario. */
  replaceEntries(entries: readonly Entry[]): void
  /** Deletes every saved entry. */
  clearEntries(): void
  /** Calls the listener after every change. Returns a function that stops listening. */
  subscribe(listener: () => void): () => void
}

function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.indicatorId === 'string' &&
    typeof entry.takenAt === 'string' &&
    !Number.isNaN(Date.parse(entry.takenAt)) &&
    !!entry.values &&
    typeof entry.values === 'object' &&
    Object.values(entry.values).every((number) => typeof number === 'number' && Number.isFinite(number))
  )
}

/** Throws if the entry does not fit its sheet (unknown indicator, missing or invalid values, bad date). */
export function validateEntry(entry: Entry): void {
  if (!isEntry(entry)) throw new Error('The entry needs an indicatorId, a valid takenAt date, and numeric values')
  entryValues(getSheet(entry.indicatorId), entry)
}

function byDate(a: Entry, b: Entry): number {
  return Date.parse(a.takenAt) - Date.parse(b.takenAt)
}

function read(storage: KeyValueStorage): Entry[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('not a list')
    // Entries saved by an older version that no longer fit are skipped, not deleted.
    return parsed.filter(isEntry).sort(byDate)
  } catch {
    // Keep the unreadable data aside instead of losing it on the next save.
    storage.setItem(`${STORAGE_KEY}.unreadable`, raw)
    storage.removeItem(STORAGE_KEY)
    return []
  }
}

export function createEntryStore(storage: KeyValueStorage): EntryStore {
  let entries: readonly Entry[] = read(storage)
  const listeners = new Set<() => void>()

  const commit = (next: Entry[]) => {
    const sorted = next.sort(byDate)
    // Throws if storage is full or blocked; the in-memory list is only updated after a successful save.
    storage.setItem(STORAGE_KEY, JSON.stringify(sorted))
    entries = sorted
    for (const listener of listeners) listener()
  }

  return {
    getEntries: () => entries,
    addEntry(entry) {
      validateEntry(entry)
      const saved: Entry = { indicatorId: entry.indicatorId, takenAt: entry.takenAt, values: { ...entry.values } }
      commit([...entries, saved])
      return saved
    },
    replaceEntries(next) {
      next.forEach(validateEntry)
      commit(next.map((entry) => ({ ...entry, values: { ...entry.values } })))
    },
    clearEntries() {
      storage.removeItem(STORAGE_KEY)
      entries = []
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

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
    // Accessing localStorage throws when the browser blocks site data.
    const storage = globalThis.localStorage
    if (storage) return storage
  } catch {
    // Fall through to memory.
  }
  return memoryStorage()
}

/** The application's store: localStorage in the browser, memory when it is unavailable. */
export const entryStore: EntryStore = createEntryStore(browserStorage())
