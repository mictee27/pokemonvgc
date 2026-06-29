import { useState, useEffect } from 'react'
import type { TeamSubmission } from '../types'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'
import { loadEvent, saveEvent, defaultEvent } from '../utils/storage'
import { apiFetchSubmissions, apiToggleFlag, apiUpdateEventTag } from '../lib/api'

interface Props {
  onUnlock?: () => void
}

type StatusFilter = 'All' | 'Submitted' | 'Draft' | 'Flagged' | 'Not started'

export function OrganizerDashboard({ onUnlock: _onUnlock }: Props) {
  const [event, setEvent] = useState(loadEvent())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [tab, setTab] = useState<'submissions' | 'usage' | 'event'>('submissions')
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
        {(['submissions', 'usage', 'event'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', fontSize: '13px', fontWeight: tab === t ? 600 : 400,
            border: 'none', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            background: 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.01em',
          }}>
            {t === 'submissions' ? 'Submissions' : t === 'usage' ? 'Usage stats' : 'Event settings'}
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
