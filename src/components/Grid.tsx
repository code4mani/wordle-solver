import React, { useCallback, useEffect, useRef, useState } from 'react'
import { makeEmptyGrid, Row, Cell, CellStatus, parseFeedback, letterStatusMap } from '../utils/feedback'
import Keyboard from './Keyboard'

type Props = {
  onChange?: (
    constraints: {
      pattern: string
      includes: string
      excludes: string
      minCounts?: Record<string, number>
      maxCounts?: Record<string, number>
      positionExcludes?: Record<string, number[]>
    },
  ) => void
  suggestions?: string[]
  onFillSuggestion?: (word: string) => void
}

export default function Grid({ onChange, suggestions = [], onFillSuggestion }: Props) {
  const [grid, setGrid] = useState<Row[]>(() => makeEmptyGrid())
  const [rowIndex, setRowIndex] = useState(0)
  const colIndexRef = useRef(0)

  useEffect(() => {
    onChange?.(parseFeedback(grid))
  }, [grid, onChange])

  const letterStatuses = letterStatusMap(grid)

  const onScreenKey = useCallback((key: string) => {
    if (key === 'Backspace') {
      setGrid((g) => {
        const copy = g.map((row) => row.map((cell) => ({ ...cell })))
        let c = colIndexRef.current
        if (c > 0) c -= 1
        copy[rowIndex][c].letter = ''
        copy[rowIndex][c].status = 'empty'
        colIndexRef.current = c
        return copy
      })
      return
    }

    if (key === 'Enter') {
      const row = grid[rowIndex]
      if (row && row.every((cell) => cell.letter)) {
        setRowIndex((r) => Math.min(r + 1, grid.length - 1))
        colIndexRef.current = 0
      }
      return
    }

    if (/^[a-zA-Z]$/.test(key)) {
      setGrid((g) => {
        const copy = g.map((row) => row.map((cell) => ({ ...cell })))
        const c = colIndexRef.current
        if (c < copy[rowIndex].length) {
          copy[rowIndex][c].letter = key.toLowerCase()
          copy[rowIndex][c].status = 'empty'
          colIndexRef.current = Math.min(c + 1, copy[rowIndex].length)
        }
        return copy
      })
      return
    }
  }, [grid, rowIndex])


  const toggleStatus = useCallback((r: number, c: number) => {
    setGrid((g) => {
      const copy = g.map((row) => row.map((cell) => ({ ...cell })))
      const cell = copy[r][c]
      const order: CellStatus[] = ['empty', 'absent', 'present', 'correct']
      const idx = order.indexOf(cell.status)
      const next = order[(idx + 1) % order.length]
      cell.status = next
      return copy
    })
  }, [])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (rowIndex >= grid.length) return
      const key = e.key
      if (/^[a-zA-Z]$/.test(key)) {
        setGrid((g) => {
          const copy = g.map((row) => row.map((cell) => ({ ...cell })))
          const c = colIndexRef.current
          if (c < copy[rowIndex].length) {
            copy[rowIndex][c].letter = key.toLowerCase()
            copy[rowIndex][c].status = 'empty'
            colIndexRef.current = Math.min(c + 1, copy[rowIndex].length)
          }
          return copy
        })
        e.preventDefault()
      } else if (key === 'Backspace') {
        setGrid((g) => {
          const copy = g.map((row) => row.map((cell) => ({ ...cell })))
          let c = colIndexRef.current
          if (c > 0) c -= 1
          copy[rowIndex][c].letter = ''
          copy[rowIndex][c].status = 'empty'
          colIndexRef.current = c
          return copy
        })
        e.preventDefault()
      } else if (key === 'Enter') {
        // If current row has 5 letters, move to next row
        const row = grid[rowIndex]
        if (row && row.every((cell) => cell.letter)) {
          setRowIndex((r) => Math.min(r + 1, grid.length - 1))
          colIndexRef.current = 0
        }
        e.preventDefault()
      }
    },
    [grid, rowIndex],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  function applySuggestion(word: string) {
    setGrid((g) => {
      const copy = g.map((row) => row.map((cell) => ({ ...cell })))
      const r = rowIndex
      for (let i = 0; i < 5; i++) {
        copy[r][i].letter = word[i] || ''
        copy[r][i].status = 'empty'
      }
      return copy
    })
    onFillSuggestion?.(word)
  }

  function reset() {
    setGrid(makeEmptyGrid())
    setRowIndex(0)
    colIndexRef.current = 0
  }

  return (
    <div className="grid-wrapper">
      <div className="grid">
        {grid.map((row, r) => (
          <div key={r} className={`row ${r === rowIndex ? 'active' : ''}`}>
            {row.map((cell, c) => (
              <button
                key={c}
                className={`cell ${cell.status}`}
                onClick={() => toggleStatus(r, c)}
                aria-label={`r${r}c${c}`}
              >
                {cell.letter.toUpperCase()}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid-actions">
        <div className="suggestions">
          <h3>Suggestions</h3>
          <div className="suggestion-list">
            {suggestions.slice(0, 10).map((s) => (
              <button key={s} onClick={() => applySuggestion(s)} className="suggestion">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="controls">
          <button onClick={() => setRowIndex((r) => Math.max(r - 1, 0))}>Prev Row</button>
          <button
            onClick={() => setRowIndex((r) => Math.min(r + 1, grid.length - 1))}
          >
            Next Row
          </button>
          <button onClick={reset}>Reset</button>
        </div>

        <Keyboard statuses={letterStatuses} onKey={onScreenKey} />

        <p className="hint muted">Type letters, press Enter to move to next row. Click tiles to cycle feedback (gray → yellow → green).</p>
      </div>
    </div>
  )
}
