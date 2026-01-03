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
  const pattern = Array.from({ length: 5 }, () => '.')

  // Build per-row counts, then derive global min/max per letter properly
  const rows = grid

  const perRowCounts: Array<{ confirmed: Record<string, number>; absent: Record<string, number> }> = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const confirmed: Record<string, number> = {}
    const absent: Record<string, number> = {}
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      const ch = cell.letter.toLowerCase()
      if (!ch) continue
      if (cell.status === 'correct') {
        pattern[j] = ch
        confirmed[ch] = (confirmed[ch] || 0) + 1
      } else if (cell.status === 'present') {
        confirmed[ch] = (confirmed[ch] || 0) + 1
      } else if (cell.status === 'absent') {
        absent[ch] = (absent[ch] || 0) + 1
      }
    }
    perRowCounts.push({ confirmed, absent })
  }

  const minCounts: Record<string, number> = {}
  const maxCounts: Record<string, number> = {}
  const includes = new Set<string>()
  const excludes = new Set<string>()

  // Gather all letters that appeared in guesses
  const allLetters = new Set<string>()
  for (const row of rows) for (const cell of row) if (cell.letter) allLetters.add(cell.letter.toLowerCase())

  for (const ch of Array.from(allLetters)) {
    // For each row, compute rowMin (confirmed count) and rowMax
    let globalMin = 0
    let globalMax = Infinity
    for (const rc of perRowCounts) {
      const rowConfirmed = rc.confirmed[ch] || 0
      const rowAbsent = rc.absent[ch] || 0
      const rowMin = rowConfirmed
      let rowMax = Infinity
      if (rowAbsent > 0 && rowConfirmed === 0) {
        rowMax = 0
      } else if (rowAbsent > 0 && rowConfirmed > 0) {
        rowMax = rowConfirmed
      }
      globalMin = Math.max(globalMin, rowMin)
      globalMax = Math.min(globalMax, rowMax)
    }

    if (globalMin > 0) {
      minCounts[ch] = globalMin
      includes.add(ch)
    }
    if (globalMax !== Infinity) {
      maxCounts[ch] = globalMax
      if (globalMax === 0) {
        // explicitly record zero min for excluded letters to keep API stable
        minCounts[ch] = 0
        excludes.add(ch)
      }
    }
  }

  // positional excludes per letter (positions where letter cannot be)
  const posExcludes: Record<string, Set<number>> = {}
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i]
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      const ch = cell.letter.toLowerCase()
      if (!ch) continue
      if (cell.status === 'present' || cell.status === 'absent') {
        posExcludes[ch] = posExcludes[ch] || new Set<number>()
        posExcludes[ch].add(j)
      }
    }
  }

  // Convert posExcludes sets to arrays for returning
  const positionExcludes: Record<string, number[]> = {}
  for (const [ch, set] of Object.entries(posExcludes)) {
    positionExcludes[ch] = Array.from(set)
  }

  return {
    pattern: pattern.join(''),
    includes: Array.from(includes).join(''),
    excludes: Array.from(excludes).join(''),
    minCounts,
    maxCounts,
    positionExcludes,
  }
}

export function letterStatusMap(grid: Row[]): Record<string, CellStatus> {
  const order: Record<CellStatus, number> = { empty: 0, absent: 1, present: 2, correct: 3 }
  const map: Record<string, CellStatus> = {}
  for (const row of grid) {
    for (const cell of row) {
      const ch = cell.letter.toLowerCase()
      if (!ch) continue
      const st: CellStatus = cell.status
      if (!map[ch] || order[st] > order[map[ch]]) map[ch] = st
    }
  }
  return map
}
