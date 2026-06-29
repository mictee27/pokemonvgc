import type { PokemonSlot, PlayerInfo, ValidationError } from '../types'
import { POKEMON_MAP, ALL_POKEMON_NAMES_LOWER } from '../data/pokemon'
import { ITEM_MAP, MEGA_STONE_SPECIES_MAP } from '../data/items'
import { LEGAL_MOVES } from '../data/moves'

const LEGAL_MOVE_NAMES = new Set(LEGAL_MOVES.map(m => m.name.toLowerCase()))

export function validateTeam(
  slots: PokemonSlot[],
  player: PlayerInfo
): ValidationError[] {
  const errors: ValidationError[] = []

  // Player identity checks
  if (!player.firstName.trim()) errors.push({ field: 'firstName', message: 'First name is required' })
  if (!player.lastName.trim()) errors.push({ field: 'lastName', message: 'Surname is required' })
  if (!player.playerId.trim()) errors.push({ field: 'playerId', message: 'Player ID is required' })
  if (!player.birthYear.trim()) errors.push({ field: 'birthYear', message: 'Year of birth is required' })

  const filledSlots = slots.filter(s => s.speciesId)

  // Must have exactly 6 Pokémon
  if (filledSlots.length < 6) {
    errors.push({ field: 'team', message: `All 6 Pokémon slots must be filled (${filledSlots.length}/6 filled)` })
  }

  const seenSpecies = new Map<string, number>()
  const seenItems = new Map<string, number>()
  const seenNicknames = new Map<string, number>()

  slots.forEach((slot, i) => {
    if (!slot.speciesId) return

    const species = POKEMON_MAP.get(slot.speciesId)
    if (!species) {
      errors.push({ field: 'species', slotIndex: i, message: `"${slot.speciesId}" is not legal in Regulation M-B` })
      return
    }

    // Duplicate species check (National Dex)
    const baseDexId = slot.speciesId.split('-')[0]
    if (seenSpecies.has(baseDexId)) {
      errors.push({ field: 'species', slotIndex: i, message: `Duplicate Pokémon: same species already in slot ${(seenSpecies.get(baseDexId) ?? 0) + 1}` })
    } else {
      seenSpecies.set(baseDexId, i)
    }

    // Ability check
    if (!slot.ability) {
      errors.push({ field: 'ability', slotIndex: i, message: 'Ability is required' })
    } else if (slot.ability === 'Battle Bond') {
      errors.push({ field: 'ability', slotIndex: i, message: 'Battle Bond is not a legal ability in VGC' })
    }

    // Item checks
    if (slot.item) {
      if (seenItems.has(slot.item)) {
        errors.push({ field: 'item', slotIndex: i, message: `Duplicate item: "${slot.item}" already held by slot ${(seenItems.get(slot.item) ?? 0) + 1}` })
      } else {
        seenItems.set(slot.item, i)
      }

      // Mega Stone compatibility
      const requiredSpecies = MEGA_STONE_SPECIES_MAP.get(slot.item)
      if (requiredSpecies && requiredSpecies !== slot.speciesId) {
        const correctSpecies = POKEMON_MAP.get(requiredSpecies)
        errors.push({
          field: 'item', slotIndex: i,
          message: `${slot.item} can only be held by ${correctSpecies?.name ?? requiredSpecies}`,
        })
      }
    }

    // Moves
    slot.moves.forEach((move, mi) => {
      if (!move) {
        errors.push({ field: `move${mi}`, slotIndex: i, message: `Move ${mi + 1} is required` })
      } else if (!LEGAL_MOVE_NAMES.has(move.toLowerCase())) {
        errors.push({ field: `move${mi}`, slotIndex: i, message: `"${move}" is not a legal move in Regulation M-B` })
      }
    })

    // Stats required
    const statFields: Array<[keyof PokemonSlot, string]> = [
      ['statHp', 'HP'], ['statAtk', 'Atk'], ['statDef', 'Def'],
      ['statSpA', 'Sp. Atk'], ['statSpD', 'Sp. Def'], ['statSpe', 'Speed'],
    ]
    for (const [key, label] of statFields) {
      if (!slot[key] || (slot[key] as number) <= 0) {
        errors.push({ field: key as string, slotIndex: i, message: `${label} stat is required` })
      }
    }

    // Nickname rules
    if (slot.nickname) {
      const nickLower = slot.nickname.toLowerCase()
      if (seenNicknames.has(nickLower)) {
        errors.push({ field: 'nickname', slotIndex: i, message: `Duplicate nickname: "${slot.nickname}" already used in slot ${(seenNicknames.get(nickLower) ?? 0) + 1}` })
      } else {
        seenNicknames.set(nickLower, i)
      }
      if (ALL_POKEMON_NAMES_LOWER.has(nickLower)) {
        errors.push({ field: 'nickname', slotIndex: i, message: `Nickname "${slot.nickname}" is the name of a Pokémon species — this is not allowed` })
      }
    }
  })

  return errors
}

export function errorsForSlot(errors: ValidationError[], slotIndex: number): ValidationError[] {
  return errors.filter(e => e.slotIndex === slotIndex)
}

export function globalErrors(errors: ValidationError[]): ValidationError[] {
  return errors.filter(e => e.slotIndex === undefined)
}
