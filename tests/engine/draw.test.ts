import { describe, expect, it } from 'vitest'
import { drawCards } from '../../src/engine/actions'
import { testGame } from '../helpers'

describe('drawCards', () => {
  it('appends drawn cards to a hand that already has cards', () => {
    const initial = testGame()

    const afterFirst = drawCards(initial, { count: 3 })
    const afterSecond = drawCards(afterFirst, { count: 2 })

    expect(afterSecond.hand).toHaveLength(5)
    expect(afterSecond.hand.slice(0, 3)).toEqual(afterFirst.hand)
    expect(afterSecond.hand).toEqual(initial.library.slice(0, 5))
    expect(afterSecond.library).toEqual(initial.library.slice(5))
  })
})
