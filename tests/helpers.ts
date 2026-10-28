import { CARD_DEFS } from '../src/engine/cardDefs'
import { initGame } from '../src/engine/init'
import type { GameState } from '../src/engine/state'

export const COMMANDER_ID = 'dack-fayden-helping-hand'
export const MAINBOARD_IDS = CARD_DEFS.map((c) => c.id).filter((id) => id !== COMMANDER_ID)

/** Fresh game from the placeholder card defs: Dack commander, 39-card shuffled library. */
export const testGame = (seed = 2137) =>
  initGame({ commanderId: COMMANDER_ID, mainboardIds: MAINBOARD_IDS, seat: 1, seed })

/** Moves the first library card of each def id into the hand, returning the state and their uids. */
export function withHand(...defIds: string[]): [GameState, number[]] {
  const game = testGame()
  const picked = defIds.map((id) => game.library.find((c) => c.defId === id)!)
  const uids = picked.map((c) => c.uid)
  return [
    {
      ...game,
      library: game.library.filter((c) => !uids.includes(c.uid)),
      hand: picked,
    },
    uids,
  ]
}
