// Display formatting shared by the screens. No medical values live here.

/**
 * The sheet's unit when it is short enough for the wheel (a symbol or an
 * abbreviation such as "mg/dL", "%", or "°C"); otherwise null, and the full
 * unit is shown only in the selected card.
 */
export function shortUnit(unit: string | null): string | null {
  if (!unit) return null
  return !/\s/.test(unit) && unit.length <= 5 ? unit : null
}

export function formatDay(time: number): string {
  return new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateTime(time: number): string {
  return new Date(time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "gravity-fields" -> "Gravity fields". */
export function hazardName(id: string): string {
  const text = id.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
