import type { PokemonType } from '../types'

const TYPE_STYLES: Record<PokemonType, { bg: string; color: string; abbr: string }> = {
  Normal:   { bg: '#D3D1C7', color: '#2C2C2A', abbr: 'NOR' },
  Fire:     { bg: '#F5C4B3', color: '#712B13', abbr: 'FIR' },
  Water:    { bg: '#B5D4F4', color: '#042C53', abbr: 'WAT' },
  Electric: { bg: '#FAC775', color: '#412402', abbr: 'ELE' },
  Grass:    { bg: '#C0DD97', color: '#173404', abbr: 'GRA' },
  Ice:      { bg: '#E6F1FB', color: '#042C53', abbr: 'ICE' },
  Fighting: { bg: '#F5C4B3', color: '#4A1B0C', abbr: 'FIG' },
  Poison:   { bg: '#F4C0D1', color: '#4B1528', abbr: 'POI' },
  Ground:   { bg: '#FAC775', color: '#633806', abbr: 'GRO' },
  Flying:   { bg: '#B5D4F4', color: '#0C447C', abbr: 'FLY' },
  Psychic:  { bg: '#F4C0D1', color: '#72243E', abbr: 'PSY' },
  Bug:      { bg: '#C0DD97', color: '#27500A', abbr: 'BUG' },
  Rock:     { bg: '#D3D1C7', color: '#444441', abbr: 'ROC' },
  Ghost:    { bg: '#CECBF6', color: '#3C3489', abbr: 'GHO' },
  Dragon:   { bg: '#CECBF6', color: '#26215C', abbr: 'DRA' },
  Dark:     { bg: '#B4B2A9', color: '#2C2C2A', abbr: 'DAR' },
  Steel:    { bg: '#D3D1C7', color: '#5F5E5A', abbr: 'STE' },
  Fairy:    { bg: '#F4C0D1', color: '#72243E', abbr: 'FAI' },
}

interface Props {
  type: PokemonType
  full?: boolean
  size?: 'sm' | 'md'
}

export function TypeBadge({ type, full = false, size = 'sm' }: Props) {
  const s = TYPE_STYLES[type]
  const fontSize = size === 'md' ? '11px' : '9px'
  const padding = size === 'md' ? '3px 8px' : '2px 5px'
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize, fontWeight: 500, padding, borderRadius: '3px',
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {full ? type : s.abbr}
    </span>
  )
}
