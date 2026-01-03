export function matchPattern(word: string, pattern: string) {
  if (pattern.length !== word.length) throw new Error('pattern length mismatch')
  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i]
    if (p === '.' || p === '-') continue
    if (p.toLowerCase() !== word[i].toLowerCase()) return false
  }
  return true
}

export function filterWords(
  words: string[],
  pattern: string,
  minCounts: Record<string, number> = {},
  maxCounts: Record<string, number> = {},
  positionExcludes: Record<string, number[]> = {},
) {
  if (pattern.length !== 5) throw new Error('pattern length must be 5')

  return words.filter((w) => {
    const lw = w.toLowerCase()
    if (!matchPattern(lw, pattern.toLowerCase())) return false

    // Check min counts
    for (const [ch, min] of Object.entries(minCounts)) {
      const count = lw.split(ch).length - 1
      if (count < min) return false
    }

    // Check max counts
    for (const [ch, max] of Object.entries(maxCounts)) {
      const count = lw.split(ch).length - 1
      if (count > max) return false
    }

    // Position excludes: for any letter, it must not appear at excluded positions
    for (const [ch, positions] of Object.entries(positionExcludes)) {
      for (const pos of positions) {
        if (lw[pos] === ch) return false
      }
    }

    return true
  })
}
