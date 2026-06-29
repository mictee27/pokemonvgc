export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy'


export interface PokemonSpecies {
  id: string
  name: string
  types: [PokemonType, PokemonType?]
  abilities: string[]
  // Mega evolution info
  megaStone?: string        // e.g. "Charizardite X"
  megaStoneAlt?: string     // e.g. "Charizardite Y" for dual-mega species
  megaAbility?: string
  megaAbilityAlt?: string
  megaTypes?: [PokemonType, PokemonType?]
  megaTypesAlt?: [PokemonType, PokemonType?]
  // Form/gender flags
  requiresForm?: boolean
  requiresGender?: boolean
  // Showdown sprite key
  spriteKey: string
  megaSpriteKey?: string
  megaSpriteKeyAlt?: string
}

export interface MoveData {
  id: string
  name: string
  type: PokemonType
}

export interface ItemData {
  id: string
  name: string
  // If this is a Mega Stone, which species can hold it
  megaFor?: string   // species id
  isMegaStone?: boolean
}

export interface PokemonSlot {
  speciesId: string
  ability: string
  item: string
  moves: [string, string, string, string]
  statHp: number
  statAtk: number
  statDef: number
  statSpA: number
  statSpD: number
  statSpe: number
  statAlignment: string
  nickname: string
  megaForm: 'X' | 'Y' | null  // null = not mega or single form
}

export const emptySlot = (): PokemonSlot => ({
  speciesId: '',
  ability: '',
  item: '',
  moves: ['', '', '', ''],
  statHp: 0, statAtk: 0, statDef: 0, statSpA: 0, statSpD: 0, statSpe: 0,
  statAlignment: '',
  nickname: '',
  megaForm: null,
})

export interface PlayerInfo {
  firstName: string
  lastName: string
  playerId: string
  birthYear: string
}

export const emptyPlayer = (): PlayerInfo => ({
  firstName: '', lastName: '', playerId: '', birthYear: '',
})

export interface TeamSubmission {
  id: string
  eventId: string
  player: PlayerInfo
  slots: [PokemonSlot, PokemonSlot, PokemonSlot, PokemonSlot, PokemonSlot, PokemonSlot]
  submittedAt: string | null
  locked: boolean
  flagged: boolean
  flagNote: string
  eventTag: string
}

export interface ValidationError {
  field: string
  slotIndex?: number
  message: string
}

export interface EventConfig {
  id: string
  name: string
  date: string
  regulationSet: 'M-B'
  allowSelfEdit: boolean
}
