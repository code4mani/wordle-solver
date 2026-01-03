export type CellStatus = 'empty' | 'absent' | 'present' | 'correct'

export type Cell = {
  letter: string
  status: CellStatus
}

export type Row = Cell[]

export function makeEmptyGrid(rows = 6, cols = 5): Row[] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: '', status: 'empty' as CellStatus })),
  )
}

export function parseFeedback(grid: Row[]) {
  // pattern: green (correct) letters fixed; use '.' for unknown
  // includes: letters marked present or correct
  // excludes: letters marked absent that are not in includes
  const pattern = Array.from({ length: 5 }, () => '.')
  const includes = new Set<string>()
  const absentLetters = new Set<string>()

  for (const row of grid) {
    for (let i = 0; i < row.length; i++) {
      const cell = row[i]
      const ch = cell.letter.toLowerCase()
      if (!ch) continue
      if (cell.status === 'correct') {
        pattern[i] = ch
        includes.add(ch)
      } else if (cell.status === 'present') {
        includes.add(ch)
      } else if (cell.status === 'absent') {
        absentLetters.add(ch)
      }
    }
  }

  // Excludes are absent letters that are not in includes
  const excludes = Array.from(absentLetters).filter((c) => !includes.has(c)).join('')

  return {
    pattern: pattern.join(''),
    includes: Array.from(includes).join(''),
    excludes,
  }
}
