import { describe, expect, it } from 'vitest'
import { drawCards } from '../../src/engine/draw'
import { reduce } from '../../src/engine/reducer'
import { testGame } from '../helpers'

describe('reduce', () => {
  it('handles draw the same as drawCards', () => {
    const initial = testGame()
    expect(reduce(initial, { type: 'draw', payload: { count: 3 } })).toEqual(drawCards(initial, { count: 3 }))
  })

  it('does not mutate the input state', () => {
    const initial = testGame()
    const snapshot = structuredClone(initial)
    reduce(initial, { type: 'draw', payload: { count: 3 } })
    expect(initial).toEqual(snapshot)
  })
})
