// Generic status words and symbols, shared by the badge, the wheel, and the chips.
// They name the status kind only; the medical text comes from the sheets.
import type { StatusKind } from '../domain/types.ts'

export const KIND_TEXT: Record<StatusKind, string> = {
  green: 'Normal',
  yellow: 'Caution',
  red: 'Critical',
  missing: 'No data',
  'no-reference': 'No reference',
}

export const KIND_SYMBOL: Record<StatusKind, string> = {
  green: '✓',
  yellow: '!',
  red: '✕',
  missing: '–',
  'no-reference': '?',
}
