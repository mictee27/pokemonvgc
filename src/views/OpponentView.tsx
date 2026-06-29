import type { TeamSubmission } from '../types'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'
import { ITEM_MAP } from '../data/items'
import { LEGAL_MOVES } from '../data/moves'
import { TypeBadge } from '../components/TypeBadge'

interface Props {
  submission: TeamSubmission
  onBack: () => void
}

export function OpponentView({ submission, onBack }: Props) {
  const { player, slots } = submission
  const moveTypeMap = new Map(LEGAL_MOVES.map(m => [m.name, m.type]))

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Screen-only header */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ padding: '6px 12px', fontSize: '12px', border: '0.5px solid var(--border-color)', borderRadius: '8px', background: 'var(--surface-raised)', color: 'var(--text)', cursor: 'pointer' }}>
          ← Back
        </button>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>Opponent copy</h2>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stats are hidden. Share this with your opponent at the start of each round.</div>
        </div>
        <button onClick={() => window.print()} style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px', border: '0.5px solid var(--border-color)', borderRadius: '8px', background: 'var(--surface-raised)', color: 'var(--text)', cursor: 'pointer' }}>
          Print
        </button>
      </div>

      {/* Print-only title */}
      <div className="print-only" style={{ display: 'none', marginBottom: '12pt' }}>
        <div style={{ fontSize: '14pt', fontWeight: 600 }}>Flinch VGC Team List — Opponent Copy</div>
        <div style={{ fontSize: '9pt', color: '#555' }}>Regulation M-B · Pokémon Champions</div>
      </div>

      {/* Player header */}
      <div style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '13px' }}>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>First name</span>{player.firstName}</div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Surname</span>{player.lastName}</div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Player ID</span>{player.playerId}</div>
        </div>
      </div>

      {/* Team grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {slots.map((slot, i) => {
          if (!slot.speciesId) return null
          const species = POKEMON_MAP.get(slot.speciesId)
          const itemData = ITEM_MAP.get(slot.item.toLowerCase().replace(/ /g, '-'))
          const isMega = itemData?.isMegaStone
          const displayTypes = isMega
            ? (slot.megaForm === 'Y' && species?.megaTypesAlt ? species.megaTypesAlt : species?.megaTypes ?? species?.types ?? [])
            : (species?.types ?? [])
          const spriteKey = isMega
            ? (slot.megaForm === 'Y' && species?.megaSpriteKeyAlt ? species.megaSpriteKeyAlt : species?.megaSpriteKey ?? species?.spriteKey ?? '')
            : (species?.spriteKey ?? '')

          const displayName = isMega && slot.megaForm
            ? `Mega ${species?.name}${species?.megaStoneAlt ? ` ${slot.megaForm}` : ''}`
            : (species?.name ?? slot.speciesId)

          return (
            <div key={i} className="print-slot" style={{ background: 'var(--surface-raised)', border: `0.5px solid ${isMega ? '#FAC775' : 'var(--border-color)'}`, borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

                {/* Sprite — screen only */}
                <img
                  className="no-print"
                  src={getSpriteUrl(spriteKey)}
                  alt={species?.name ?? ''}
                  onError={e => { (e.target as HTMLImageElement).src = getSpriteUrl(spriteKey, false) }}
                  style={{ width: '64px', height: '64px', objectFit: 'contain', flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                      {i + 1}. {displayName}
                    </span>
                    {isMega && <span className="no-print" style={{ fontSize: '9px', fontWeight: 600, background: '#FAEEDA', color: '#633806', border: '0.5px solid #FAC775', borderRadius: '3px', padding: '1px 4px' }}>MEGA</span>}
                  </div>

                  {slot.nickname && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>"{slot.nickname}"</div>}

                  {/* Screen: coloured type badges */}
                  <div className="no-print" style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {displayTypes.map(t => t && <TypeBadge key={t} type={t} />)}
                  </div>
                  {/* Print: plain text types */}
                  <div className="print-only" style={{ display: 'none', fontSize: '9pt', marginBottom: '4pt', color: '#444' }}>
                    {displayTypes.filter(Boolean).join(' / ')}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text)' }}>Ability:</span> {slot.ability}
                  </div>
                  {slot.item && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>Item:</span> {slot.item}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {slot.moves.filter(Boolean).map((move, mi) => {
                      const mtype = moveTypeMap.get(move)
                      return (
                        <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>•</span>
                          <span>{move}</span>
                          <span className="no-print">{mtype && <TypeBadge type={mtype} />}</span>
                          <span className="print-only" style={{ display: 'none', fontSize: '8pt', color: '#666' }}>[{mtype}]</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        All Pokémon must be listed exactly as they appear in the Battle Team. · Regulation M-B
      </div>
    </div>
  )
}
