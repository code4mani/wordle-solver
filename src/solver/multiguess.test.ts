import { describe, it, expect } from 'vitest'
import { makeEmptyGrid, parseFeedback } from '../utils/feedback'
import { filterWords } from './solver'

describe('multiple guesses do not sum confirmed counts', () => {
  it('ADIEU (A,I present) then BASIN (A,S,I present) should not require two As', () => {
    const grid = makeEmptyGrid()
    // ADIEU
    grid[0][0].letter = 'a'; grid[0][0].status = 'present'
    grid[0][1].letter = 'd'; grid[0][1].status = 'absent'
    grid[0][2].letter = 'i'; grid[0][2].status = 'present'
    grid[0][3].letter = 'e'; grid[0][3].status = 'absent'
    grid[0][4].letter = 'u'; grid[0][4].status = 'absent'

    // BASIN
    grid[1][0].letter = 'b'; grid[1][0].status = 'absent'
    grid[1][1].letter = 'a'; grid[1][1].status = 'present'
    grid[1][2].letter = 's'; grid[1][2].status = 'present'
    grid[1][3].letter = 'i'; grid[1][3].status = 'present'
    grid[1][4].letter = 'n'; grid[1][4].status = 'absent'

    const { pattern, minCounts, maxCounts, positionExcludes } = parseFeedback(grid)

    // minCounts for 'a' should be 1 (not 2)
    expect(minCounts.a).toBe(1)
    // positions exclude: a not at pos0 nor pos1
    expect(positionExcludes.a.sort()).toEqual([0,1])

    const words = ['sitar','arise','brain','cairn']
    const filtered = filterWords(words, pattern, minCounts, maxCounts, positionExcludes)

    expect(filtered).toContain('sitar')
    expect(filtered).not.toContain('arise')
  })
})