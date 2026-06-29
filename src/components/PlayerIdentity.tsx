import type { PlayerInfo, ValidationError } from '../types'

interface Props {
  player: PlayerInfo
  onChange: (p: PlayerInfo) => void
  errors: ValidationError[]
}

export function PlayerIdentity({ player, onChange, errors }: Props) {
  const update = (patch: Partial<PlayerInfo>) => onChange({ ...player, ...patch })
  const errFor = (field: string) => errors.find(e => e.field === field)

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '7px 10px', fontSize: '13px',
    border: `0.5px solid ${errFor(field) ? '#E24B4A' : 'var(--border-color)'}`,
    borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box',
  })

  const field = (label: string, key: keyof PlayerInfo, type = 'text', hint?: string) => (
    <div key={key}>
      <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
        {label}
      </label>
      <input
        type={type}
        value={player[key] as string}
        onChange={e => update({ [key]: e.target.value })}
        placeholder={hint}
        style={inputStyle(key)}
      />
      {errFor(key) && <div style={{ fontSize: '11px', color: '#E24B4A', marginTop: '2px' }}>{errFor(key)!.message}</div>}
    </div>
  )

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Player information
      </div>
      <div className="player-grid">
        {field('First name', 'firstName', 'text', 'First name')}
        {field('Surname', 'lastName', 'text', 'Last name')}
        {field('Player ID', 'playerId', 'text', 'Play! Pokémon ID')}
        {field('Year of birth', 'birthYear', 'number', 'e.g. 2010')}
      </div>
    </div>
  )
}
