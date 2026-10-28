import { drawCards, playLand, type Action, type ActionPayloads, type ActionType, type Handlers } from './actions'
import type { GameState } from './state'

const handlers: Handlers = {
  drawCards,
  playLand,
}

/** Generic in K so TS ties each handler to its own payload type, with no cast. */
function dispatch<K extends ActionType>(state: GameState, type: K, payload: ActionPayloads[K]): GameState {
  const handler = handlers[type]
  if (!handler) throw new Error(`Unhandled action: ${type}`)
  return handler(state, payload)
}

/** Pure and deterministic: randomness comes only from `state.rngState`. */
export function reduce(state: GameState, action: Action): GameState {
  return dispatch(state, action.type, action.payload)
}
