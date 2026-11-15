import { describe, expect, it } from 'vitest'
import { compileCondition } from './condition.ts'

describe('compileCondition', () => {
  it('compares a single value with every operator', () => {
    expect(compileCondition('value < 35').evaluate({ value: 34.9 })).toBe(true)
    expect(compileCondition('value < 35').evaluate({ value: 35 })).toBe(false)
    expect(compileCondition('value <= 88').evaluate({ value: 88 })).toBe(true)
    expect(compileCondition('value > 100').evaluate({ value: 100 })).toBe(false)
    expect(compileCondition('value >= 600').evaluate({ value: 600 })).toBe(true)
  })

  it('joins comparisons with "and" and "or"', () => {
    const severe = compileCondition('systolic > 180 or diastolic > 120')
    expect(severe.evaluate({ systolic: 185, diastolic: 100 })).toBe(true)
    expect(severe.evaluate({ systolic: 150, diastolic: 125 })).toBe(true)
    expect(severe.evaluate({ systolic: 150, diastolic: 100 })).toBe(false)

    const range = compileCondition('value >= 60 and value <= 100')
    expect(range.evaluate({ value: 59 })).toBe(false)
    expect(range.evaluate({ value: 80 })).toBe(true)
  })

  it('gives "and" a higher precedence than "or"', () => {
    const condition = compileCondition('a > 1 or b > 1 and c > 1')
    expect(condition.evaluate({ a: 2, b: 0, c: 0 })).toBe(true)
    expect(condition.evaluate({ a: 0, b: 2, c: 0 })).toBe(false)
    expect(condition.evaluate({ a: 0, b: 2, c: 2 })).toBe(true)
  })

  it('lists the values it reads', () => {
    expect([...compileCondition('systolic >= 120 and diastolic < 80').variables]).toEqual(['systolic', 'diastolic'])
  })

  it('accepts decimals and extra spaces', () => {
    expect(compileCondition('  value   >=  37.5 ').evaluate({ value: 37.5 })).toBe(true)
  })

  it('rejects malformed conditions', () => {
    expect(() => compileCondition('')).toThrow(/value name/)
    expect(() => compileCondition('value = 3')).toThrow(/Unexpected character/)
    expect(() => compileCondition('value >')).toThrow(/a number/)
    expect(() => compileCondition('value > 3 value < 5')).toThrow(/"and", "or"/)
    expect(() => compileCondition('value > 3 and')).toThrow(/value name/)
  })

  it('fails when a value it reads is missing', () => {
    expect(() => compileCondition('value > 3').evaluate({})).toThrow(/Missing value "value"/)
  })
})
