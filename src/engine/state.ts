import type { CardInstance, ManaSymbol } from './card'

export type Zone = 'library' | 'hand' | 'battlefield' | 'graveyard' | 'exile' | 'command'

/** Count of floating mana per symbol. */
export type ManaPool = Record<ManaSymbol, number>

export const emptyPool = (): ManaPool => ({ W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 })

/** Returns a new pool with one mana of each symbol added. */
export function addMana(pool: ManaPool, symbols: readonly ManaSymbol[]): ManaPool {
  const next = { ...pool }
  for (const s of symbols) next[s] += 1
  return next
}

export interface GameState {
  /** Index 0 is the top of the library. */
  library: CardInstance[]
  hand: CardInstance[]
  battlefield: CardInstance[]
  graveyard: CardInstance[]
  exile: CardInstance[]
  /** Dack, while not on the stack or battlefield. */
  command: CardInstance[]

  turn: number
  /** Turn-order position, chosen by the user. */
  seat: 1 | 2 | 3 | 4
  landDropUsed: boolean
  /** Times Dack was cast from the command zone; commander tax is 2 * this. */
  commanderCasts: number
  life: number
  /** Floating mana; empties at the end of each phase. */
  manaPool: ManaPool

  /** Current state of the seeded RNG, so the reducer stays deterministic. */
  rngState: number
}
