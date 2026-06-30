import type { TeamSubmission } from '../types'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'
import { ITEM_MAP } from '../data/items'
import { LEGAL_MOVES } from '../data/moves'
import { TypeBadge } from '../components/TypeBadge'

interface Props {
  submission: TeamSubmission
  onBack: () => void
}

const STAT_MAX = 250

export function StaffView({ submission, onBack }: Props) {
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
          <h2 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>Staff copy</h2>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Full details including stats. For judges only — do not share with opponents.</div>
        </div>
        <button onClick={() => window.print()} style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px', border: '0.5px solid var(--border-color)', borderRadius: '8px', background: 'var(--surface-raised)', color: 'var(--text)', cursor: 'pointer' }}>
          Print
        </button>
      </div>

      {/* Print-only title */}
      <div className="print-only" style={{ display: 'none', marginBottom: '12pt' }}>
        <div style={{ fontSize: '14pt', fontWeight: 600 }}>Flinch VGC Team List — Staff Copy</div>
        <div style={{ fontSize: '9pt', color: '#555' }}>Regulation M-B · Pokémon Champions · CONFIDENTIAL — Do not share stats with opponents</div>
      </div>

      {/* Player identity */}
      <div style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '13px' }}>
          {[
            ['First name', player.firstName],
            ['Surname', player.lastName],
            ['Player ID', player.playerId],
            ['Year of birth', player.birthYear],
          ].map(([label, value]) => (
            <div key={label}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>{label}</span>
              <span style={{ fontWeight: label === 'Player ID' ? 600 : 400 }}>{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slots.map((slot, i) => {
          if (!slot.speciesId) return null
          const species = POKEMON_MAP.get(slot.speciesId)
          const itemData = ITEM_MAP.get(slot.item.toLowerCase().replace(/ /g, '-'))
          const isMega = itemData?.isMegaStone
          const displayTypes = isMega
            ? (slot.megaForm === 'Y' && species?.megaTypesAlt ? species.megaTypesAlt : species?.megaTypes ?? species?.types ?? [])
            : (species?.types ?? [])
          const megaAbility = slot.megaForm === 'Y' && species?.megaAbilityAlt ? species.megaAbilityAlt : species?.megaAbility
          const spriteKey = isMega
            ? (slot.megaForm === 'Y' && species?.megaSpriteKeyAlt ? species.megaSpriteKeyAlt : species?.megaSpriteKey ?? species?.spriteKey ?? '')
            : (species?.spriteKey ?? '')

          const stats: Array<[string, number, string]> = [
            ['HP', slot.statHp, '#639922'],
            ['Atk', slot.statAtk, '#185FA5'],
            ['Def', slot.statDef, '#185FA5'],
            ['SpA', slot.statSpA, '#993556'],
            ['SpD', slot.statSpD, '#185FA5'],
            ['Spe', slot.statSpe, '#993556'],
          ]

          return (
            <div key={i} className="print-slot" style={{ background: 'var(--surface-raised)', border: `0.5px solid ${isMega ? '#FAC775' : 'var(--border-color)'}`, borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 180px', gap: '16px', alignItems: 'start' }}>

                {/* Sprite — hidden on print */}
                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{i + 1}</span>
                  <img src={getSpriteUrl(spriteKey)} alt={species?.name ?? ''} onError={e => { (e.target as HTMLImageElement).src = getSpriteUrl(spriteKey, false) }} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                  {isMega && <span style={{ fontSize: '9px', fontWeight: 600, background: '#FAEEDA', color: '#633806', border: '0.5px solid #FAC775', borderRadius: '3px', padding: '1px 4px' }}>MEGA</span>}
                </div>

                {/* Slot number — print only */}
                <div className="print-only" style={{ display: 'none', position: 'absolute', fontSize: '9pt', color: '#555' }}>{i + 1}.</div>

                {/* Species + moves */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                    {i + 1}. {isMega && slot.megaForm ? `Mega ${species?.name}${species?.megaStoneAlt ? ` ${slot.megaForm}` : ''}` : species?.name}
                    {slot.nickname && <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px' }}>"{slot.nickname}"</span>}
                    {isMega && <span className="no-print" style={{ marginLeft: '6px', fontSize: '9px', fontWeight: 600, background: '#FAEEDA', color: '#633806', border: '0.5px solid #FAC775', borderRadius: '3px', padding: '1px 5px' }}>MEGA</span>}
                  </div>
                  <div className="no-print" style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {displayTypes.map(t => t && <TypeBadge key={t} type={t} />)}
                  </div>
                  {/* Print: types as plain text */}
                  <div className="print-only" style={{ display: 'none', fontSize: '9pt', marginBottom: '4pt', color: '#444' }}>
                    {displayTypes.filter(Boolean).join(' / ')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}><b>Ability:</b> {slot.ability}</div>
                  {isMega && megaAbility && <div style={{ fontSize: '11px', marginBottom: '2px' }}><b>Mega ability:</b> {megaAbility}</div>}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}><b>Item:</b> {slot.item}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {slot.moves.filter(Boolean).map((move, mi) => {
                      const mtype = moveTypeMap.get(move)
                      return (
                        <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--border-strong)' }}>•</span>
                          <span style={{ color: 'var(--text)' }}>{move}</span>
                          <span className="no-print">{mtype && <TypeBadge type={mtype} />}</span>
                          <span className="print-only" style={{ display: 'none', fontSize: '8pt', color: '#666' }}>[{mtype}]</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Stat alignment */}
                <div>
                  {slot.statAlignment && (
                    <>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Stat alignment</div>
                      <div style={{ fontSize: '12px', color: 'var(--text)' }}>{slot.statAlignment}</div>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>Stats</div>

                  {/* Screen: bars + numbers */}
                  <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4px 6px', alignItems: 'center' }}>
                    {stats.map(([label, val, color]) => (
                      <>
                        <span key={`l-${label}`} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                        <div key={`b-${label}`} style={{ height: '5px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (val / STAT_MAX) * 100)}%`, background: color, borderRadius: '3px' }} />
                        </div>
                        <span key={`v-${label}`} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', textAlign: 'right' }}>{val || '—'}</span>
                      </>
                    ))}
                  </div>

                  {/* Print: compact stat table */}
                  <table className="print-only" style={{ display: 'none', borderCollapse: 'collapse', fontSize: '9pt', width: '100%' }}>
                    <thead>
                      <tr>
                        {stats.map(([label]) => <th key={label} style={{ borderBottom: '0.5pt solid #ccc', paddingRight: '8pt', textAlign: 'left', fontWeight: 600, color: '#333' }}>{label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {stats.map(([label, val]) => <td key={label} style={{ paddingRight: '8pt', color: '#000' }}>{val || '—'}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Staff copy — all fields including stats. · Regulation M-B · Do not share stats with opponents.
      </div>
    </div>
  )
}
