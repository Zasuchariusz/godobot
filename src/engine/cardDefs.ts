import type {
  CardDef,
  CardType,
  Color,
  ManaAbilityDef,
  ManaCost,
  Supertype,
} from './card'

// Hand-written placeholder definitions for the vertical slice.
// Real cards come from data/cards.json; the rest are fakes

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const cost = (generic: number, colored: ManaCost['colored'] = {}): ManaCost => ({
  generic,
  colored,
})

interface Spec {
  name: string
  cost?: ManaCost
  types: CardType[]
  supertypes?: Supertype[]
  subtypes?: string[]
  text?: string
  identity?: Color[]
  mana?: ManaAbilityDef[]
}

const def = (s: Spec): CardDef => {
  const manaCost = s.cost ?? cost(0)
  const colored = Object.values(manaCost.colored).reduce((a, b) => a + (b ?? 0), 0)
  return {
    id: slug(s.name),
    name: s.name,
    manaCost,
    cmc: manaCost.generic + colored,
    types: s.types,
    supertypes: s.supertypes ?? [],
    subtypes: s.subtypes ?? [],
    oracleText: s.text ?? '',
    colorIdentity: s.identity ?? [],
    mana: s.mana,
  }
}

const W: Color[] = ['W']
const anyColor: ManaAbilityDef = { produces: [], anyColor: true }

// --- Lands (10) ---
const lands: CardDef[] = [
  def({ name: 'Plains', types: ['land'], supertypes: ['basic'], subtypes: ['Plains'], text: '{T}: Add {W}.', identity: W, mana: [{ produces: ['W'] }] }),
  def({ name: 'Ancient Den', types: ['artifact', 'land'], text: '{T}: Add {W}.', identity: W, mana: [{ produces: ['W'] }] }),
  def({ name: 'Ancient Tomb', types: ['land'], text: '{T}: Add {C}{C}. This land deals 2 damage to you.', mana: [{ produces: ['C', 'C'] }] }),
  def({ name: 'City of Brass', types: ['land'], text: 'Whenever this land becomes tapped, it deals 1 damage to you.\n{T}: Add one mana of any color.', mana: [anyColor] }),
  def({ name: 'Command Beacon', types: ['land'], text: '{T}: Add {C}.\n{T}, Sacrifice this land: Put your commander into your hand from the command zone.', mana: [{ produces: ['C'] }] }),
  def({ name: 'Eiganjo, Seat of the Empire', types: ['land'], supertypes: ['legendary'], text: '{T}: Add {W}.', identity: W, mana: [{ produces: ['W'] }] }),
  def({ name: 'Sunlit Meadow', types: ['land'], text: '{T}: Add {W}.', identity: W, mana: [{ produces: ['W'] }] }),
  def({ name: 'Barren Hollow', types: ['land'], text: '{T}: Add {C}.', mana: [{ produces: ['C'] }] }),
  def({ name: 'Quiet Grotto', types: ['land'], text: '{T}: Add {C}.', mana: [{ produces: ['C'] }] }),
  def({ name: 'Prismatic Crossroads', types: ['land'], text: '{T}: Add one mana of any color.', mana: [anyColor] }),
]

// --- Mana artifacts (10) ---
const artifacts: CardDef[] = [
  def({ name: 'Sol Ring', cost: cost(1), types: ['artifact'], text: '{T}: Add {C}{C}.', mana: [{ produces: ['C', 'C'] }] }),
  def({ name: 'Arcane Signet', cost: cost(2), types: ['artifact'], text: "{T}: Add one mana of any color in your commander's color identity.", mana: [{ produces: ['W'] }] }),
  def({ name: 'Mana Vault', cost: cost(1), types: ['artifact'], text: '{T}: Add {C}{C}{C}.', mana: [{ produces: ['C', 'C', 'C'] }] }),
  def({ name: 'Lotus Petal', types: ['artifact'], text: '{T}, Sacrifice this artifact: Add one mana of any color.', mana: [anyColor] }),
  def({ name: 'Fellwar Stone', cost: cost(2), types: ['artifact'], text: '{T}: Add one mana of any color that a land an opponent controls could produce.', mana: [anyColor] }),
  def({ name: 'Coalition Relic', cost: cost(3), types: ['artifact'], text: '{T}: Add one mana of any color.', mana: [anyColor] }),
  def({ name: 'Iron Talisman', cost: cost(1), types: ['artifact'], text: '{T}: Add {C}.', mana: [{ produces: ['C'] }] }),
  def({ name: 'Dawnstone Signet', cost: cost(0, { W: 1 }), types: ['artifact'], text: '{1}, {T}: Add {W}{C}.', mana: [{ cost: 1, produces: ['W', 'C'] }] }),
  def({ name: 'Prism Orb', cost: cost(0, { W: 1 }), types: ['artifact'], text: '{T}: Add one mana of any color.', mana: [anyColor] }),
  def({ name: 'Radiant Conduit', cost: cost(3), types: ['artifact'], text: '{T}: Add {W}{W}.', mana: [{ produces: ['W', 'W'] }] }),
]

