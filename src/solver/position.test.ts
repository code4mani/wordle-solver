import { describe, it, expect } from 'vitest'
import { makeEmptyGrid, parseFeedback } from '../utils/feedback'
import { filterWords } from './solver'

describe('position excludes (ADIEU case)', () => {
  it('filters out words with letter in excluded positions but keeps words with letters elsewhere', () => {
    // Guess: ADIEU
    // A: present (yellow) at pos 0 -> A must be present but not at pos0
    // D: absent
    // I: present (yellow) at pos2 -> I must be present but not at pos2
    // E: absent
    // U: absent
    const grid = makeEmptyGrid()
    const guess = 'adieU'.toLowerCase()
    grid[0][0].letter = 'a'; grid[0][0].status = 'present'
    grid[0][1].letter = 'd'; grid[0][1].status = 'absent'
    grid[0][2].letter = 'i'; grid[0][2].status = 'present'
    grid[0][3].letter = 'e'; grid[0][3].status = 'absent'
    grid[0][4].letter = 'u'; grid[0][4].status = 'absent'

    const { pattern, minCounts, maxCounts, positionExcludes } = parseFeedback(grid)

    const words = ['arise', 'brain', 'cairn', 'stain', 'train', 'coins']
    const filtered = filterWords(words, pattern, minCounts, maxCounts, positionExcludes)

    // Expectations:
    // - 'arise' starts with a -> excluded
    // - 'cairn' has i in pos2 -> excluded
    // - 'coins' doesn't have 'a' -> excluded
    // So remaining acceptable: 'brain', 'stain', 'train'
    expect(filtered.sort()).toEqual(['brain', 'stain', 'train'].sort())
  })
})