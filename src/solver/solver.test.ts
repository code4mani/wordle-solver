import { describe, it, expect } from 'vitest'
import { matchPattern, filterWords } from './solver'

describe('solver basics', () => {
  it('matchPattern works with wildcards', () => {
    expect(matchPattern('crane', 'c.a.e')).toBe(true)
    expect(matchPattern('crane', 'c.r.n')).toBe(false)
  })

  it('filterWords respects min/max counts (includes/excludes)', () => {
    const words = ['crane', 'slate', 'apple']
    expect(filterWords(words, '.....', { a: 1 }, {})).toEqual(['crane', 'slate', 'apple'])
    expect(filterWords(words, '.....', { p: 1 }, {})).toEqual(['apple'])
    expect(filterWords(words, '.....', {}, { p: 0 })).toEqual(['crane', 'slate'])
  })

  it('handles repeated-letter constraints', () => {
    const words = ['apple', 'spare', 'spade', 'caper']
    // enforce exactly one 'p'
    expect(filterWords(words, '.....', { p: 1 }, { p: 1 })).toEqual(['spare', 'spade', 'caper'])
  })
})
