import { describe, expect, it } from 'vitest'
import { CARD_DEFS } from '../../src/engine/cardDefs'
import { drawCards } from '../../src/engine/draw'
import { COMMANDER_ID, MAINBOARD_IDS, testGame } from '../helpers'

describe('initGame + drawCards', () => {
  it('shuffles the library and draws an opening hand of 7', () => {
    expect(CARD_DEFS).toHaveLength(40)

    const initial = testGame()
    expect(initial.library).toHaveLength(39)
    expect(initial.command.map((c) => c.defId)).toEqual([COMMANDER_ID])
    expect(initial.library.map((c) => c.defId)).not.toEqual(MAINBOARD_IDS)
    expect(testGame()).toEqual(initial) // same seed, same shuffle

    const drawn = drawCards(initial, 7)
    expect(drawn.hand).toHaveLength(7)
    expect(drawn.library).toHaveLength(32)
    expect(drawn.hand).toEqual(initial.library.slice(0, 7))
    expect(new Set([...drawn.hand, ...drawn.library].map((c) => c.uid)).size).toBe(39)
  })
})
