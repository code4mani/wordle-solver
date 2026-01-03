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
  includes = '',
  excludes = '',
) {
  if (pattern.length !== 5) throw new Error('pattern length must be 5')
  const incSet = new Set(includes.toLowerCase())
  const excSet = new Set(excludes.toLowerCase())

  return words.filter((w) => {
    const lw = w.toLowerCase()
    if (!matchPattern(lw, pattern.toLowerCase())) return false
    for (const ch of incSet) if (!lw.includes(ch)) return false
    for (const ch of excSet) if (lw.includes(ch)) return false
    return true
  })
}
