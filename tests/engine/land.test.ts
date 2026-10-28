import { describe, expect, it } from 'vitest'
import { playLand } from '../../src/engine/actions'
import { CARD_DEFS_BY_ID } from '../../src/engine/cardDefs'
import { testGame, withHand } from '../helpers'

describe('playLand', () => {
  it('moves a land from hand to battlefield and uses the land drop', () => {
    const [state, [plains]] = withHand('plains')
    const next = playLand(state, { uid: plains })
    expect(next.hand).toHaveLength(0)
    expect(next.battlefield.map((c) => c.uid)).toEqual([plains])
    expect(next.battlefield[0].tapped).toBe(false)
    expect(next.landDropUsed).toBe(true)
  })

  it('ignores a second land in the same turn', () => {
    const [state, [plains, tomb]] = withHand('plains', 'ancient-tomb')
    const once = playLand(state, { uid: plains })
    expect(playLand(once, { uid: tomb })).toBe(once)
  })

  it('ignores non-lands and cards not in hand', () => {
    const [state, [solRing]] = withHand('sol-ring')
    expect(playLand(state, { uid: solRing })).toBe(state)
    expect(playLand(state, { uid: 9999 })).toBe(state)
  })

  it('plays an entersTapped land tapped', () => {
    CARD_DEFS_BY_ID['test-tapland'] = { ...CARD_DEFS_BY_ID['plains'], id: 'test-tapland', entersTapped: true }
    try {
      const game = testGame()
      const card = { ...game.library[0], defId: 'test-tapland' }
      const next = playLand({ ...game, hand: [card] }, { uid: card.uid })
      expect(next.battlefield[0].tapped).toBe(true)
    } finally {
      delete CARD_DEFS_BY_ID['test-tapland']
    }
  })

  it('does not mutate the input state', () => {
    const [state, [plains]] = withHand('plains')
    const snapshot = structuredClone(state)
    playLand(state, { uid: plains })
    expect(state).toEqual(snapshot)
  })
})
