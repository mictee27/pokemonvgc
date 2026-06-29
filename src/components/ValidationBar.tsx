import type { ValidationError } from '../types'

interface Props {
  errors: ValidationError[]
}

export function ValidationBar({ errors }: Props) {
  const isValid = errors.length === 0

  return (
    <div style={{
      background: isValid ? 'var(--success-muted)' : 'var(--error-muted)',
      border: `1px solid ${isValid ? 'var(--success-border)' : 'var(--error-border)'}`,
      borderRadius: '10px', padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: '10px',
      marginBottom: '1rem', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
        background: isValid ? 'var(--success)' : 'var(--error)',
        boxShadow: isValid ? '0 0 0 3px rgba(99,153,34,0.2)' : '0 0 0 3px rgba(220,38,38,0.15)',
      }} />
      <div style={{ fontSize: '12px', color: isValid ? 'var(--success-text)' : 'var(--error-text)', fontWeight: 500 }}>
        {isValid
          ? 'All 6 Pokémon valid — no duplicate species, items, or nicknames · Mega Stones matched · All moves legal in Regulation M-B'
          : `${errors.length} issue${errors.length > 1 ? 's' : ''} to fix before submitting: ${errors.slice(0, 2).map(e => e.message).join('; ')}${errors.length > 2 ? ` (+${errors.length - 2} more)` : ''}`
        }
      </div>
    </div>
  )
}
