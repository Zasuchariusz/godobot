import { CARD_DEFS } from '../src/engine/cardDefs'
import { initGame } from '../src/engine/init'

export const COMMANDER_ID = 'dack-fayden-helping-hand'
export const MAINBOARD_IDS = CARD_DEFS.map((c) => c.id).filter((id) => id !== COMMANDER_ID)

/** Fresh game from the placeholder card defs: Dack commander, 39-card shuffled library. */
export const testGame = (seed = 2137) =>
  initGame({ commanderId: COMMANDER_ID, mainboardIds: MAINBOARD_IDS, seat: 1, seed })
