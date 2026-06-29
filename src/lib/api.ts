import { supabase } from './supabase'
import type { TeamSubmission } from '../types'
import { submitTeam as localSubmit, loadSubmissions, saveSubmissions } from '../utils/storage'

interface SubmissionRow {
  id: string
  event_id: string
  first_name: string
  last_name: string
  player_id: string
  birth_year: string
  slots: TeamSubmission['slots']
  submitted_at: string
  flagged: boolean
  flag_note: string
  event_tag: string
}

function toRow(s: TeamSubmission): SubmissionRow {
  return {
    id: s.id,
    event_id: s.eventId,
    first_name: s.player.firstName,
    last_name: s.player.lastName,
    player_id: s.player.playerId,
    birth_year: s.player.birthYear,
    slots: s.slots,
    submitted_at: s.submittedAt ?? new Date().toISOString(),
    flagged: s.flagged,
    flag_note: s.flagNote,
    event_tag: s.eventTag,
  }
}

function fromRow(row: SubmissionRow): TeamSubmission {
  return {
    id: row.id,
    eventId: row.event_id,
    player: {
      firstName: row.first_name,
      lastName: row.last_name,
      playerId: row.player_id,
      birthYear: row.birth_year,
    },
    slots: row.slots,
    submittedAt: row.submitted_at,
    locked: true,
    flagged: row.flagged,
    flagNote: row.flag_note,
    eventTag: row.event_tag ?? '',
  }
}

export async function apiSubmitTeam(submission: TeamSubmission): Promise<TeamSubmission> {
  const submitted: TeamSubmission = { ...submission, submittedAt: new Date().toISOString(), locked: true }

  if (!supabase) {
    return localSubmit(submission)
  }

  const { error } = await supabase.from('submissions').upsert(toRow(submitted))
  if (error) throw new Error(error.message)
  return submitted
}

export async function apiFetchSubmissions(): Promise<TeamSubmission[]> {
  if (!supabase) {
    return loadSubmissions()
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as SubmissionRow[]).map(fromRow)
}

export async function apiToggleFlag(id: string, flagged: boolean, note = ''): Promise<void> {
  if (!supabase) {
    const subs = loadSubmissions()
    saveSubmissions(subs.map(s => s.id === id ? { ...s, flagged, flagNote: note } : s))
    return
  }

  const { error } = await supabase
    .from('submissions')
    .update({ flagged, flag_note: note })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function apiUpdateEventTag(id: string, eventTag: string): Promise<void> {
  if (!supabase) {
    const subs = loadSubmissions()
    saveSubmissions(subs.map(s => s.id === id ? { ...s, eventTag } : s))
    return
  }

  const { error } = await supabase
    .from('submissions')
    .update({ event_tag: eventTag })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
