import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
}

export function Autocomplete({ value, onChange, options, placeholder, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : options.slice(0, 8)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <input
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        style={{
          width: '100%', padding: '6px 10px', fontSize: '13px',
          border: '0.5px solid var(--border-color)', borderRadius: '8px',
          background: 'var(--surface)', color: 'var(--text)',
          outline: 'none', boxSizing: 'border-box',
          opacity: disabled ? 0.5 : 1,
        }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)',
          borderRadius: '8px', marginTop: '2px', overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => { onChange(opt); setQuery(opt); setOpen(false) }}
              style={{
                padding: '7px 12px', fontSize: '13px', cursor: 'pointer',
                color: 'var(--text)',
                background: opt === value ? 'var(--accent-muted)' : 'transparent',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = opt === value ? 'var(--accent-muted)' : 'transparent')}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
