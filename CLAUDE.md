# Godobot

Offline browser app that goldfishes a cEDH deck (commander **Dack Fayden, Helping Hand**, `{4}{W}{W}`).
Dack resolving = auto-win. The engine races to 6 mana with WW, ideally protected. The user can mark
spells countered or permanents removed, and the planner replans.

Full spec: [docs/requirements.md](docs/requirements.md). Read it before making design decisions.

Progress checklist: [docs/progress.md](docs/progress.md). Read it at session start and tick items as they are finished.

## Key facts
- Stack: React + TypeScript + Vite. Mobile later via Capacitor (keep UI touch-friendly).
- `src/engine/` is pure TS with no React imports. It's a deterministic reducer `(state, action) => newState` with seeded RNG.
- `src/ui/` only renders state and dispatches actions.
- Deck list: `data/decklist.txt` (99 + commander). Card oracle data from Scryfall: `data/cards.json`.
  Use these instead of recalling card text from memory. Several cards are newer than training data.
- **Never read `data/cards.json` in full** (~50k tokens). Look up only the cards you need:
  `python3 scripts/card.py "Sol Ring" "monolith"` (case-insensitive substring match).
- Likewise, don't read lockfiles, build output, or large logs whole. Grep or tail them.
- No network at runtime. Card images must be bundled, not hotlinked.
- Implement only rules the deck needs. No full MTG rules engine.

## Defaults (change only if the user asks)
- Seat (1–4) is a user input per game (players roll seats themselves). 3 opponents. Free first mulligan + London mulligan.
- Casting policy: Smart (cast unprotected only if waiting costs a full turn).
- Stax/removal pieces not cast in goldfish by default.
- Commander tax +2 per previous cast from the command zone. Command Beacon avoids it.
