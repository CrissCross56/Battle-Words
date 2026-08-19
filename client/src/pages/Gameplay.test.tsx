import { describe, expect, it } from 'vitest'
import { getHintColor, getHintSide } from './Gameplay'

describe('Gameplay hint helpers', () => {
  it('maps distance ranges to the expected colors', () => {
    expect(getHintColor('0')).toBe('#22c55e')
    expect(getHintColor('1')).toBe('#facc15')
    expect(getHintColor('2')).toBe('#f97316')
    expect(getHintColor('3-7')).toBe('#ef4444')
    expect(getHintColor('8-12')).toBe('#3b82f6')
    expect(getHintColor('13-17')).toBe('#a855f7')
    expect(getHintColor('18-22')).toBe('#a16207')
    expect(getHintColor('23-25')).toBe('#111827')
  })

  it('uses the hint direction to determine the covered side of a cell', () => {
    expect(getHintSide('left')).toBe('left')
    expect(getHintSide('right')).toBe('right')
    expect(getHintSide('correct')).toBe('full')
  })
})
