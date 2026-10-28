import { describe, expect, it } from 'vitest'
import { resolveStack } from '../../src/engine/actions'
import { withHand } from '../helpers'

/** A game whose stack holds the first library card with the given def id. */
function withStack(defId: string) {
  const [state, [uid]] = withHand(defId)
  return { state: { ...state, hand: [], stack: state.hand[0] }, uid }
}

describe('resolveStack', () => {
  it.each(['sol-ring', 'gatekeeper-brom', 'watchful-eye'])('puts permanent %s on the battlefield', (defId) => {
    const { state, uid } = withStack(defId)
    const next = resolveStack(state)
    expect(next.stack).toBeNull()
    expect(next.battlefield.map((c) => c.uid)).toEqual([uid])
    expect(next.graveyard).toHaveLength(0)
  })

  it('sends a non-permanent to the graveyard, not the battlefield', () => {
    const { state, uid } = withStack('silence')
    const next = resolveStack(state)
    expect(next.stack).toBeNull()
    expect(next.graveyard.map((c) => c.uid)).toEqual([uid])
    expect(next.battlefield).toHaveLength(0)
  })

  it('does nothing when the stack is empty', () => {
    const [state] = withHand()
    expect(resolveStack(state)).toBe(state)
  })

  it('does not mutate the input state', () => {
    const { state } = withStack('sol-ring')
    const snapshot = structuredClone(state)
    resolveStack(state)
    expect(state).toEqual(snapshot)
  })
})
