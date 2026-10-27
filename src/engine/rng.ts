/** Mulberry32 step: returns a float in [0, 1) and the next RNG state. */
export function nextRandom(state: number): [number, number] {
  const s = (state + 0x6d2b79f5) >>> 0
  let t = s
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, s]
}

/** Fisher-Yates shuffle. Pure: returns the shuffled copy and the next RNG state. */
export function shuffle<T>(items: readonly T[], rngState: number): [T[], number] {
  const out = items.slice()
  let state = rngState
  for (let i = out.length - 1; i > 0; i--) {
    let r: number
    ;[r, state] = nextRandom(state)
    const j = Math.floor(r * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return [out, state]
}
