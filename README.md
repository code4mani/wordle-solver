# Wordle Solver (Frontend)

A small TypeScript + React + Vite frontend that loads a 5-letter `word-list.json` and lets you filter candidate words.

## Quick start

- Install: `npm ci`
- Dev: `npm run dev`
- Test: `npm run test`
- Build: `npm run build`
- Deploy: push to `main` — a GitHub Actions workflow will build and deploy to GitHub Pages (the repo should be `wordle-solver` and you may want to update `homepage` in `package.json`).

## Notes

- The app reads `word-list.json` at the repo root and uses a simple pattern-based filter for now (pattern uses `.` as wildcard).
- Next: I'll build a Wordle-like grid, keyboard input, color feedback parsing, and the entropy/minimax strategies.
