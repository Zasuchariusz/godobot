import type { GameState } from './state'

/** Moves up to `count` cards from the top of the library to the hand. */
export function drawCards(state: GameState, count: number): GameState {
  const n = Math.min(Math.max(count, 0), state.library.length)
  return {
    ...state,
    library: state.library.slice(n),
    hand: [...state.hand, ...state.library.slice(0, n)],
  }
}
