import { describe, expect, it } from 'vitest'
import { tapLandForMana } from '../../src/engine/actions'
import { emptyPool } from '../../src/engine/state'
import { withBattlefield, withHand } from '../helpers'

describe('tapLandForMana', () => {
  it('taps a fixed-output land and adds its mana', () => {
    const [state, [plains]] = withBattlefield('plains')
    const next = tapLandForMana(state, { uid: plains })
    expect(next.battlefield[0].tapped).toBe(true)
    expect(next.manaPool).toEqual({ ...emptyPool(), W: 1 })
  })

  it('adds every symbol a land produces', () => {
    const [state, [tomb]] = withBattlefield('ancient-tomb')
    expect(tapLandForMana(state, { uid: tomb }).manaPool).toEqual({ ...emptyPool(), C: 2 })
  })

  it('adds the chosen color for an any-color land', () => {
    const [state, [brass]] = withBattlefield('city-of-brass')
    expect(tapLandForMana(state, { uid: brass, color: 'U' }).manaPool).toEqual({ ...emptyPool(), U: 1 })
  })

  it('ignores an any-color land with no color chosen', () => {
    const [state, [brass]] = withBattlefield('city-of-brass')
    expect(tapLandForMana(state, { uid: brass })).toBe(state)
  })

  it('ignores a land that is already tapped', () => {
    const [state, [plains]] = withBattlefield('plains')
    const once = tapLandForMana(state, { uid: plains })
    expect(tapLandForMana(once, { uid: plains })).toBe(once)
  })

  it('ignores cards in hand, non-lands and unknown uids', () => {
    const [inHand, [handLand]] = withHand('plains')
    expect(tapLandForMana(inHand, { uid: handLand })).toBe(inHand)
    const [state, [solRing]] = withBattlefield('sol-ring')
    expect(tapLandForMana(state, { uid: solRing })).toBe(state)
    expect(tapLandForMana(state, { uid: 9999 })).toBe(state)
  })

  it('does not mutate the input state', () => {
    const [state, [plains]] = withBattlefield('plains')
    const snapshot = structuredClone(state)
    tapLandForMana(state, { uid: plains })
    expect(state).toEqual(snapshot)
  })
})
