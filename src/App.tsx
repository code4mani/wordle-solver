import React, { useMemo, useState } from 'react'
import words from '../word-list.json'
import { filterWords } from './solver/solver'
import Grid from './components/Grid'
import { parseFeedback } from './utils/feedback'

export default function App() {
  const [constraints, setConstraints] = useState({ pattern: '.....', includes: '', excludes: '' })

  const candidates = useMemo(() => {
    try {
      return filterWords(words as string[], constraints.pattern, constraints.includes, constraints.excludes)
    } catch (err) {
      return []
    }
  }, [constraints])

  return (
    <div className="container">
      <header>
        <h1>Wordle Solver</h1>
        <p className="muted">Loaded {words.length} words</p>
      </header>

      <main>
        <Grid onChange={setConstraints} suggestions={candidates.slice(0, 30)} />

        <section>
          <h2>Matches ({candidates.length})</h2>
          <ul className="candidates">
            {candidates.slice(0, 200).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>

        <section className="constraints">
          <h3>Active Constraints</h3>
          <p>
            <strong>Pattern:</strong> <code>{constraints.pattern}</code>
          </p>
          <p>
            <strong>Includes:</strong> {constraints.includes || '\u2014'}
          </p>
          <p>
            <strong>Excludes:</strong> {constraints.excludes || '\u2014'}
          </p>
        </section>
      </main>

      <footer>
        <p className="muted">Type guesses into the grid and click tiles to set feedback. Suggestions can be clicked to fill the current row.</p>
      </footer>
    </div>
  )
}
