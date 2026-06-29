import { useState } from 'react'
import type { PokemonSlot } from '../types'
import { POKEMON_MAP, POKEMON_NAMES, getSpriteUrl } from '../data/pokemon'
import { ITEM_MAP, ITEM_NAMES } from '../data/items'
import { LEGAL_MOVES } from '../data/moves'
import { TypeBadge } from './TypeBadge'
import { Autocomplete } from './Autocomplete'
import type { ValidationError } from '../types'

const MOVE_NAMES = LEGAL_MOVES.map(m => m.name)
const NATURES = ['Hardy','Lonely','Brave','Adamant','Naughty','Bold','Docile','Relaxed','Impish','Lax','Timid','Hasty','Serious','Jolly','Naive','Modest','Mild','Quiet','Bashful','Rash','Calm','Gentle','Sassy','Careful','Quirky']
const STAT_MAX = 250

interface Props {
  slot: PokemonSlot
  onChange: (slot: PokemonSlot) => void
  errors: ValidationError[]
  isStaff?: boolean
}

export function DetailPanel({ slot, onChange, errors, isStaff = true }: Props) {
  const species = POKEMON_MAP.get(slot.speciesId)
  const itemData = ITEM_MAP.get(slot.item.toLowerCase().replace(/ /g, '-'))
  const isMega = itemData?.isMegaStone
  const hasDualForm = !!(species?.megaStoneAlt)

  const displayTypes = isMega
    ? (slot.megaForm === 'Y' && species?.megaTypesAlt ? species.megaTypesAlt : species?.megaTypes ?? species?.types ?? [])
    : (species?.types ?? [])

  const megaAbility = slot.megaForm === 'Y' && species?.megaAbilityAlt
    ? species.megaAbilityAlt
    : species?.megaAbility

  const spriteKey = isMega
    ? (slot.megaForm === 'Y' && species?.megaSpriteKeyAlt ? species.megaSpriteKeyAlt : species?.megaSpriteKey ?? species?.spriteKey ?? '')
    : (species?.spriteKey ?? '')

  const update = (patch: Partial<PokemonSlot>) => onChange({ ...slot, ...patch })
  const setMove = (i: number, v: string) => {
    const moves = [...slot.moves] as typeof slot.moves
    moves[i] = v
    update({ moves })
  }

  const errField = (field: string) => errors.find(e => e.field === field)

  const fieldStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '6px 10px', fontSize: '13px',
    border: `0.5px solid ${errField(field) ? '#E24B4A' : 'var(--border-color)'}`,
    borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box',
  })

  const label = (text: string) => (
    <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px' }}>{text}</div>
  )

  const fieldGroup = (labelText: string, content: React.ReactNode, field?: string) => (
    <div style={{ marginBottom: '12px' }}>
      {label(labelText)}
      {content}
      {field && errField(field) && (
        <div style={{ fontSize: '11px', color: '#E24B4A', marginTop: '3px' }}>{errField(field)!.message}</div>
      )}
    </div>
  )

  if (!slot.speciesId) {
    return (
      <div style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px' }}>Species</div>
        <Autocomplete
          value=""
          onChange={name => {
            const found = Array.from(POKEMON_MAP.values()).find(p => p.name.toLowerCase() === name.toLowerCase())
            if (found) {
              onChange({
                ...slot,
                speciesId: found.id,
                ability: found.abilities[0] ?? '',
              })
            }
          }}
          options={POKEMON_NAMES}
          placeholder="Search for a Pokémon..."
        />
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Search and select a Pokémon to fill this slot
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border-color)' }}>
        {spriteKey && (
          <img src={getSpriteUrl(spriteKey)} alt={species?.name ?? ''} style={{ width: '64px', height: '64px', objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).src = getSpriteUrl(spriteKey, false) }} />
        )}
        <div>
          <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text)', marginBottom: '5px' }}>
            {isMega && slot.megaForm ? `Mega ${species?.name} ${hasDualForm ? slot.megaForm : ''}` : species?.name}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {displayTypes.map(t => t && <TypeBadge key={t} type={t} size="md" full />)}
          </div>
        </div>
      </div>

      {/* Mega Evolution panel */}
      {isMega && megaAbility && (
        <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#633806', marginBottom: '6px', letterSpacing: '0.04em' }}>
            ⚡ MEGA EVOLUTION
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#412402', marginBottom: '2px' }}>{megaAbility}</div>
          {hasDualForm && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {(['X', 'Y'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => update({ megaForm: f })}
                  style={{
                    padding: '4px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                    border: '0.5px solid #FAC775', cursor: 'pointer',
                    background: slot.megaForm === f ? '#EF9F27' : 'white',
                    color: slot.megaForm === f ? 'white' : '#633806',
                  }}
                >
                  Mega {f}
                </button>
              ))}
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#854F0B', marginTop: '6px' }}>
            Held item locked: {slot.item}
          </div>
        </div>
      )}

      <div className="detail-fields">
        {/* Left column */}
        <div>
          {fieldGroup('Species', (
            <Autocomplete
              value={species?.name ?? ''}
              onChange={name => {
                const found = Array.from(POKEMON_MAP.values()).find(p => p.name === name)
                if (found) update({ speciesId: found.id, ability: found.abilities[0] ?? '', megaForm: found.megaStoneAlt ? 'X' : null })
              }}
              options={POKEMON_NAMES}
              placeholder="Search Pokémon..."
            />
          ), 'species')}

          {fieldGroup('Ability (pre-mega)', (
            <select
              value={slot.ability}
              onChange={e => update({ ability: e.target.value })}
              style={fieldStyle('ability')}
            >
              <option value="">Select ability</option>
              {(species?.abilities ?? []).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          ), 'ability')}

          {fieldGroup(isMega ? 'Held item — locked (Mega Stone)' : 'Held item', (
            <Autocomplete
              value={slot.item}
              onChange={item => update({ item, megaForm: ITEM_MAP.get(item.toLowerCase().replace(/ /g, '-'))?.isMegaStone ? (species?.megaStoneAlt ? 'X' : null) : null })}
              options={ITEM_NAMES}
              placeholder="Search items..."
              disabled={false}
            />
          ), 'item')}

          {fieldGroup('Nickname (optional)', (
            <input
              value={slot.nickname}
              onChange={e => update({ nickname: e.target.value })}
              placeholder="No nickname"
              style={fieldStyle('nickname')}
            />
          ), 'nickname')}
        </div>

        {/* Right column */}
        <div>
          {fieldGroup('Moves', (
            <div>
              {([0, 1, 2, 3] as const).map(i => {
                const moveData = LEGAL_MOVES.find(m => m.name === slot.moves[i])
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <Autocomplete
                        value={slot.moves[i]}
                        onChange={v => setMove(i, v)}
                        options={MOVE_NAMES}
                        placeholder={`Move ${i + 1}`}
                      />
                    </div>
                    {moveData && <TypeBadge type={moveData.type} size="md" />}
                  </div>
                )
              })}
            </div>
          ))}

          {isStaff && fieldGroup('Stats (at actual level)', (
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4px 8px', alignItems: 'center' }}>
              {([
                ['HP', 'statHp', '#639922'],
                ['Atk', 'statAtk', '#185FA5'],
                ['Def', 'statDef', '#185FA5'],
                ['SpA', 'statSpA', '#993556'],
                ['SpD', 'statSpD', '#185FA5'],
                ['Spe', 'statSpe', '#993556'],
              ] as const).map(([label, key, color]) => (
                <>
                  <span key={`l-${key}`} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                  <div key={`b-${key}`} style={{ height: '5px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, ((slot[key] as number) / STAT_MAX) * 100)}%`, background: color, borderRadius: '3px', transition: 'width 0.2s' }} />
                  </div>
                  <input
                    key={`i-${key}`}
                    type="number"
                    min={1} max={999}
                    value={(slot[key] as number) || ''}
                    onChange={e => update({ [key]: parseInt(e.target.value) || 0 })}
                    style={{ width: '44px', padding: '2px 4px', fontSize: '11px', fontWeight: 500, textAlign: 'right', border: '0.5px solid var(--border-color)', borderRadius: '4px', background: 'var(--surface)', color: 'var(--text)' }}
                  />
                </>
              ))}
            </div>
          ))}

          {fieldGroup('Stat alignment', (
            <input
              value={slot.statAlignment}
              onChange={e => update({ statAlignment: e.target.value })}
              placeholder="e.g. +SpA, -Atk"
              style={fieldStyle('statAlignment')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
