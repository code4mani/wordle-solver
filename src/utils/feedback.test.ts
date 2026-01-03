import { describe, it, expect } from 'vitest'
import { makeEmptyGrid, parseFeedback, letterStatusMap } from './feedback'

describe('feedback parser', () => {
  it('parses simple green and absent letters', () => {
    const grid = makeEmptyGrid()
    // place word 'crane' on row 0 with feedback: c correct, r absent, a present, n absent, e absent
    grid[0][0].letter = 'c'
    grid[0][0].status = 'correct'
    grid[0][1].letter = 'r'
    grid[0][1].status = 'absent'
    grid[0][2].letter = 'a'
    grid[0][2].status = 'present'
    grid[0][3].letter = 'n'
    grid[0][3].status = 'absent'
    grid[0][4].letter = 'e'
    grid[0][4].status = 'absent'

    const { pattern, includes, excludes, minCounts, maxCounts } = parseFeedback(grid)
    expect(pattern).toBe('c....')
    // includes contains letters with confirmed occurrences
    expect(includes.split('').sort().join('')).toBe('ac'.split('').sort().join(''))
    expect(excludes.split('').sort().join('')).toBe('enr'.split('').sort().join(''))

    expect(minCounts).toEqual({ c: 1, a: 1, r: 0, n: 0, e: 0 })
    expect(maxCounts).toEqual({ r: 0, n: 0, e: 0 })
  })

  it('computes letter status map (highest severity)', () => {
    const g = makeEmptyGrid()
    // a absent then present; b present; c correct
    g[0][0].letter = 'a'; g[0][0].status = 'absent'
    g[0][1].letter = 'a'; g[0][1].status = 'present'
    g[0][2].letter = 'b'; g[0][2].status = 'present'
    g[0][3].letter = 'c'; g[0][3].status = 'correct'

    const map = letterStatusMap(g)
    expect(map.a).toBe('present')
    expect(map.b).toBe('present')
    expect(map.c).toBe('correct')
  })
})
