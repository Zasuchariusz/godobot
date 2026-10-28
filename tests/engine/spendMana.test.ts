import { describe, expect, it } from 'vitest'
import { emptyPool, spendMana } from '../../src/engine/state'

const pool = (p: Partial<ReturnType<typeof emptyPool>>) => ({ ...emptyPool(), ...p })

describe('spendMana', () => {
  it('pays coloured symbols from the matching colour', () => {
    expect(spendMana(pool({ W: 3 }), { generic: 0, colored: { W: 2 } })).toEqual(pool({ W: 1 }))
  })

  it('pays generic from colourless first, then non-white colours, white last', () => {
    const cost = { generic: 4, colored: {} }
    expect(spendMana(pool({ C: 2, U: 1, W: 3 }), cost)).toEqual(pool({ W: 2 }))
    expect(spendMana(pool({ C: 1, U: 1, B: 1, W: 2 }), cost)).toEqual(pool({ W: 1 }))
  })

  it("pays Dack's {4}{W}{W} exactly", () => {
    const dack = { generic: 4, colored: { W: 2 } }
    expect(spendMana(pool({ W: 2, C: 4 }), dack)).toEqual(emptyPool())
    expect(spendMana(pool({ W: 6 }), dack)).toEqual(emptyPool())
  })

  it('returns null when coloured or total mana is short', () => {
    expect(spendMana(pool({ C: 6 }), { generic: 4, colored: { W: 2 } })).toBeNull()
    expect(spendMana(pool({ W: 2, C: 3 }), { generic: 4, colored: { W: 2 } })).toBeNull()
  })

  it('does not mutate the input pool', () => {
    const input = pool({ W: 2, C: 1 })
    spendMana(input, { generic: 1, colored: { W: 1 } })
    expect(input).toEqual(pool({ W: 2, C: 1 }))
  })
})
