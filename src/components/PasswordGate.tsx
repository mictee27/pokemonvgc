import { useState } from 'react'

interface Props {
  onUnlock: () => void
}

export function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const attempt = () => {
    const correct = import.meta.env.VITE_ORGANISER_PASSWORD
    if (value === correct) {
      sessionStorage.setItem('organiser_auth', '1')
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 49px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '2rem',
        width: '100%',
        maxWidth: '360px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          Organiser access
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Enter the organiser password to continue.
        </div>
        <input
          type="password"
          value={value}
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          onChange={e => { setValue(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{
            width: '100%', padding: '10px 13px', fontSize: '14px',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
            borderRadius: '10px', background: 'var(--bg)',
            color: 'var(--text)', boxSizing: 'border-box',
            marginBottom: '8px', outline: 'none',
          }}
        />
        {error && (
          <div style={{ fontSize: '12px', color: 'var(--error-text)', marginBottom: '10px', fontWeight: 500 }}>
            Incorrect password. Please try again.
          </div>
        )}
        <button
          onClick={attempt}
          style={{
            width: '100%', padding: '11px', fontSize: '14px', fontWeight: 600,
            background: 'var(--accent)', color: 'white', border: 'none',
            borderRadius: '10px', cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: '0 2px 8px rgba(59,76,202,0.35)',
            transition: 'background 0.15s',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
