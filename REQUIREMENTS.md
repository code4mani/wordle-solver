# Wordle Solver — Requirements

## 📌 Overview
A web application that helps users solve Wordle puzzles by suggesting optimal next guesses, explaining reasoning, and allowing users to simulate or step through solutions.

## 🎯 Goals
- Provide accurate next-guess suggestions for standard Wordle puzzles (5-letter English words).
- Offer multiple solving strategies (simple elimination, entropy/minimax heuristics, frequency-based suggestions).
- Be fast, usable on mobile, and respect user privacy (no guesses sent to third parties by default).

---

## 🎯 Target Users & Personas
- Casual players who want a hint engine.
- Competitive players who want an optimal solving strategy.
- Developers/researchers who want to experiment with strategies and word lists.

---

## ✅ Core Features (MVP)
- Input current game state (previous guesses with feedback: green / yellow / gray).
- Output a ranked list of suggested next guesses with rationale.
- Live filtering of candidate solution list and counts.
- Option to pick solving algorithm: "Simple filter", "Entropy", "Minimax", "Frequency".
- Support standard Wordle rules (5-letter words; repeated letters handled correctly).
- Mobile-first responsive UI and keyboard input support.

---

## ✳️ Nice-to-have Features
- Multiple language word lists and custom dictionaries.
- Step-by-step solver walkthrough (playback of a full solution path).
- Visualizations: remaining candidate distribution, letter frequency heatmap.
- Sharing / exporting a puzzle state (`share` URL or copyable text).
- Offline-first support (service worker) and local persistence of settings.

---

## Functional Requirements
1. The app must accept a sequence of previous guesses and corresponding feedback in Wordle format (e.g., `--YG-` or color-coded input).
2. The app must display the number of possible solutions remaining given the inputs.
3. The app must produce and rank suggestions according to the selected algorithm and show a short rationale (e.g., reduces candidates from 129 → 23).
4. The app must treat guesses and answers respecting repeated letters correctly (e.g., guessing "APPLE" when answer has single P should produce correct yellow/green logic).
5. The app must allow switching word lists (e.g., `allowed guesses` vs `possible answers` list).
6. The app must validate inputs and present helpful error messages for invalid states.

---

## Non-Functional Requirements
- Performance: suggestions should display within 200–500ms for the default client (desktop) for simple heuristics; more complex heuristics should be acceptable with an optional backend or precomputation.
- Privacy: by default, all solving should occur client-side; if any server-side component is used, explain what data is transmitted and allow an opt-out.
- Accessibility: follow WCAG guidelines for color contrast, provide non-color indicators for feedback, and support keyboard navigation.
- Portability: app should work on modern browsers (Chrome, Edge, Firefox, Safari) and mobile devices.
- Testability: include unit tests for solver logic and integration tests for key UI flows.

---

## Technical Considerations / Architecture
- Client-first approach (React + Vite or Next.js for static hosting) for MVP to keep computation local and avoid server costs.
- Provide an optional backend (FastAPI/Flask or Node) for heavy computations, telemetry (opt-in), or multiplayer features.
- Word lists: include vetted `answers.txt` and `allowed_guesses.txt`. Add a script to regenerate lists from authoritative sources.
- Algorithms: implement a modular solver API so new strategies can be plugged in and compared.

---

## API & Data Model (if backend used)
- POST /solve
  - Payload: `{ "guesses": [{"word":"slate","feedback":"GY--Y"}], "strategy": "entropy" }`
  - Response: `{ "candidates": ["xxx"], "suggestions": [{"word":"crane","score":12.3}], "count": 23 }`
- Word list storage: static JSON or text assets bundled with the app.

---

## UX / UI Requirements
- Provide a 5-letter interactive grid mirroring Wordle’s input for clarity.
- Allow quick entry via physical keyboard and tap/click toggles for color feedback.
- Show suggestions prominently with an explanation and quick action (apply suggestion as guess).
- Theme settings, accessible color modes, and an option to show color-blind-friendly markers.

---

## Acceptance Criteria / User Stories
- As a user, given no prior guesses, I can request a starting guess and see a ranked list (e.g., `crane`, `slate`).
  - Acceptance: Top 5 suggestions appear within 500ms; candidate count equals full answer list.
- As a user, after entering guesses and feedback, the app must update candidates and suggestions accordingly.
  - Acceptance: The filtered candidate set matches a reference filter implementation for provided test cases.
- As a user, I can select the "Entropy" strategy and receive suggestions that differ from the simple filter strategy.
  - Acceptance: Strategy switch is reflected in suggestion ordering and brief rationale is shown.

---

## Tests & Validation
- Unit tests for filter logic, feedback parsing, and duplicate-letter cases.
- Integration tests for full solve flows (seed puzzles with known solutions).
- Performance tests for large filter runs and strategy computations.

---

## Milestones & Roadmap
1. MVP (Week 1–2): Interactive grid, local filter solver, top suggestions, mobile-responsive UI.
2. Strategy Module (Week 3): Add entropy/minimax strategies + UI to pick.
3. Polish (Week 4): Accessibility, offline support, test coverage, deployment pipeline.
4. Extras (TBD): Visualizations, sharing, multi-language support.

---

## Open Questions / Trade-offs
- Pure client-side vs server-side for heavy heuristics (cost vs performance).
- Which default word lists to ship (official Wordle vs more comprehensive lists).
- Whether to provide an "explain" mode that simulates how candidate reduction occurs step-by-step.

---

## Next Steps
- Review and refine priorities (MVP vs nice-to-have features).
- Choose stack and create initial project scaffold (`create-vite` + React or `next init`).
- Prepare test cases and a canonical Wordle word list.

---

> Notes: Keep this document evolving—add precise acceptance test cases and example puzzles as we implement features.
