import type { GameState } from './state'

/** Payload shape for each action type. Add new actions here. */
export interface ActionPayloads {
  draw: { count: number }
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
