import type { PokemonSpecies } from '../types'

// Regulation M-B legal Pokémon — representative competitive set
// Full list is 224 species; this covers the major ones used in VGC
export const LEGAL_POKEMON: PokemonSpecies[] = [
  // Starters and their megas
  { id: 'charizard', name: 'Charizard', types: ['Fire', 'Flying'], abilities: ['Blaze', 'Solar Power'], spriteKey: 'charizard', megaStone: 'Charizardite X', megaStoneAlt: 'Charizardite Y', megaAbility: 'Tough Claws', megaAbilityAlt: 'Drought', megaTypes: ['Fire', 'Dragon'], megaTypesAlt: ['Fire', 'Flying'], megaSpriteKey: 'charizard-megax', megaSpriteKeyAlt: 'charizard-megay' },
  { id: 'venusaur', name: 'Venusaur', types: ['Grass', 'Poison'], abilities: ['Overgrow', 'Chlorophyll'], spriteKey: 'venusaur', megaStone: 'Venusaurite', megaAbility: 'Thick Fat', megaTypes: ['Grass', 'Poison'], megaSpriteKey: 'venusaur-mega' },
  { id: 'blastoise', name: 'Blastoise', types: ['Water'], abilities: ['Torrent', 'Rain Dish'], spriteKey: 'blastoise', megaStone: 'Blastoisinite', megaAbility: 'Mega Launcher', megaTypes: ['Water'], megaSpriteKey: 'blastoise-mega' },
  { id: 'blaziken', name: 'Blaziken', types: ['Fire', 'Fighting'], abilities: ['Blaze', 'Speed Boost'], spriteKey: 'blaziken', megaStone: 'Blazikenite', megaAbility: 'Speed Boost', megaTypes: ['Fire', 'Fighting'], megaSpriteKey: 'blaziken-mega' },
  { id: 'swampert', name: 'Swampert', types: ['Water', 'Ground'], abilities: ['Torrent', 'Damp'], spriteKey: 'swampert', megaStone: 'Swampertite', megaAbility: 'Swift Swim', megaTypes: ['Water', 'Ground'], megaSpriteKey: 'swampert-mega' },
  { id: 'sceptile', name: 'Sceptile', types: ['Grass'], abilities: ['Overgrow', 'Unburden'], spriteKey: 'sceptile', megaStone: 'Sceptilite', megaAbility: 'Lightning Rod', megaTypes: ['Grass', 'Dragon'], megaSpriteKey: 'sceptile-mega' },
  // Gen 1 fan favourites with megas
  { id: 'alakazam', name: 'Alakazam', types: ['Psychic'], abilities: ['Synchronize', 'Inner Focus', 'Magic Guard'], spriteKey: 'alakazam', megaStone: 'Alakazite', megaAbility: 'Trace', megaTypes: ['Psychic'], megaSpriteKey: 'alakazam-mega' },
  { id: 'gengar', name: 'Gengar', types: ['Ghost', 'Poison'], abilities: ['Cursed Body'], spriteKey: 'gengar', megaStone: 'Gengarite', megaAbility: 'Shadow Tag', megaTypes: ['Ghost', 'Poison'], megaSpriteKey: 'gengar-mega' },
  { id: 'kangaskhan', name: 'Kangaskhan', types: ['Normal'], abilities: ['Early Bird', 'Scrappy'], spriteKey: 'kangaskhan', megaStone: 'Kangaskhanite', megaAbility: 'Parental Bond', megaTypes: ['Normal'], megaSpriteKey: 'kangaskhan-mega' },
  { id: 'pinsir', name: 'Pinsir', types: ['Bug'], abilities: ['Hyper Cutter', 'Mold Breaker', 'Moxie'], spriteKey: 'pinsir', megaStone: 'Pinsirite', megaAbility: 'Aerilate', megaTypes: ['Bug', 'Flying'], megaSpriteKey: 'pinsir-mega' },
  { id: 'gyarados', name: 'Gyarados', types: ['Water', 'Flying'], abilities: ['Intimidate', 'Moxie'], spriteKey: 'gyarados', megaStone: 'Gyaradosite', megaAbility: 'Mold Breaker', megaTypes: ['Water', 'Dark'], megaSpriteKey: 'gyarados-mega' },
  { id: 'aerodactyl', name: 'Aerodactyl', types: ['Rock', 'Flying'], abilities: ['Rock Head', 'Pressure', 'Unnerve'], spriteKey: 'aerodactyl', megaStone: 'Aerodactylite', megaAbility: 'Tough Claws', megaTypes: ['Rock', 'Flying'], megaSpriteKey: 'aerodactyl-mega' },
  { id: 'mewtwo', name: 'Mewtwo', types: ['Psychic'], abilities: ['Pressure', 'Unnerve'], spriteKey: 'mewtwo', megaStone: 'Mewtwonite X', megaStoneAlt: 'Mewtwonite Y', megaAbility: 'Steadfast', megaAbilityAlt: 'Insomnia', megaTypes: ['Psychic', 'Fighting'], megaTypesAlt: ['Psychic'], megaSpriteKey: 'mewtwo-megax', megaSpriteKeyAlt: 'mewtwo-megay' },
  // Gen 2 megas
  { id: 'ampharos', name: 'Ampharos', types: ['Electric'], abilities: ['Static', 'Plus'], spriteKey: 'ampharos', megaStone: 'Ampharosite', megaAbility: 'Mold Breaker', megaTypes: ['Electric', 'Dragon'], megaSpriteKey: 'ampharos-mega' },
  { id: 'scizor', name: 'Scizor', types: ['Bug', 'Steel'], abilities: ['Swarm', 'Technician', 'Light Metal'], spriteKey: 'scizor', megaStone: 'Scizorite', megaAbility: 'Technician', megaTypes: ['Bug', 'Steel'], megaSpriteKey: 'scizor-mega' },
  { id: 'heracross', name: 'Heracross', types: ['Bug', 'Fighting'], abilities: ['Swarm', 'Guts', 'Moxie'], spriteKey: 'heracross', megaStone: 'Heracronite', megaAbility: 'Skill Link', megaTypes: ['Bug', 'Fighting'], megaSpriteKey: 'heracross-mega' },
  { id: 'houndoom', name: 'Houndoom', types: ['Dark', 'Fire'], abilities: ['Early Bird', 'Flash Fire', 'Unnerve'], spriteKey: 'houndoom', megaStone: 'Houndoomite', megaAbility: 'Solar Power', megaTypes: ['Dark', 'Fire'], megaSpriteKey: 'houndoom-mega' },
  { id: 'tyranitar', name: 'Tyranitar', types: ['Rock', 'Dark'], abilities: ['Sand Stream', 'Unnerve'], spriteKey: 'tyranitar', megaStone: 'Tyranitarite', megaAbility: 'Sand Stream', megaTypes: ['Rock', 'Dark'], megaSpriteKey: 'tyranitar-mega' },
  { id: 'slowbro', name: 'Slowbro', types: ['Water', 'Psychic'], abilities: ['Oblivious', 'Own Tempo', 'Regenerator'], spriteKey: 'slowbro', megaStone: 'Slowbronite', megaAbility: 'Shell Armor', megaTypes: ['Water', 'Psychic'], megaSpriteKey: 'slowbro-mega' },
  // Gen 3 megas
  { id: 'gardevoir', name: 'Gardevoir', types: ['Psychic', 'Fairy'], abilities: ['Synchronize', 'Trace', 'Telepathy'], spriteKey: 'gardevoir', megaStone: 'Gardevoirite', megaAbility: 'Pixilate', megaTypes: ['Psychic', 'Fairy'], megaSpriteKey: 'gardevoir-mega' },
  { id: 'mawile', name: 'Mawile', types: ['Steel', 'Fairy'], abilities: ['Hyper Cutter', 'Intimidate', 'Sheer Force'], spriteKey: 'mawile', megaStone: 'Mawilite', megaAbility: 'Huge Power', megaTypes: ['Steel', 'Fairy'], megaSpriteKey: 'mawile-mega' },
  { id: 'aggron', name: 'Aggron', types: ['Steel', 'Rock'], abilities: ['Sturdy', 'Rock Head', 'Heavy Metal'], spriteKey: 'aggron', megaStone: 'Aggronite', megaAbility: 'Filter', megaTypes: ['Steel'], megaSpriteKey: 'aggron-mega' },
  { id: 'medicham', name: 'Medicham', types: ['Fighting', 'Psychic'], abilities: ['Pure Power', 'Telepathy'], spriteKey: 'medicham', megaStone: 'Medichamite', megaAbility: 'Pure Power', megaTypes: ['Fighting', 'Psychic'], megaSpriteKey: 'medicham-mega' },
  { id: 'manectric', name: 'Manectric', types: ['Electric'], abilities: ['Static', 'Lightning Rod', 'Minus'], spriteKey: 'manectric', megaStone: 'Manectite', megaAbility: 'Intimidate', megaTypes: ['Electric'], megaSpriteKey: 'manectric-mega' },
  { id: 'sharpedo', name: 'Sharpedo', types: ['Water', 'Dark'], abilities: ['Rough Skin', 'Speed Boost'], spriteKey: 'sharpedo', megaStone: 'Sharpedonite', megaAbility: 'Strong Jaw', megaTypes: ['Water', 'Dark'], megaSpriteKey: 'sharpedo-mega' },
  { id: 'camerupt', name: 'Camerupt', types: ['Fire', 'Ground'], abilities: ['Magma Armor', 'Solid Rock', 'Anger Point'], spriteKey: 'camerupt', megaStone: 'Cameruptite', megaAbility: 'Sheer Force', megaTypes: ['Fire', 'Ground'], megaSpriteKey: 'camerupt-mega' },
  { id: 'altaria', name: 'Altaria', types: ['Dragon', 'Flying'], abilities: ['Natural Cure', 'Cloud Nine'], spriteKey: 'altaria', megaStone: 'Altarianite', megaAbility: 'Pixilate', megaTypes: ['Dragon', 'Fairy'], megaSpriteKey: 'altaria-mega' },
  { id: 'absol', name: 'Absol', types: ['Dark'], abilities: ['Pressure', 'Super Luck', 'Justified'], spriteKey: 'absol', megaStone: 'Absolite', megaAbility: 'Magic Bounce', megaTypes: ['Dark'], megaSpriteKey: 'absol-mega' },
  { id: 'salamence', name: 'Salamence', types: ['Dragon', 'Flying'], abilities: ['Intimidate', 'Moxie'], spriteKey: 'salamence', megaStone: 'Salamencite', megaAbility: 'Aerilate', megaTypes: ['Dragon', 'Flying'], megaSpriteKey: 'salamence-mega' },
  { id: 'metagross', name: 'Metagross', types: ['Steel', 'Psychic'], abilities: ['Clear Body', 'Light Metal'], spriteKey: 'metagross', megaStone: 'Metagrossite', megaAbility: 'Tough Claws', megaTypes: ['Steel', 'Psychic'], megaSpriteKey: 'metagross-mega' },
  { id: 'latias', name: 'Latias', types: ['Dragon', 'Psychic'], abilities: ['Levitate'], spriteKey: 'latias', megaStone: 'Latiasite', megaAbility: 'Levitate', megaTypes: ['Dragon', 'Psychic'], megaSpriteKey: 'latias-mega' },
  { id: 'latios', name: 'Latios', types: ['Dragon', 'Psychic'], abilities: ['Levitate'], spriteKey: 'latios', megaStone: 'Latiosite', megaAbility: 'Levitate', megaTypes: ['Dragon', 'Psychic'], megaSpriteKey: 'latios-mega' },
  { id: 'sableye', name: 'Sableye', types: ['Dark', 'Ghost'], abilities: ['Keen Eye', 'Stall', 'Prankster'], spriteKey: 'sableye', megaStone: 'Sablenite', megaAbility: 'Magic Bounce', megaTypes: ['Dark', 'Ghost'], megaSpriteKey: 'sableye-mega' },
  { id: 'beedrill', name: 'Beedrill', types: ['Bug', 'Poison'], abilities: ['Swarm', 'Sniper'], spriteKey: 'beedrill', megaStone: 'Beedrillite', megaAbility: 'Adaptability', megaTypes: ['Bug', 'Poison'], megaSpriteKey: 'beedrill-mega' },
  { id: 'pidgeot', name: 'Pidgeot', types: ['Normal', 'Flying'], abilities: ['Keen Eye', 'Tangled Feet', 'Big Pecks'], spriteKey: 'pidgeot', megaStone: 'Pidgeotite', megaAbility: 'No Guard', megaTypes: ['Normal', 'Flying'], megaSpriteKey: 'pidgeot-mega' },
  // Gen 4 megas
  { id: 'lucario', name: 'Lucario', types: ['Fighting', 'Steel'], abilities: ['Steadfast', 'Inner Focus', 'Justified'], spriteKey: 'lucario', megaStone: 'Lucarionite', megaAbility: 'Adaptability', megaTypes: ['Fighting', 'Steel'], megaSpriteKey: 'lucario-mega' },
  { id: 'lopunny', name: 'Lopunny', types: ['Normal'], abilities: ['Cute Charm', 'Klutz', 'Limber'], spriteKey: 'lopunny', megaStone: 'Lopunnite', megaAbility: 'Scrappy', megaTypes: ['Normal', 'Fighting'], megaSpriteKey: 'lopunny-mega' },
  { id: 'garchomp', name: 'Garchomp', types: ['Dragon', 'Ground'], abilities: ['Sand Veil', 'Rough Skin'], spriteKey: 'garchomp', megaStone: 'Garchompite', megaAbility: 'Sand Force', megaTypes: ['Dragon', 'Ground'], megaSpriteKey: 'garchomp-mega' },
  { id: 'gallade', name: 'Gallade', types: ['Psychic', 'Fighting'], abilities: ['Steadfast', 'Sharpness'], spriteKey: 'gallade', megaStone: 'Galladite', megaAbility: 'Inner Focus', megaTypes: ['Psychic', 'Fighting'], megaSpriteKey: 'gallade-mega' },
  { id: 'audino', name: 'Audino', types: ['Normal'], abilities: ['Healer', 'Regenerator', 'Klutz'], spriteKey: 'audino', megaStone: 'Audinite', megaAbility: 'Healer', megaTypes: ['Normal', 'Fairy'], megaSpriteKey: 'audino-mega' },
  { id: 'glalie', name: 'Glalie', types: ['Ice'], abilities: ['Inner Focus', 'Ice Body', 'Moody'], spriteKey: 'glalie', megaStone: 'Glalitite', megaAbility: 'Refrigerate', megaTypes: ['Ice'], megaSpriteKey: 'glalie-mega' },
  { id: 'abomasnow', name: 'Abomasnow', types: ['Grass', 'Ice'], abilities: ['Snow Warning', 'Soundproof'], spriteKey: 'abomasnow', megaStone: 'Abomasite', megaAbility: 'Snow Warning', megaTypes: ['Grass', 'Ice'], megaSpriteKey: 'abomasnow-mega' },
  // Gen 6 megas
  { id: 'diancie', name: 'Diancie', types: ['Rock', 'Fairy'], abilities: ['Clear Body'], spriteKey: 'diancie', megaStone: 'Diancite', megaAbility: 'Magic Bounce', megaTypes: ['Rock', 'Fairy'], megaSpriteKey: 'diancie-mega' },
  // Floette Eternal — unique M-B addition
  { id: 'floette-eternal', name: 'Floette (Eternal)', types: ['Fairy'], abilities: ['Flower Veil'], spriteKey: 'floette', megaStone: 'Floettite', megaAbility: 'Light of Ruin', megaTypes: ['Fairy'], megaSpriteKey: 'floette', requiresForm: true },
  // Barbaracle mega
  { id: 'barbaracle', name: 'Barbaracle', types: ['Rock', 'Water'], abilities: ['Tough Claws', 'Sniper', 'Pickpocket'], spriteKey: 'barbaracle', megaStone: 'Barbaracleite', megaAbility: 'Tough Claws', megaTypes: ['Rock', 'Water'], megaSpriteKey: 'barbaracle' },
  // Non-mega competitive staples
  { id: 'incineroar', name: 'Incineroar', types: ['Fire', 'Dark'], abilities: ['Blaze', 'Intimidate'], spriteKey: 'incineroar' },
  { id: 'urshifu-single', name: 'Urshifu (Single Strike)', types: ['Fighting', 'Dark'], abilities: ['Unseen Fist'], spriteKey: 'urshifu', requiresForm: true },
  { id: 'urshifu-rapid', name: 'Urshifu (Rapid Strike)', types: ['Fighting', 'Water'], abilities: ['Unseen Fist'], spriteKey: 'urshifu-rapidstrike', requiresForm: true },
  { id: 'flutter-mane', name: 'Flutter Mane', types: ['Ghost', 'Fairy'], abilities: ['Protosynthesis'], spriteKey: 'fluttermane' },
  { id: 'iron-hands', name: 'Iron Hands', types: ['Fighting', 'Electric'], abilities: ['Quark Drive'], spriteKey: 'ironhands' },
  { id: 'chien-pao', name: 'Chien-Pao', types: ['Dark', 'Ice'], abilities: ['Sword of Ruin'], spriteKey: 'chienpao' },
  { id: 'gholdengo', name: 'Gholdengo', types: ['Steel', 'Ghost'], abilities: ['Good as Gold'], spriteKey: 'gholdengo' },
  { id: 'rillaboom', name: 'Rillaboom', types: ['Grass'], abilities: ['Overgrow', 'Grassy Surge'], spriteKey: 'rillaboom' },
  { id: 'tornadus-incarnate', name: 'Tornadus (Incarnate)', types: ['Flying'], abilities: ['Prankster', 'Defiant'], spriteKey: 'tornadus', requiresForm: true },
  { id: 'tornadus-therian', name: 'Tornadus (Therian)', types: ['Flying'], abilities: ['Regenerator'], spriteKey: 'tornadus-therian', requiresForm: true },
  { id: 'landorus-therian', name: 'Landorus (Therian)', types: ['Ground', 'Flying'], abilities: ['Intimidate'], spriteKey: 'landorus-therian', requiresForm: true },
  { id: 'kingambit', name: 'Kingambit', types: ['Dark', 'Steel'], abilities: ['Defiant', 'Supreme Overlord', 'Pressure'], spriteKey: 'kingambit' },
  { id: 'basculegion-m', name: 'Basculegion-M', types: ['Water', 'Ghost'], abilities: ['Swift Swim', "Adaptability", "Mold Breaker"], spriteKey: 'basculegion', requiresForm: true },
  { id: 'palafin-hero', name: 'Palafin (Hero)', types: ['Water'], abilities: ['Zero to Hero'], spriteKey: 'palafin-hero', requiresForm: true },
  { id: 'iron-bundle', name: 'Iron Bundle', types: ['Ice', 'Water'], abilities: ['Quark Drive'], spriteKey: 'ironbundle' },
  { id: 'calyrex-shadow', name: 'Calyrex (Shadow Rider)', types: ['Psychic', 'Ghost'], abilities: ['As One'], spriteKey: 'calyrex-shadow', requiresForm: true },
  { id: 'calyrex-ice', name: 'Calyrex (Ice Rider)', types: ['Psychic', 'Ice'], abilities: ['As One'], spriteKey: 'calyrex-ice', requiresForm: true },
  { id: 'annihilape', name: 'Annihilape', types: ['Fighting', 'Ghost'], abilities: ['Vital Spirit', 'Inner Focus', 'Defiant'], spriteKey: 'annihilape' },
  { id: 'ogerpon-wellspring', name: 'Ogerpon (Wellspring)', types: ['Grass', 'Water'], abilities: ['Water Absorb'], spriteKey: 'ogerpon-wellspring', requiresForm: true },
  { id: 'ogerpon-hearthflame', name: 'Ogerpon (Hearthflame)', types: ['Grass', 'Fire'], abilities: ['Mold Breaker'], spriteKey: 'ogerpon-hearthflame', requiresForm: true },
  { id: 'ogerpon-cornerstone', name: 'Ogerpon (Cornerstone)', types: ['Grass', 'Rock'], abilities: ['Sturdy'], spriteKey: 'ogerpon-cornerstone', requiresForm: true },
  { id: 'meowstic-m', name: 'Meowstic (M)', types: ['Psychic'], abilities: ['Keen Eye', 'Infiltrator', 'Prankster'], spriteKey: 'meowstic', requiresGender: true },
  { id: 'meowstic-f', name: 'Meowstic (F)', types: ['Psychic'], abilities: ['Keen Eye', 'Infiltrator', 'Competitive'], spriteKey: 'meowstic-f', requiresGender: true },
  { id: 'indeedee-m', name: 'Indeedee (M)', types: ['Psychic', 'Normal'], abilities: ['Inner Focus', 'Synchronize', 'Psychic Surge'], spriteKey: 'indeedee', requiresGender: true },
  { id: 'indeedee-f', name: 'Indeedee (F)', types: ['Psychic', 'Normal'], abilities: ['Inner Focus', 'Synchronize', 'Own Tempo'], spriteKey: 'indeedee-f', requiresGender: true },
  // Additional common VGC species
  { id: 'amoonguss', name: 'Amoonguss', types: ['Grass', 'Poison'], abilities: ['Effect Spore', 'Regenerator'], spriteKey: 'amoonguss' },
  { id: 'miraidon', name: 'Miraidon', types: ['Electric', 'Dragon'], abilities: ['Hadron Engine'], spriteKey: 'miraidon' },
  { id: 'koraidon', name: 'Koraidon', types: ['Fighting', 'Dragon'], abilities: ['Orichalcum Pulse'], spriteKey: 'koraidon' },
  { id: 'calyrex-shadow', name: 'Calyrex (Shadow Rider)', types: ['Psychic', 'Ghost'], abilities: ['As One (Spectrier)'], spriteKey: 'calyrex-shadow', requiresForm: true },
  { id: 'calyrex-ice', name: 'Calyrex (Ice Rider)', types: ['Psychic', 'Ice'], abilities: ['As One (Glastrier)'], spriteKey: 'calyrex-ice', requiresForm: true },
  { id: 'urshifu', name: 'Urshifu (Single Strike)', types: ['Fighting', 'Dark'], abilities: ['Unseen Fist'], spriteKey: 'urshifu', requiresForm: true },
  { id: 'grimmsnarl', name: 'Grimmsnarl', types: ['Dark', 'Fairy'], abilities: ['Prankster', 'Frisk', 'Pickpocket'], spriteKey: 'grimmsnarl' },
  { id: 'whimsicott', name: 'Whimsicott', types: ['Grass', 'Fairy'], abilities: ['Prankster', 'Infiltrator', 'Chlorophyll'], spriteKey: 'whimsicott' },
  { id: 'torkoal', name: 'Torkoal', types: ['Fire'], abilities: ['White Smoke', 'Drought', 'Shell Armor'], spriteKey: 'torkoal' },
  { id: 'ninetales-alola', name: 'Ninetales (Alola)', types: ['Ice', 'Fairy'], abilities: ['Snow Cloak', 'Snow Warning'], spriteKey: 'ninetales-alola' },
  { id: 'farigiraf', name: 'Farigiraf', types: ['Normal', 'Psychic'], abilities: ['Cud Chew', 'Armor Tail', 'Sap Sipper'], spriteKey: 'farigiraf' },
  { id: 'ursaluna', name: 'Ursaluna', types: ['Ground', 'Normal'], abilities: ['Guts', 'Bulletproof', 'Unnerve'], spriteKey: 'ursaluna' },
  { id: 'walking-wake', name: 'Walking Wake', types: ['Water', 'Dragon'], abilities: ['Protosynthesis'], spriteKey: 'walkingwake' },
  { id: 'iron-leaves', name: 'Iron Leaves', types: ['Grass', 'Psychic'], abilities: ['Quark Drive'], spriteKey: 'ironleaves' },
  { id: 'iron-crown', name: 'Iron Crown', types: ['Steel', 'Psychic'], abilities: ['Quark Drive'], spriteKey: 'ironcrown' },
  { id: 'gouging-fire', name: 'Gouging Fire', types: ['Fire', 'Dragon'], abilities: ['Protosynthesis'], spriteKey: 'gougingfire' },
  { id: 'raging-bolt', name: 'Raging Bolt', types: ['Electric', 'Dragon'], abilities: ['Protosynthesis'], spriteKey: 'ragingbolt' },
  { id: 'terapagos', name: 'Terapagos', types: ['Normal'], abilities: ['Tera Shift'], spriteKey: 'terapagos' },
  { id: 'pecharunt', name: 'Pecharunt', types: ['Poison', 'Ghost'], abilities: ['Poison Puppeteer'], spriteKey: 'pecharunt' },
  { id: 'scream-tail', name: 'Scream Tail', types: ['Fairy', 'Psychic'], abilities: ['Quark Drive'], spriteKey: 'screamtail' },
  { id: 'brute-bonnet', name: 'Brute Bonnet', types: ['Grass', 'Dark'], abilities: ['Protosynthesis'], spriteKey: 'brutebonnet' },
  { id: 'sandy-shocks', name: 'Sandy Shocks', types: ['Electric', 'Ground'], abilities: ['Protosynthesis'], spriteKey: 'sandyshocks' },
  { id: 'iron-treads', name: 'Iron Treads', types: ['Ground', 'Steel'], abilities: ['Quark Drive'], spriteKey: 'irontreads' },
  { id: 'iron-moth', name: 'Iron Moth', types: ['Fire', 'Poison'], abilities: ['Quark Drive'], spriteKey: 'ironmoth' },
  { id: 'iron-thorns', name: 'Iron Thorns', types: ['Rock', 'Electric'], abilities: ['Quark Drive'], spriteKey: 'ironthorns' },
  { id: 'iron-valiant', name: 'Iron Valiant', types: ['Fairy', 'Fighting'], abilities: ['Quark Drive'], spriteKey: 'ironvaliant' },
  { id: 'roaring-moon', name: 'Roaring Moon', types: ['Dragon', 'Dark'], abilities: ['Protosynthesis'], spriteKey: 'roaringmoon' },
  { id: 'chi-yu', name: 'Chi-Yu', types: ['Dark', 'Fire'], abilities: ['Beads of Ruin'], spriteKey: 'chiyu' },
  { id: 'wo-chien', name: 'Wo-Chien', types: ['Dark', 'Grass'], abilities: ['Tablets of Ruin'], spriteKey: 'wochien' },
  { id: 'ting-lu', name: 'Ting-Lu', types: ['Dark', 'Ground'], abilities: ['Vessel of Ruin'], spriteKey: 'tinglu' },
]

export const POKEMON_MAP = new Map(LEGAL_POKEMON.map(p => [p.id, p]))
export const POKEMON_NAMES = LEGAL_POKEMON.map(p => p.name)

// All known Pokémon names (for nickname-conflict validation)
export const ALL_POKEMON_NAMES_LOWER = new Set(LEGAL_POKEMON.map(p => p.name.toLowerCase()))

export function getSpriteUrl(spriteKey: string, animated = true): string {
  const base = 'https://play.pokemonshowdown.com/sprites'
  if (animated) {
    return `${base}/ani/${spriteKey}.gif`
  }
  return `${base}/gen5/${spriteKey}.png`
}
