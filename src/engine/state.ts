import type { CardInstance } from './card'

export type Zone = 'library' | 'hand' | 'battlefield' | 'graveyard' | 'exile' | 'command'

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

  /** Current state of the seeded RNG, so the reducer stays deterministic. */
  rngState: number
}
