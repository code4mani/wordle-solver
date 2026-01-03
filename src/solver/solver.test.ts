import { describe, it, expect } from 'vitest'
import { matchPattern, filterWords } from './solver'

describe('solver basics', () => {
  it('matchPattern works with wildcards', () => {
    expect(matchPattern('crane', 'c.a.e')).toBe(true)
    expect(matchPattern('crane', 'c.r.n')).toBe(false)
  })

  it('filterWords respects includes/excludes', () => {
    const words = ['crane', 'slate', 'apple']
    expect(filterWords(words, '.....', 'a', '')).toEqual(['crane', 'slate', 'apple'])
    expect(filterWords(words, '.....', 'p', '')).toEqual(['apple'])
    expect(filterWords(words, '.....', '', 'p')).toEqual(['crane', 'slate'])
  })
})
