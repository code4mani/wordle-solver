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
  const rowIndexRef = useRef(rowIndex)

  useEffect(() => {
    rowIndexRef.current = rowIndex
  }, [rowIndex])

  useEffect(() => {
    onChange?.(parseFeedback(grid))
  }, [grid, onChange])

  const letterStatuses = letterStatusMap(grid)

  const setRow = useCallback((r: number) => {
    setRowIndex(r)
    rowIndexRef.current = r
  }, [])

  const onScreenKey = useCallback((key: string) => {
    const r = rowIndexRef.current

    if (key === 'Backspace') {
      setGrid((g) => {
        const copy = g.map((row) => row.map((cell) => ({ ...cell })))
        let c = colIndexRef.current
        if (c > 0) c -= 1
        copy[r][c].letter = ''
        copy[r][c].status = 'empty'
        colIndexRef.current = c
        return copy
      })
      return
    }

    if (key === 'Enter') {
      const row = grid[r]
      if (row && row.every((cell) => cell.letter)) {
        const next = Math.min(r + 1, grid.length - 1)
        setRow(next)
        colIndexRef.current = 0
      }
      return
    }

    if (/^[a-zA-Z]$/.test(key)) {
      setGrid((g) => {
        const copy = g.map((row) => row.map((cell) => ({ ...cell })))
        const c = colIndexRef.current
        if (c < copy[r].length) {
          copy[r][c].letter = key.toLowerCase()
          copy[r][c].status = 'empty'
          colIndexRef.current = Math.min(c + 1, copy[r].length)
        }
        return copy
      })
      return
    }
  }, [grid, setRow])


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
      const r = rowIndexRef.current
      if (r >= grid.length) return
      const key = e.key
      if (/^[a-zA-Z]$/.test(key)) {
        setGrid((g) => {
          const copy = g.map((row) => row.map((cell) => ({ ...cell })))
          const c = colIndexRef.current
          if (c < copy[r].length) {
            copy[r][c].letter = key.toLowerCase()
            copy[r][c].status = 'empty'
            colIndexRef.current = Math.min(c + 1, copy[r].length)
          }
          return copy
        })
        e.preventDefault()
      } else if (key === 'Backspace') {
        setGrid((g) => {
          const copy = g.map((row) => row.map((cell) => ({ ...cell })))
          let c = colIndexRef.current
          if (c > 0) c -= 1
          copy[r][c].letter = ''
          copy[r][c].status = 'empty'
          colIndexRef.current = c
          return copy
        })
        e.preventDefault()
      } else if (key === 'Enter') {
        // If current row has 5 letters, move to next row
        const row = grid[r]
        if (row && row.every((cell) => cell.letter)) {
          const next = Math.min(r + 1, grid.length - 1)
          setRow(next)
          colIndexRef.current = 0
        }
        e.preventDefault()
      }
    },
    [grid, setRow],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  function applySuggestion(word: string) {
    setGrid((g) => {
      const copy = g.map((row) => row.map((cell) => ({ ...cell })))
      const r = rowIndexRef.current
      for (let i = 0; i < 5; i++) {
        copy[r][i].letter = word[i] || ''
        copy[r][i].status = 'empty'
      }
      // Place cursor at end of filled letters
      colIndexRef.current = Math.min(word.length, copy[r].length)
      return copy
    })
    onFillSuggestion?.(word)
  }

  function reset() {
    setGrid(makeEmptyGrid())
    setRow(0)
    colIndexRef.current = 0
  }

  return (
    <div className="grid-wrapper">
      <div className="grid">
        {grid.map((row, r) => (
          <div key={r} className={`row ${r === rowIndexRef.current ? 'active' : ''}`}>
            {row.map((cell, c) => {
              const isCurrent = r === rowIndexRef.current && c === colIndexRef.current
              return (
                <button
                  key={c}
                  className={`cell ${cell.status} ${isCurrent ? 'current' : ''}`}
                  data-empty={cell.status === 'empty'}
                  onClick={() => toggleStatus(r, c)}
                  aria-label={`r${r}c${c}`}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {cell.letter.toUpperCase()}
                </button>
              )
            })}
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
          <button onClick={() => setRow(Math.max(rowIndexRef.current - 1, 0))}>Prev Row</button>
          <button
            onClick={() => setRow(Math.min(rowIndexRef.current + 1, grid.length - 1))}
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
