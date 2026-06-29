import { useState, useEffect, useRef } from 'react'
import type { TeamSubmission } from '../types'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'
import { loadEvent, saveEvent, defaultEvent } from '../utils/storage'
import { apiFetchSubmissions, apiToggleFlag, apiUpdateEventTag } from '../lib/api'
import { parseTdf } from '../utils/parseTdf'
import { loadTournaments, saveTournament, deleteTournament } from '../utils/tournamentStorage'
import type { TournamentRecord } from '../types/tournament'

interface Props {
  onUnlock?: () => void
}

type StatusFilter = 'All' | 'Submitted' | 'Draft' | 'Flagged' | 'Not started'

export function OrganizerDashboard({ onUnlock: _onUnlock }: Props) {
  const [event, setEvent] = useState(loadEvent())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [tab, setTab] = useState<'submissions' | 'usage' | 'tournaments' | 'event'>('submissions')
  const [submissions, setSubmissions] = useState<TeamSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [eventTagFilter, setEventTagFilter] = useState<string>('All')

  useEffect(() => {
    apiFetchSubmissions()
      .then(setSubmissions)
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const saveEvent_ = (e: typeof event) => { setEvent(e); saveEvent(e) }

  const handleToggleFlag = async (sub: TeamSubmission) => {
    const next = !sub.flagged
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, flagged: next } : s))
    try {
      await apiToggleFlag(sub.id, next)
    } catch {
      setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, flagged: sub.flagged } : s))
    }
  }

  const handleUpdateEventTag = async (id: string, tag: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, eventTag: tag } : s))
    try {
      await apiUpdateEventTag(id, tag)
    } catch {
      // revert silently — UI will show stale state until refresh
    }
  }

  // All unique event tags across submissions (excluding empty)
  const allEventTags = Array.from(new Set(submissions.map(s => s.eventTag).filter(Boolean))).sort()

  const filteredSubs = submissions.filter(s => {
    const status = getStatus(s)
    return (statusFilter === 'All' || status === statusFilter)
  })

  const usageSubs = eventTagFilter === 'All'
    ? submissions
    : submissions.filter(s => s.eventTag === eventTagFilter)

  const usageMap = computeUsage(usageSubs)
  const topPokemon = Array.from(usageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>Organiser dashboard</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.01em' }}>{event.name} · Regulation M-B</div>
        </div>
        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['Submitted', 'Draft', 'Not started', 'Flagged'] as const).map(s => (
            <div key={s} style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 14px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)' }}>{submissions.filter(sub => getStatus(sub) === s).length}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem', borderBottom: '0.5px solid var(--border-color)', paddingBottom: '0' }}>
        {(['submissions', 'usage', 'tournaments', 'event'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', fontSize: '13px', fontWeight: tab === t ? 600 : 400,
            border: 'none', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            background: 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.01em',
          }}>
            {t === 'submissions' ? 'Submissions' : t === 'usage' ? 'Usage stats' : t === 'tournaments' ? 'TOM Data' : 'Event settings'}
          </button>
        ))}
      </div>

      {tab === 'submissions' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {(['All', 'Submitted', 'Draft', 'Flagged', 'Not started'] as StatusFilter[]).map(s => (
              <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '14px' }}>
              Loading submissions…
            </div>
          ) : fetchError ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#A32D2D', fontSize: '14px' }}>
              Failed to load: {fetchError}
            </div>
          ) : filteredSubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '14px' }}>
              No submissions yet. Share the team list link with your players.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredSubs.map(sub => (
                <SubmissionRow
                  key={sub.id}
                  sub={sub}
                  allEventTags={allEventTags}
                  onToggleFlag={() => handleToggleFlag(sub)}
                  onUpdateEventTag={tag => handleUpdateEventTag(sub.id, tag)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'usage' && (
        <>
          {/* Event tag filter */}
          {allEventTags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {(['All', ...allEventTags]).map(tag => (
                <FilterBtn key={tag} label={tag} active={eventTagFilter === tag} onClick={() => setEventTagFilter(tag)} />
              ))}
            </div>
          )}
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Most used Pokémon — {usageSubs.filter(s => s.submittedAt).length} team{usageSubs.filter(s => s.submittedAt).length !== 1 ? 's' : ''}
            {eventTagFilter !== 'All' && <span style={{ color: 'var(--accent)', marginLeft: '6px' }}>· {eventTagFilter}</span>}
          </div>
          {topPokemon.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No submitted teams yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {topPokemon.map(([speciesId, count]) => {
                const species = POKEMON_MAP.get(speciesId)
                if (!species) return null
                const pct = Math.round((count / usageSubs.filter(s => s.submittedAt).length) * 100)
                return (
                  <div key={speciesId} style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
                    <img src={getSpriteUrl(species.spriteKey)} alt={species.name} onError={e => { (e.target as HTMLImageElement).src = getSpriteUrl(species.spriteKey, false) }} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', marginTop: '4px', lineHeight: 1.3 }}>{species.name}</div>
                    <div style={{ fontSize: '18px', fontWeight: 500, color: '#639922', marginTop: '2px' }}>{pct}%</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{count} teams</div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'tournaments' && (
        <TomUploadTab />
      )}

      {tab === 'event' && (
        <div style={{ background: 'var(--surface-raised)', border: '0.5px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Event name', 'name', 'text'],
              ['Date', 'date', 'date'],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  type={type}
                  value={(event as any)[key]}
                  onChange={e => saveEvent_({ ...event, [key]: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', fontSize: '13px', border: '0.5px solid var(--border-color)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Allow self-edit before deadline</label>
              <button
                onClick={() => saveEvent_({ ...event, allowSelfEdit: !event.allowSelfEdit })}
                style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, border: `0.5px solid ${event.allowSelfEdit ? '#639922' : 'var(--border-color)'}`, borderRadius: '8px', background: event.allowSelfEdit ? '#EAF3DE' : 'var(--surface)', color: event.allowSelfEdit ? '#27500A' : 'var(--text)', cursor: 'pointer' }}
              >
                {event.allowSelfEdit ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div style={{ paddingTop: '8px', borderTop: '0.5px solid var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
              Regulation set: <strong style={{ color: 'var(--text)' }}>M-B (Pokémon Champions)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TomUploadTab() {
  const [tournaments, setTournaments] = useState<TournamentRecord[]>(loadTournaments)
  const [pending, setPending] = useState<TournamentRecord | null>(null)
  const [eventTagDraft, setEventTagDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null); setSuccess(null); setPending(null)
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = parseTdf(e.target?.result as string)
        setEventTagDraft(parsed.name)
        setPending(parsed)
      } catch (err: any) {
        setError(err.message ?? 'Failed to parse file')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const saveImport = () => {
    if (!pending) return
    const t = { ...pending, eventTag: eventTagDraft.trim() }
    saveTournament(t)
    setTournaments(loadTournaments())
    setSuccess(`"${t.name}" imported successfully.`)
    setPending(null)
  }

  const handleDelete = (id: string) => {
    deleteTournament(id)
    setTournaments(loadTournaments())
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
        Upload the <strong>FINAL .tdf file</strong> from TOM to publish tournament results and link Pokémon usage data to the public Meta dashboard.
      </p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--border-color)', borderRadius: '12px',
          padding: '2rem', textAlign: 'center', cursor: 'pointer',
          background: 'var(--surface)', marginBottom: '12px',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      >
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Drop a .tdf file here</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>or click to browse · upload the _FINAL.tdf file</div>
        <input ref={fileRef} type="file" accept=".tdf,.xml" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: 'var(--error-muted)', color: 'var(--error-text)', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '10px 14px', background: 'var(--success-muted)', color: 'var(--success-text)', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>
          {success}
        </div>
      )}

      {/* Pending preview */}
      {pending && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{pending.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {pending.city}, {pending.country} · {pending.date} · {pending.players.length} players · {pending.standings.length} standings
          </div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Event tag (must match team sheet tags)
          </label>
          <input
            value={eventTagDraft}
            onChange={e => setEventTagDraft(e.target.value)}
            placeholder="e.g. Flinch League Cup May 2025"
            style={{ width: '100%', padding: '7px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={saveImport} style={{
              padding: '7px 18px', fontSize: '13px', fontWeight: 600,
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
            }}>Import tournament</button>
            <button onClick={() => setPending(null)} style={{
              padding: '7px 14px', fontSize: '13px',
              background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Imported list */}
      {tournaments.length > 0 && (
        <>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', marginTop: '8px' }}>
            Imported tournaments
          </div>
          {tournaments.map(t => (
            <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {t.city} · {t.date} · {t.players.length} players
                  {t.eventTag && <span style={{ marginLeft: '8px', color: 'var(--accent)' }}>tag: {t.eventTag}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(t.id)} style={{
                padding: '4px 10px', fontSize: '11px', border: '1px solid var(--border-color)',
                borderRadius: '6px', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              }}>Remove</button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function getStatus(sub: TeamSubmission): string {
  if (sub.flagged) return 'Flagged'
  if (sub.submittedAt) return 'Submitted'
  if (sub.slots.some(s => s.speciesId)) return 'Draft'
  return 'Not started'
}

function computeUsage(submissions: TeamSubmission[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const sub of submissions) {
    if (!sub.submittedAt) continue
    for (const slot of sub.slots) {
      if (slot.speciesId) map.set(slot.speciesId, (map.get(slot.speciesId) ?? 0) + 1)
    }
  }
  return map
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 10px', fontSize: '12px', fontWeight: active ? 500 : 400,
      border: `0.5px solid ${active ? '#639922' : 'var(--border-color)'}`,
      borderRadius: '20px', cursor: 'pointer',
      background: active ? '#EAF3DE' : 'var(--surface-raised)',
      color: active ? '#27500A' : 'var(--text-muted)',
    }}>
      {label}
    </button>
  )
}

function SubmissionRow({ sub, allEventTags, onToggleFlag, onUpdateEventTag }: {
  sub: TeamSubmission
  allEventTags: string[]
  onToggleFlag: () => void
  onUpdateEventTag: (tag: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(sub.eventTag)

  const status = getStatus(sub)
  const statusColors: Record<string, [string, string]> = {
    Submitted: ['var(--success-muted)', 'var(--success-text)'],
    Draft:     ['var(--mega-muted)',    'var(--mega-text)'],
    Flagged:   ['var(--error-muted)',   'var(--error-text)'],
    'Not started': ['var(--surface)',   'var(--text-muted)'],
  }
  const [bg, color] = statusColors[status] ?? statusColors['Not started']

  const commitTag = () => {
    setEditing(false)
    if (draft.trim() !== sub.eventTag) onUpdateEventTag(draft.trim())
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

        {/* Player info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
            {[sub.player.firstName, sub.player.lastName].filter(Boolean).join(' ') || 'Unknown player'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {sub.player.playerId || '—'}</div>
        </div>

        {/* Sprites */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {sub.slots.map((slot, i) => {
            const species = POKEMON_MAP.get(slot.speciesId)
            return species ? (
              <img key={i} src={getSpriteUrl(species.spriteKey, false)} alt={species.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            ) : (
              <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg)', border: '1px dashed var(--border-color)' }} />
            )
          })}
        </div>

        {/* Status */}
        <span style={{ fontSize: '11px', fontWeight: 600, background: bg, color, padding: '3px 9px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
          {status}
        </span>

        {/* Time */}
        {sub.submittedAt && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        {/* Flag */}
        <button onClick={onToggleFlag} style={{
          padding: '4px 10px', fontSize: '11px', fontWeight: 500,
          border: `1px solid ${sub.flagged ? 'var(--error-border)' : 'var(--border-color)'}`,
          borderRadius: '6px',
          background: sub.flagged ? 'var(--error-muted)' : 'var(--surface)',
          color: sub.flagged ? 'var(--error-text)' : 'var(--text-muted)',
          cursor: 'pointer',
        }}>
          {sub.flagged ? 'Unflag' : 'Flag'}
        </button>
      </div>

      {/* Event tag row */}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
          Event
        </span>

        {editing ? (
          <>
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitTag(); if (e.key === 'Escape') { setDraft(sub.eventTag); setEditing(false) } }}
              list="event-tag-suggestions"
              placeholder="e.g. Sydney Regional 2026"
              style={{
                flex: 1, padding: '5px 9px', fontSize: '12px',
                border: '1px solid var(--accent)', borderRadius: '7px',
                background: 'var(--bg)', color: 'var(--text)', outline: 'none',
                boxShadow: '0 0 0 3px rgba(59,76,202,0.12)',
              }}
            />
            <datalist id="event-tag-suggestions">
              {allEventTags.map(t => <option key={t} value={t} />)}
            </datalist>
            <button onClick={commitTag} style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 600,
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '7px', cursor: 'pointer',
            }}>Save</button>
            <button onClick={() => { setDraft(sub.eventTag); setEditing(false) }} style={{
              padding: '5px 10px', fontSize: '12px',
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border-color)', borderRadius: '7px', cursor: 'pointer',
            }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => { setDraft(sub.eventTag); setEditing(true) }} style={{
            padding: '4px 10px', fontSize: '12px', fontWeight: sub.eventTag ? 600 : 400,
            background: sub.eventTag ? 'var(--accent-muted)' : 'var(--bg)',
            color: sub.eventTag ? 'var(--accent-text)' : 'var(--text-subtle)',
            border: `1px solid ${sub.eventTag ? 'var(--accent)' : 'var(--border-color)'}`,
            borderRadius: '7px', cursor: 'pointer',
          }}>
            {sub.eventTag || '+ Assign event'}
          </button>
        )}
      </div>
    </div>
  )
}
