import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Grid from './Grid'

describe('Grid keyboard/cursor behavior', () => {
  test('after filling a row and pressing Enter, next row receives first character at first column', () => {
    render(<Grid />)

    // Type 5 letters into row 0
    const letters = ['a', 'b', 'c', 'd', 'e']
    letters.forEach((ch) => {
      fireEvent.keyDown(window, { key: ch })
    })

    // Verify row 0 letters
    for (let i = 0; i < 5; i++) {
      const btn = screen.getByLabelText(`r0c${i}`)
      expect(btn.textContent).toBe(letters[i].toUpperCase())
    }

    // Cycle statuses on row 0 cells (click each once -> 'absent')
    for (let i = 0; i < 5; i++) {
      const btn = screen.getByLabelText(`r0c${i}`)
      fireEvent.click(btn)
      // optional: ensure class updated
      expect(btn.classList.contains('absent')).toBe(true)
    }

    // Press Enter to move to next row
    fireEvent.keyDown(window, { key: 'Enter' })

    // The first cell of row 1 should be marked as current
    const firstNext = screen.getByLabelText('r1c0')
    expect(firstNext.classList.contains('current')).toBe(true)

    // Type a character; it should appear in r1c0 (not r1c1)
    fireEvent.keyDown(window, { key: 'x' })
    expect(firstNext.textContent).toBe('X')

    const secondNext = screen.getByLabelText('r1c1')
    expect(secondNext.textContent).toBe('')
  })
})