// --- No mana ability (20) ---
const others: CardDef[] = [
  def({ name: 'Dack Fayden, Helping Hand', cost: cost(4, { W: 2 }), types: ['creature'], supertypes: ['legendary'], subtypes: ['Human', 'Advisor'], text: 'When Dack Fayden enters, reveal cards from the top of your library until you reveal X creature cards, where X is the number of opponents you have.', identity: W }),
  def({ name: 'Abeyance', cost: cost(1, { W: 1 }), types: ['instant'], text: "Until end of turn, target player can't cast instant or sorcery spells. Draw a card.", identity: W }),
  def({ name: 'Enlightened Tutor', cost: cost(0, { W: 1 }), types: ['instant'], text: 'Search your library for an artifact or enchantment card, reveal it, then shuffle and put that card on top.', identity: W }),
  def({ name: 'Swords to Plowshares', cost: cost(0, { W: 1 }), types: ['instant'], text: 'Exile target creature. Its controller gains life equal to its power.', identity: W }),
  def({ name: 'Silence', cost: cost(0, { W: 1 }), types: ['instant'], text: "Your opponents can't cast spells this turn.", identity: W }),
  def({ name: 'Mana Tithe', cost: cost(0, { W: 1 }), types: ['instant'], text: 'Counter target spell unless its controller pays {1}.', identity: W }),
  def({ name: 'Reprieve', cost: cost(1, { W: 1 }), types: ['instant'], text: "Return target spell to its owner's hand. Draw a card.", identity: W }),
  def({ name: 'Brainstone', cost: cost(1), types: ['artifact'], text: '{2}, {T}, Sacrifice this artifact: Draw three cards, then put two cards from your hand on top of your library in any order.' }),
  def({ name: 'Deafening Silence', cost: cost(0, { W: 1 }), types: ['enchantment'], text: "Each player can't cast more than one noncreature spell each turn.", identity: W }),
  def({ name: 'Damping Sphere', cost: cost(2), types: ['artifact'], text: 'If a land is tapped for two or more mana, it produces {C} instead.' }),
  def({ name: 'Aldric the Stubborn', cost: cost(2, { W: 1 }), types: ['creature'], supertypes: ['legendary'], subtypes: ['Human'], text: 'Aldric the Stubborn can\'t attack unless a card was drawn this turn.', identity: W }),
  def({ name: 'Lyra the Apprentice', cost: cost(1, { W: 1 }), types: ['creature'], subtypes: ['Human'], text: 'Whenever you cast a spell, Lyra the Apprentice gets +1/+1 until end of turn.', identity: W }),
  def({ name: 'Gatekeeper Brom', cost: cost(3, { W: 1 }), types: ['creature'], subtypes: ['Human', 'Rogue'], text: 'Spells your opponents cast cost {1} more.', identity: W }),
  def({ name: 'Gambit of Fortune', cost: cost(2, { W: 1 }), types: ['sorcery'], text: 'Draw two cards.', identity: W }),
  def({ name: 'Blind Prospect', cost: cost(1, { W: 1 }), types: ['sorcery'], text: 'Reveal the top card of your library and put it into your hand.', identity: W }),
  def({ name: 'Glimpse Ahead', cost: cost(0, { W: 1 }), types: ['instant'], text: 'Scry 2.', identity: W }),
  def({ name: 'Watchful Eye', cost: cost(2, { W: 1 }), types: ['enchantment'], text: 'At the beginning of each opponent\'s upkeep, reveal the top card of your library.', identity: W }),
  def({ name: 'Sanctuary Chapel', cost: cost(3, { W: 1 }), types: ['enchantment'], text: 'At the beginning of your upkeep, you gain 1 life.', identity: W }),
  def({ name: 'Hush Song', cost: cost(1, { W: 1 }), types: ['instant'], text: 'Target creature gets -2/-0 until end of turn.', identity: W }),
  def({ name: 'Rallying Hymn', cost: cost(1, { W: 2 }), types: ['enchantment'], text: 'Creatures you control get +1/+0.', identity: W }),
]

export const CARD_DEFS: CardDef[] = [...lands, ...artifacts, ...others]

export const CARD_DEFS_BY_ID: Record<string, CardDef> = Object.fromEntries(
  CARD_DEFS.map((c) => [c.id, c]),
)
