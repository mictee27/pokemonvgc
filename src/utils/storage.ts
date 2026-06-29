import type { TeamSubmission, EventConfig } from '../types'
import { emptySlot, emptyPlayer } from '../types'

const DRAFT_KEY = 'vgc_draft'
const EVENT_KEY = 'vgc_event'
const SUBMISSIONS_KEY = 'vgc_submissions'

export function saveDraft(submission: TeamSubmission): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(submission))
}

export function loadDraft(): TeamSubmission | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}

export function defaultSubmission(): TeamSubmission {
  return {
    id: crypto.randomUUID(),
    eventId: 'default',
    player: emptyPlayer(),
    slots: [emptySlot(), emptySlot(), emptySlot(), emptySlot(), emptySlot(), emptySlot()],
    submittedAt: null,
    locked: false,
    flagged: false,
    flagNote: '',
    eventTag: '',
  }
}

export function saveEvent(event: EventConfig): void {
  localStorage.setItem(EVENT_KEY, JSON.stringify(event))
}

export function loadEvent(): EventConfig {
  try {
    const raw = localStorage.getItem(EVENT_KEY)
    return raw ? JSON.parse(raw) : defaultEvent()
  } catch {
    return defaultEvent()
  }
}

export function defaultEvent(): EventConfig {
  return {
    id: 'default',
    name: '2026 VGC Tournament',
    date: '2026-07-01',
    regulationSet: 'M-B',
    allowSelfEdit: true,
  }
}

export function loadSubmissions(): TeamSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSubmissions(subs: TeamSubmission[]): void {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs))
}

export function submitTeam(submission: TeamSubmission): TeamSubmission {
  const submitted = { ...submission, submittedAt: new Date().toISOString(), locked: true }
  const subs = loadSubmissions()
  const idx = subs.findIndex(s => s.id === submission.id)
  if (idx >= 0) subs[idx] = submitted
  else subs.push(submitted)
  saveSubmissions(subs)
  clearDraft()
  return submitted
}
