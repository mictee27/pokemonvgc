import { useState } from 'react'
import type { PokemonSlot } from '../types'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'
import { ITEM_MAP } from '../data/items'
import { TypeBadge } from './TypeBadge'
import type { ValidationError } from '../types'

interface Props {
  slot: PokemonSlot
  index: number
  active: boolean
  onClick: () => void
  errors: ValidationError[]
}

export function PokemonSlotCard({ slot, index, active, onClick, errors }: Props) {
  const species = POKEMON_MAP.get(slot.speciesId)
  const item = ITEM_MAP.get(slot.item.toLowerCase().replace(/ /g, '-'))
  const isMega = item?.isMegaStone
  const hasErrors = errors.length > 0
  const isEmpty = !slot.speciesId

  const getMegaSpriteKey = () => {
    if (!species || !isMega) return species?.spriteKey ?? ''
    if (slot.megaForm === 'Y' && species.megaSpriteKeyAlt) return species.megaSpriteKeyAlt
    return species.megaSpriteKey ?? species.spriteKey
  }

  const getMegaTypes = () => {
    if (!species || !isMega) return species?.types ?? []
    if (slot.megaForm === 'Y' && species.megaTypesAlt) return species.megaTypesAlt
    return species.megaTypes ?? species.types
  }

  const spriteKey = getMegaSpriteKey()
  const displayTypes = getMegaTypes()

  let borderColor = 'var(--border-color)'
  let borderWidth = '1px'
  let boxShadow = 'var(--shadow-sm)'
  let bgColor = 'var(--surface)'

  if (active) {
    borderColor = 'var(--accent)'
    borderWidth = '2px'
    boxShadow = '0 0 0 3px rgba(59,76,202,0.12), var(--shadow-md)'
    bgColor = 'var(--surface)'
  } else if (hasErrors && !isEmpty) {
    borderColor = 'var(--error)'
    boxShadow = '0 0 0 2px rgba(220,38,38,0.08), var(--shadow-sm)'
  } else if (isMega) {
    borderColor = 'var(--mega-border)'
    bgColor = 'var(--mega-muted)'
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: bgColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: '14px',
        padding: '10px 8px',
        cursor: 'pointer',
        position: 'relative',
        minHeight: 'clamp(130px, 20vw, 210px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
        transform: active ? 'translateY(-3px)' : 'none',
        boxShadow,
      }}
    >
      {/* Slot number */}
      <span style={{
        position: 'absolute', top: '8px', left: '10px',
        fontSize: '10px', fontWeight: 700,
        color: active ? 'var(--accent)' : 'var(--text-subtle)',
        letterSpacing: '0.05em',
      }}>
        {index + 1}
      </span>

      {/* Mega badge */}
      {isMega && (
        <span style={{
          position: 'absolute', top: '7px', right: '8px',
          fontSize: '8px', fontWeight: 700,
          background: 'var(--mega)',
          color: '#fff',
          borderRadius: '4px', padding: '2px 5px',
          letterSpacing: '0.08em',
        }}>
          MEGA
        </span>
      )}

      {/* Error dot */}
      {hasErrors && !isEmpty && (
        <span style={{
          position: 'absolute', top: isMega ? '22px' : '7px', right: '8px',
          width: '7px', height: '7px', borderRadius: '50%',
          background: 'var(--error)',
          boxShadow: '0 0 0 2px rgba(220,38,38,0.2)',
        }} />
      )}

      {isEmpty ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '6px', color: 'var(--text-subtle)', paddingTop: '20px',
        }}>
          {/* Pokéball outline */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" opacity="0.35">
            <circle cx="15" cy="15" r="13.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="1.5" y1="15" x2="28.5" y2="15" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>Add Pokémon</span>
        </div>
      ) : (
        <>
          <SpriteImage spriteKey={spriteKey} name={species?.name ?? ''} />

          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--text)',
            textAlign: 'center', marginBottom: '4px', lineHeight: 1.3,
          }}>
            {species?.name ?? slot.speciesId}
          </div>

          <div style={{ display: 'flex', gap: '3px', marginBottom: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {displayTypes.map(t => t && <TypeBadge key={t} type={t} />)}
          </div>

          {slot.item && (
            <div style={{ fontSize: '10px', color: 'var(--mega)', fontWeight: 600, marginBottom: '3px', textAlign: 'center' }}>
              {slot.item}
            </div>
          )}

          <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', width: '100%' }}>
            {slot.moves.filter(Boolean).map((move, i) => (
              <li key={i} style={{
                fontSize: '10px', color: 'var(--text-muted)',
                padding: '1px 0', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span style={{ color: 'var(--border-strong)', fontSize: '8px' }}>●</span>{move}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function SpriteImage({ spriteKey, name }: { spriteKey: string; name: string }) {
  const [useFallback, setUseFallback] = useState(false)
  const src = useFallback ? getSpriteUrl(spriteKey, false) : getSpriteUrl(spriteKey, true)
  return (
    <img
      src={src}
      alt={name}
      onError={() => setUseFallback(true)}
      style={{ width: '72px', height: '72px', objectFit: 'contain', imageRendering: 'auto' }}
    />
  )
}
