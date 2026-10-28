import type { CardType, Color } from './card'
import { CARD_DEFS_BY_ID } from './cardDefs'
import { addMana, spendMana, type GameState } from './state'

/** Payload shape for each action type. Add new actions here. */
export interface ActionPayloads {
  drawCards: { count: number }
  playLand: { uid: number }
  /** `color` is required for any-color lands and ignored otherwise. */
  tapLandForMana: { uid: number; color?: Color }
  castSpell: { uid: number }
  resolveStack: Record<string, never>
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

/** Taps an untapped land on the battlefield for its first free mana ability; otherwise returns the state unchanged. */
export function tapLandForMana(state: GameState, { uid, color }: ActionPayloads['tapLandForMana']): GameState {
  const card = state.battlefield.find((c) => c.uid === uid)
  const def = card && CARD_DEFS_BY_ID[card.defId]
  const ability = def?.mana?.[0]
  if (!card || card.tapped || !def?.types.includes('land') || !ability || ability.cost) return state
  const produced = ability.anyColor ? (color ? [color] : []) : ability.produces
  if (produced.length === 0) return state
  return {
    ...state,
    battlefield: state.battlefield.map((c) => (c.uid === uid ? { ...c, tapped: true } : c)),
    manaPool: addMana(state.manaPool, produced),
  }
}

/** Pays for a non-land card in hand and puts it on the empty stack; otherwise returns the state unchanged. */
export function castSpell(state: GameState, { uid }: ActionPayloads['castSpell']): GameState {
  const card = state.hand.find((c) => c.uid === uid)
  const def = card && CARD_DEFS_BY_ID[card.defId]
  if (!card || !def || def.types.includes('land') || state.stack) return state
  const manaPool = spendMana(state.manaPool, def.manaCost)
  if (!manaPool) return state
  return { ...state, hand: state.hand.filter((c) => c.uid !== uid), stack: card, manaPool }
}

const PERMANENT_TYPES: CardType[] = ['artifact', 'creature', 'enchantment', 'planeswalker']

/** Empties the stack: permanents enter the battlefield, anything else goes to the graveyard. */
export function resolveStack(state: GameState): GameState {
  const card = state.stack
  if (!card) return state
  const def = CARD_DEFS_BY_ID[card.defId]
  if (!def?.types.some((t) => PERMANENT_TYPES.includes(t))) {
    return { ...state, stack: null, graveyard: [...state.graveyard, card] }
  }
  return {
    ...state,
    stack: null,
    battlefield: [...state.battlefield, { ...card, tapped: def.entersTapped ?? false }],
  }
}
