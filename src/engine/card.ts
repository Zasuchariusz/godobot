export type Color = 'W' | 'U' | 'B' | 'R' | 'G'
export type ManaSymbol = Color | 'C'

export type CardType =
  | 'land'
  | 'artifact'
  | 'creature'
  | 'instant'
  | 'sorcery'
  | 'enchantment'
  | 'planeswalker'

export type Supertype = 'legendary' | 'basic' | 'snow'

/** Parsed from a Scryfall mana cost such as "{4}{W}{W}". */
export interface ManaCost {
  generic: number
  colored: Partial<Record<Color, number>>
}

/** To be expanded later to include functions */
/** A mana ability that can be described purely as data (Sol Ring, Signets, Moxen). */
export interface ManaAbilityDef {
  /** Generic mana to pay in addition to tapping, e.g. Signets and filter lands. */
  cost?: number
  /** Mana produced. Several entries means all of them are produced together. */
  produces: ManaSymbol[]
  /** If true, produces one mana of any color instead of the listed symbols. */
  anyColor?: boolean
}

/** Static, immutable definition shared by every copy of a card. */
export interface CardDef {
  /** Slug of the name, e.g. "sol-ring". Key into the effects registry. */
  id: string
  name: string
  manaCost: ManaCost
  cmc: number
  types: CardType[]
  supertypes: Supertype[]
  subtypes: string[]
  oracleText: string
  colorIdentity: Color[]
  /** Local bundled image path. Never a remote URL. */
  imageFile?: string
  entersTapped?: boolean
  mana?: ManaAbilityDef[]
}

/** One physical card in one game. Zones are lists of these. */
export interface CardInstance {
  /** Unique within a game; stable across zone changes. */
  uid: number
  defId: string
  tapped: boolean
  counters: number
}
