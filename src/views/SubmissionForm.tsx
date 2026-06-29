import { useState, useEffect, useCallback } from 'react'
import type { TeamSubmission } from '../types'
import { emptySlot } from '../types'
import { PokemonSlotCard } from '../components/PokemonSlotCard'
import { DetailPanel } from '../components/DetailPanel'
import { PlayerIdentity } from '../components/PlayerIdentity'
import { ValidationBar } from '../components/ValidationBar'
import { validateTeam, errorsForSlot, globalErrors } from '../utils/validation'
import { saveDraft, clearDraft, loadEvent } from '../utils/storage'
import { apiSubmitTeam } from '../lib/api'
import { OpponentView } from './OpponentView'
import { StaffView } from './StaffView'

interface Props {
  submission: TeamSubmission
  onUpdate: (s: TeamSubmission) => void
}

export function SubmissionForm({ submission, onUpdate }: Props) {
  const [activeSlot, setActiveSlot] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [submitted, setSubmitted] = useState(submission.locked)
  const [preview, setPreview] = useState<'none' | 'opponent' | 'staff'>('none')
  const event = loadEvent()

  const errors = validateTeam(submission.slots, submission.player)

  const update = useCallback((patch: Partial<TeamSubmission>) => {
    const updated = { ...submission, ...patch }
    onUpdate(updated)
    if (!updated.locked) {
      saveDraft(updated)
      setLastSaved(new Date())
    }
  }, [submission, onUpdate])

  // Auto-save every 30s
  useEffect(() => {
    if (submission.locked) return
    const interval = setInterval(() => {
      saveDraft(submission)
      setLastSaved(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [submission])

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (errors.length > 0 || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await apiSubmitTeam(submission)
      clearDraft()
      onUpdate(result)
      setSubmitted(true)
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (preview === 'opponent') return <OpponentView submission={submission} onBack={() => setPreview('none')} />
  if (preview === 'staff') return <StaffView submission={submission} onBack={() => setPreview('none')} />

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Regulation banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #2D3A52 100%)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Pokéball watermark */}
        <div style={{
          position: 'absolute', right: '-30px', top: '-30px',
          width: '140px', height: '140px', borderRadius: '50%',
          border: '28px solid rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '30px', top: '-50px',
          width: '140px', height: '140px', borderRadius: '50%',
          border: '28px solid rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }} />

        <div>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#FFDE00', marginBottom: '4px',
          }}>
            Regulation M-B · Pokémon Champions
          </div>
          <div style={{
            fontSize: '22px', fontWeight: 700, color: '#FFFFFF',
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            17 June – 2 September 2026
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            {event.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'rgba(255,222,0,0.15)', color: '#FFDE00',
            border: '1px solid rgba(255,222,0,0.3)',
            borderRadius: '6px', padding: '4px 10px',
          }}>
            Open team list
          </span>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Mega Evolutions permitted
          </span>
        </div>
      </div>

      {/* Sub-header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
          Team List
        </h1>
        <div className="header-actions">
          {lastSaved && !submitted && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {submitted && (
            <span style={{ fontSize: '11px', background: '#EAF3DE', color: '#27500A', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>
              ✓ Submitted
            </span>
          )}
          <button onClick={() => setPreview('opponent')} style={btnStyle()}>Opponent view</button>
          <button onClick={() => setPreview('staff')} style={btnStyle()}>Staff view</button>
        </div>
      </div>
      {/* end sub-header */}

      {/* Player identity */}
      <PlayerIdentity
        player={submission.player}
        onChange={p => update({ player: p })}
        errors={globalErrors(errors)}
      />

      {/* Team row */}
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Team — {submission.slots.filter(s => s.speciesId).length} of 6 Pokémon
      </div>
      <div className="team-row" style={{ marginBottom: '1rem' }}>
        {submission.slots.map((slot, i) => (
          <PokemonSlotCard
            key={i}
            slot={slot}
            index={i}
            active={activeSlot === i}
            onClick={() => setActiveSlot(i)}
            errors={errorsForSlot(errors, i)}
          />
        ))}
      </div>

      {/* Detail panel */}
      <DetailPanel
        slot={submission.slots[activeSlot]}
        onChange={slot => {
          const slots = [...submission.slots] as typeof submission.slots
          slots[activeSlot] = slot
          update({ slots })
        }}
        errors={errorsForSlot(errors, activeSlot)}
        isStaff={true}
      />

      {/* Validation + submit */}
      <div style={{ marginTop: '1rem' }}>
        <ValidationBar errors={errors} />
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleSubmit}
                disabled={errors.length > 0 || submitting}
                style={{
                  background: errors.length === 0 && !submitting ? 'var(--accent)' : 'var(--surface)',
                  color: errors.length === 0 && !submitting ? 'white' : 'var(--text-muted)',
                  border: `1px solid ${errors.length === 0 && !submitting ? 'var(--accent)' : 'var(--border-color)'}`,
                  borderRadius: '10px', padding: '11px 28px', fontSize: '14px',
                  fontWeight: 600, cursor: errors.length === 0 && !submitting ? 'pointer' : 'not-allowed',
                  width: 'max-content', letterSpacing: '-0.01em',
                  boxShadow: errors.length === 0 && !submitting ? '0 2px 8px rgba(59,76,202,0.3)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              >
                {submitting ? 'Submitting…' : 'Submit team list'}
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Your submitted list becomes the legal record of your team.
              </span>
            </div>
            {submitError && (
              <div style={{ fontSize: '12px', color: '#A32D2D', padding: '8px 12px', background: '#FCEBEB', border: '0.5px solid #F7C1C1', borderRadius: '6px' }}>
                {submitError}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '12px 16px', background: '#EAF3DE', border: '0.5px solid #C0DD97', borderRadius: '8px', fontSize: '13px', color: '#27500A' }}>
            ✓ Team list submitted at {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '—'}. Your list is now locked. Contact the tournament organiser if you need to make changes.
          </div>
        )}
      </div>
    </div>
  )
}

function btnStyle(): React.CSSProperties {
  return {
    padding: '7px 14px', fontSize: '12px', fontWeight: 500,
    border: '1px solid var(--border-color)', borderRadius: '8px',
    background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  }
}
