import { describe, expect, it } from 'vitest'
import { castSpell } from '../../src/engine/actions'
import { emptyPool } from '../../src/engine/state'
import { withHand } from '../helpers'

describe('castSpell', () => {
  it('moves the card from hand to the stack and pays its cost', () => {
    const [state, [reprieve]] = withHand('reprieve') // {1}{W}
    const next = castSpell({ ...state, manaPool: { ...emptyPool(), W: 1, C: 2 } }, { uid: reprieve })
    expect(next.hand).toHaveLength(0)
    expect(next.stack?.uid).toBe(reprieve)
    expect(next.manaPool).toEqual({ ...emptyPool(), C: 1 })
  })

  it('ignores a cast the pool cannot pay for', () => {
    const [state, [reprieve]] = withHand('reprieve')
    const poor = { ...state, manaPool: { ...emptyPool(), C: 5 } }
    expect(castSpell(poor, { uid: reprieve })).toBe(poor)
  })

  it('ignores a cast while the stack is occupied', () => {
    const [state, [silence, tithe]] = withHand('silence', 'mana-tithe')
    const rich = { ...state, manaPool: { ...emptyPool(), W: 2 } }
    const once = castSpell(rich, { uid: silence })
    expect(castSpell(once, { uid: tithe })).toBe(once)
  })

  it('ignores lands, cards not in hand and unknown uids', () => {
    const [state, [plains]] = withHand('plains')
    const rich = { ...state, manaPool: { ...emptyPool(), W: 5 } }
    expect(castSpell(rich, { uid: plains })).toBe(rich)
    expect(castSpell(rich, { uid: 9999 })).toBe(rich)
    const empty = { ...rich, hand: [] }
    expect(castSpell(empty, { uid: plains })).toBe(empty)
  })

  it('does not mutate the input state', () => {
    const [state, [silence]] = withHand('silence')
    const rich = { ...state, manaPool: { ...emptyPool(), W: 1 } }
    const snapshot = structuredClone(rich)
    castSpell(rich, { uid: silence })
    expect(rich).toEqual(snapshot)
  })
})
