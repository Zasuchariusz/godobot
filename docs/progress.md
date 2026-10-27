# Progress

Checklist of what is done and what is next. Phases follow the build plan in
[requirements.md](requirements.md) §11. Tick items when finished; keep each to one line.

## 1. Engine + mana solver
- [x] Card definitions (`card.ts`, `cardDefs.ts`)
- [x] `GameState` model (`state.ts`)
- [x] Seeded RNG + shuffle (`rng.ts`)
- [x] `initGame`: commander in command zone, shuffled library (+ tests)
- [x] `drawCards` (+ tests)
- [x] Reducer skeleton: `(state, action) => newState`, action types
- [ ] Opening hand + mulligans (free first, then London)
- [ ] Serum Powder redraw
- [ ] Turn structure: untap, upkeep, draw (seat 1 included, no skipped draw), main
- [ ] Land play
- [ ] Mana pool + solver: basic lands and simple rocks
- [ ] Restricted mana: Workshop, Great Hall, Cavern, filters
- [ ] Damping Sphere
- [ ] Untap effects: Monoliths, Keys, Candelabra, Tezzeret, Mana Vault
- [ ] Counter-based rocks: Coalition Relic, Chalice, Prism, Jeweled Amulet, Component Pouch
- [ ] One-shot / conditional sources: LED, Petal, Moxen, City of Traitors, Gemstone Mine, etc.
- [ ] Urza's Saga
- [ ] Tutors and draw effects
- [ ] Gemstone Caverns opening-hand rule
- [ ] Commander cast: tax (+2 per cast), countered → command zone, Command Beacon
- [ ] Life tracking
- [ ] Unit tests for tricky lines (Workshop + Key + Monolith, Great Hall, Cavern, Damping Sphere)

## 2. Planner
- [ ] Single-turn search for casting Dack
- [ ] Next-turn setup scoring (mana, card access, protection)
- [ ] Casting policy: Greedy / Safe / Smart (default)
- [ ] Protection cards (§9)
- [ ] Opponent-dependent cards via settings
- [ ] Replan after disruption (countered / removed)
- [ ] Reasoning output ("cast X because ...")

## 3. Interactive UI
- [ ] Hand, battlefield, command zone views (touch-friendly)
- [ ] Seat input + game setup
- [ ] Step-through controls
- [ ] Action log with undo
- [ ] Countered / Removed controls (disabled when uncounterable)
- [ ] "Respond with protection?" step
- [ ] Pause-on-cast setting

## 4. Batch mode + stats
- [ ] Headless N-game runner
- [ ] Disruption policy setting
- [ ] Stats: P(Dack by turn N), kill turn, mulligans, recovery, lines taken

## 5. Later
- [ ] Bundle card images (offline), text-only fallback
- [ ] Capacitor mobile build
