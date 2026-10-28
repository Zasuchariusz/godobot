import { CARD_DEFS_BY_ID } from './cardDefs'
import type { GameState } from './state'

/** Payload shape for each action type. Add new actions here. */
export interface ActionPayloads {
  drawCards: { count: number }
  playLand: { uid: number }
}

export type ActionType = keyof ActionPayloads

/** Everything that can change the game, derived from the payload map. The UI and planner only ever dispatch these. */
export type Action = {
  [K in ActionType]: { type: K; payload: ActionPayloads[K] }
}[ActionType]

/** One handler per action type; the compiler flags any action without one. */
export type Handlers = {
  [K in ActionType]: (state: GameState, payload: ActionPayloads[K]) => GameState
}

/** Moves up to `count` cards from the top of the library to the hand. */
export function drawCards(state: GameState, { count }: ActionPayloads['drawCards']): GameState {
  const n = Math.min(Math.max(count, 0), state.library.length)
  return {
    ...state,
    library: state.library.slice(n),
    hand: [...state.hand, ...state.library.slice(0, n)],
  }
}

/** Plays a land from hand if it is one and the land drop is unused; otherwise returns the state unchanged. */
export function playLand(state: GameState, { uid }: ActionPayloads['playLand']): GameState {
  const card = state.hand.find((c) => c.uid === uid)
  const def = card && CARD_DEFS_BY_ID[card.defId]
  if (!card || !def?.types.includes('land') || state.landDropUsed) return state
  return {
    ...state,
    hand: state.hand.filter((c) => c.uid !== uid),
    battlefield: [...state.battlefield, { ...card, tapped: def.entersTapped ?? false }],
    landDropUsed: true,
  }
}
