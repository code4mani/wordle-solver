import { describe, it, expect } from 'vitest'
import { makeEmptyGrid, parseFeedback } from './feedback'

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

    const { pattern, includes, excludes } = parseFeedback(grid)
    expect(pattern).toBe('c....')
    expect(includes).toBe('ca')
    expect(excludes.split('').sort().join('')).toBe('enr'.split('').sort().join(''))
  })
})
