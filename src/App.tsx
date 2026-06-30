import { useState } from 'react'
import { SubmissionForm } from './views/SubmissionForm'
import { OrganizerDashboard } from './views/OrganizerDashboard'
import { MetaDashboard } from './views/MetaDashboard'
import { PasswordGate } from './components/PasswordGate'
import { loadDraft, defaultSubmission } from './utils/storage'
import type { TeamSubmission } from './types'

function isOrgUnlocked() {
  return sessionStorage.getItem('organiser_auth') === '1'
}

function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: '#fff',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
        flinch
      </div>
      <div style={{ fontSize: '15px', color: '#888' }}>
        Something's coming. Stay tuned.
      </div>
    </div>
  )
}

export default function App() {
  const isLanding = !window.location.pathname.startsWith('/pokemonvgc')
  const [view, setView] = useState<'player' | 'meta' | 'organizer'>('player')
  const [submission, setSubmission] = useState<TeamSubmission>(() => loadDraft() ?? defaultSubmission())
  const [orgUnlocked, setOrgUnlocked] = useState(isOrgUnlocked)

  if (isLanding) return <LandingPage />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav — always dark */}
      <nav style={{
        background: '#1E293B',
        borderBottom: '1px solid #0F172A',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '28px', padding: '10px 0' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
            Flinch VGC
          </span>
        </div>

        {/* Tabs */}
        {([
          ['player', 'My team list'],
          ['meta', 'Meta'],
          ['organizer', 'Organiser'],
        ] as const).map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0 4px',
            height: '49px',
            fontSize: '13px',
            fontWeight: view === v ? 600 : 400,
            border: 'none',
            borderBottom: view === v ? '2px solid #FFDE00' : '2px solid transparent',
            background: 'transparent',
            color: view === v ? '#FFDE00' : '#94A3B8',
            cursor: 'pointer',
            marginRight: '4px',
            letterSpacing: '0.01em',
            transition: 'color 0.15s',
          }}>
            {label}
          </button>
        ))}

        <div className="nav-reg-label">
          Regulation M-B · Pokémon Champions
        </div>
      </nav>

      {view === 'player' ? (
        <SubmissionForm
          submission={submission}
          onUpdate={setSubmission}
        />
      ) : view === 'meta' ? (
        <MetaDashboard />
      ) : orgUnlocked ? (
        <OrganizerDashboard />
      ) : (
        <PasswordGate onUnlock={() => setOrgUnlocked(true)} />
      )}
    </div>
  )
}
