import React from 'react'
import type { CellStatus } from '../utils/feedback'

type Props = {
  statuses?: Record<string, CellStatus>
  onKey: (k: string) => void
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

export default function Keyboard({ statuses = {}, onKey }: Props) {
  return (
    <div className="keyboard">
      {ROWS.map((r, idx) => (
        <div key={idx} className="kb-row">
          {r.split('').map((ch) => (
            <button
              key={ch}
              className={`kb-key ${statuses[ch] || ''}`}
              onClick={() => onKey(ch)}
              aria-label={`key-${ch}`}
            >
              {ch.toUpperCase()}
            </button>
          ))}
          {idx === 2 && (
            <>
              <button className="kb-key special" onClick={() => onKey('Backspace')}>
                ⌫
              </button>
              <button className="kb-key special" onClick={() => onKey('Enter')}>
                ↵
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
