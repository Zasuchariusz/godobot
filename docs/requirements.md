# Godobot — Requirements

A self-contained browser app that **goldfishes a cEDH deck**: it plays a predefined
Commander deck by itself, as efficiently as possible, and reports how fast it wins.
Later it will be ported to mobile.

## 1. Goal and win condition

- Deck: mono-white artifact/stax, commander **Dack Fayden, Helping Hand** — `{4}{W}{W}` (MV 6, needs WW).
- The deck's plan is simply to **cast the commander**.
- **If Dack resolves (is not countered), the game is an automatic win.** Nothing after
  that point is simulated (the creature combo his ETB sets up is out of scope).
- Therefore the engine's whole job is: **assemble 6 mana including WW as early as possible,
  ideally while protected from counterspells.**

## 2. Scope

**In scope**
- Fully offline, no backend, no network at runtime.
- Only the rules and card effects this deck actually uses.
- Single-player goldfish. Opponents are abstract: they exist only so the user can
  counter spells / remove permanents, and (via settings) to feed opponent-dependent cards.

**Out of scope**
- Full MTG rules engine (layers, full priority system, opponent AI).
- Simulating anything after Dack resolves.
- Multiplayer / networking.

## 3. Platform and tech

- **React + TypeScript + Vite** for the browser app.
- **Capacitor** later to wrap the same app for iOS/Android. No rewrite planned.
- Keep the UI touch-friendly from the start (tap targets, no hover-only interactions).

### Architecture rule

```
src/
  engine/   pure TypeScript, NO React: state, rules, mana solver, planner
  ui/       React components: render state, dispatch actions
  data/     deck list + card definitions
```

- Engine is a pure reducer: `(state, action) => newState`. Deterministic given a seeded RNG.
- This gives: unit tests, undo/replay for free, and headless batch simulation.
- Cards = data (cost, types, produced mana) + small effect functions for the ~25 that need custom logic.
- Illegal actions (wrong zone, land drop used, tapped permanent, etc.) are currently silent no-ops. They must be
  logged in some form later (e.g. a rejection entry the UI log and planner can read). Design TBD: a log field on
  `GameState` or a `{ state, error }` handler result.

## 4. User interaction (disruption)

The only interaction is the user telling the app what opponents did:

- **Countered:** when a spell is cast (especially Dack), the user can mark it countered.
  - Before applying, the app offers a **"respond with protection?"** step if the deck has an answer available
    (Mana Tithe, Reprieve, etc.).
  - A countered Dack returns to the command zone; **commander tax +2** per previous cast from command zone.
  - The Countered button is **disabled** when the spell is uncounterable (Dack cast with Cavern of Souls
    colored mana, or opponents are locked out by Silence / Orim's Chant / Calamity's Wake).
- **Removed:** any permanent can be marked removed (destroy / exile / bounce). Mostly relevant
  for mana sources.
- After every disruption the **planner replans from the new state**. There is no fixed script.
- Full action log with undo.

## 5. Modes

### Interactive
- Step through a game turn by turn, or action by action.
- Show the planner's reasoning ("cast X because ...").
- Pause on spell casts for counter decisions (configurable: pause on every spell / only Dack / never).

### Batch
- Simulate N games (e.g. 10,000) headless.
- Disruption policy setting, e.g. "opponents counter the first N unprotected Dack casts".
- Stats:
  - P(Dack cast by turn 1, 2, 3, ...), and the same **with protection**.
  - Kill-turn distribution / average.
  - Mulligan rate and kill-turn impact per mulligan.
  - Recovery after 1 / 2 counters.
  - Frequency of lines taken (which cards enabled the win).

## 6. Game setup rules

- 99-card library + Dack in command zone. Opening hand 7.
- **Free first mulligan, then London mulligan** (draw 7, bottom N).
- **Serum Powder**: may exile hand and redraw that many, in addition to mulligans.
- **Seat**: 1–4, entered by the user per game (players roll seats themselves). Multiplayer, so no player skips the first draw.
- **Gemstone Caverns**: if in opening hand and not starting player, may start on battlefield with a luck counter
  (exile a card from hand).
- Number of opponents: 3 (standard cEDH pod).

## 7. Planner

- Each turn: find the action sequence that casts Dack **soonest**; if not possible this turn,
  set up the best next turn (more mana, card access, protection).
- Search within the turn over lands, rocks, rituals, tutors, draw. Score states by
  progress toward 6 mana with WW, card access, protection available.
- Must handle "spend mana now on a rock to have more next turn" versus saving.
- **Casting policy setting:**
  - **Greedy:** cast Dack the moment it's possible.
  - **Safe:** only cast with protection.
  - **Smart (default):** cast unprotected only if waiting would cost a full turn.
