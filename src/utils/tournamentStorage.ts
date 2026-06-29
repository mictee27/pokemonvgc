import type { TournamentRecord } from '../types/tournament'

const KEY = 'flinch_tournaments'

export function loadTournaments(): TournamentRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveTournament(t: TournamentRecord): void {
  const all = loadTournaments()
  const idx = all.findIndex(x => x.id === t.id)
  if (idx >= 0) all[idx] = t
  else all.unshift(t)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function deleteTournament(id: string): void {
  const all = loadTournaments().filter(t => t.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
}
