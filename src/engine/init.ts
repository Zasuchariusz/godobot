import type { CardInstance } from './card'
import { shuffle } from './rng'
import { emptyPool, type GameState } from './state'

export interface InitOptions {
  /** Card def id of the commander, e.g. "dack-fayden-helping-hand". */
  commanderId: string
  /** Def ids of the 99 mainboard cards, one entry per copy. */
  mainboardIds: string[]
  seat: GameState['seat']
  seed: number
}

const newCard = (uid: number, defId: string): CardInstance => ({
  uid,
  defId,
  tapped: false,
  counters: 0,
})

/** Builds a fresh game: commander in the command zone, shuffled library, empty hand. */
export function initGame({ commanderId, mainboardIds, seat, seed }: InitOptions): GameState {
  // uid 0 is the commander; library cards follow in decklist order.
  const cards = mainboardIds.map((defId, i) => newCard(i + 1, defId))
  const [library, rngState] = shuffle(cards, seed >>> 0)
  return {
    library,
    hand: [],
    battlefield: [],
    graveyard: [],
    exile: [],
    command: [newCard(0, commanderId)],
    turn: 0,
    seat,
    landDropUsed: false,
    commanderCasts: 0,
    life: 40,
    manaPool: emptyPool(),
    rngState,
  }
}