- **Stax/removal pieces are not cast by default** in goldfish (they only hurt or do nothing);
  they serve as imprint (Chrome Mox) / discard (LED, Mox Diamond) / March exile fodder.
  Optional setting to allow them.

## 8. Mana solver — card-specific rules

Restricted mana:
- **Mishra's Workshop:** `{C}{C}{C}`, only for artifact spells.
- **Great Hall of the Citadel:** `{1},{T}`: two mana of any colors, only for legendary spells (Dack is legendary).
- **Cavern of Souls:** colored mana only for creatures of the chosen type (name Human or Advisor for Dack). That spell **can't be countered**.
- **Filters:** Prismatic Lens, The Mycosynth Gardens, Talon Gates of Madara: `{1},{T}`: one mana of any color.
- **Damping Sphere** (if on battlefield): lands tapped for 2+ produce only `{C}` (hits Ancient Tomb, City of Traitors, Workshop, Remote Farm, Ruins sac).

Untap / multi-turn:
- Grim Monolith (untap `{4}`), Basalt Monolith (untap `{3}`). Neither untaps normally.
- Voltaic Key / Manifold Key (`{1},{T}`: untap artifact), Candelabra of Tawnos (`{X},{T}`: untap X lands),
  Tezzeret, Cruel Captain 0 (untap artifact). Basalt + Key nets +2.
- Mana Vault: no normal untap, pay `{4}` in upkeep to untap, 1 damage in draw step if tapped.
- Coalition Relic: charge counter, cashed in at first main phase.
- Everflowing Chalice: multikicker `{2}` → counters.
- Pentad Prism: sunburst counters (colors spent).
- Jeweled Amulet: store one mana for later.
- Urza's Saga: chapter I mana, chapter III tutors a 0/1-cost artifact onto battlefield.
- Component Pouch: d20 roll for counters.

One-shot / conditional:
- Lion's Eye Diamond (discard hand, 3 of one color, instant speed), Lotus Petal, Chrome Mox (imprint),
  Mox Diamond (discard a land), Mox Opal (metalcraft), Crystal Vein, Ruins of Trokair (enters tapped),
  Remote Farm (enters tapped, 2 uses), Gemstone Mine (3 uses), City of Traitors (sacrificed on next land drop),
  Ancient Tomb (2 damage), Implements of Sacrifice, Tooth of Ramos (sac for W), Starting Town (untapped on turns 1–3),
  Thran Portal, Multiversal Passage (pay 2 life or tapped).
- Life costs (City of Brass, Confluence, Tarnished Citadel, Tomb) are tracked but rarely matter.

Card access:
- Tutors: Enlightened Tutor (to top), Expedition Map, Moonsilver Key, Tezzeret −3, Urza's Saga III.
- Draw: Brainstone, Abeyance, Reprieve, Charitable Levy.
- **Command Beacon:** puts Dack into hand → **avoids commander tax** after a counter.

Opponent-dependent (configured by settings, e.g. "opponents draw 1/turn, never pay"):
- Smothering Tithe, Monologue Tax, Gleaming Splendor, Fellwar Stone (assume opponents' lands make any color).

## 9. Protection

| Card | Effect in sim |
|---|---|
| Cavern of Souls | Dack uncounterable |
| Silence, Orim's Chant | Opponents can't cast spells this turn |
| Calamity's Wake | Opponents can't cast noncreature spells this turn (Dack is a creature) |
| Abeyance | Target player can't cast instants/sorceries (one opponent) + draw |
| Defense Grid | Opponents' spells cost `{3}` more on your turn |
| Paladin Class | Opponents' spells cost `{1}` more on your turn |
| Mana Tithe | Counter a counterspell unless they pay `{1}` |
| Reprieve | Return a counterspell to hand + draw |
| Vexing Bauble | Counters free spells (Force, Pact) — **also counters your own 0-cost spells** |

## 10. Card assets

- Card data and images from **Scryfall** (`data/cards.json` holds oracle data + image URIs).
- For offline use, download images once with a script and bundle them. Never hotlink at runtime.
- Card art is © Wizards of the Coast. A free personal project is generally OK under their Fan Content Policy.
  App store publishing is risky. Keep a text-only card rendering fallback.

## 11. Build plan

1. **Engine + mana solver:** state model, turn structure, all lands and mana rocks, with unit tests
   for tricky lines (Workshop + Key + Monolith, Great Hall, Cavern, Damping Sphere).
2. **Planner:** turn-by-turn search for fastest Dack, tutors/draw, casting policy, protection.
3. **Interactive UI:** hand, battlefield, command zone, log with reasoning, Countered / Removed controls, undo.
4. **Batch mode + stats.**
5. Later: bundle card images, Capacitor mobile build.
