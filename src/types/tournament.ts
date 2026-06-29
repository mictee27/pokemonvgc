export interface TomPlayer {
  userId: string
  firstName: string
  lastName: string
  birthdate?: string
  seed?: number
  order?: number
}

export interface TomMatch {
  round: number
  roundType: 'swiss' | 'topcut'
  player1Id: string | null
  player2Id: string | null
  byePlayerId: string | null
  outcome: 'p1win' | 'p2win' | 'pending' | 'bye'
  tableNumber?: number
}

export interface TomStanding {
  userId: string
  place: number
  category: number // 0=junior, 1=senior, 2=master
}

export interface TournamentRecord {
  id: string
  name: string
  date: string
  city: string
  country: string
  players: TomPlayer[]
  matches: TomMatch[]
  standings: TomStanding[]
  eventTag: string  // links to TeamSubmission.eventTag
  importedAt: string
}

export const CATEGORY_LABELS: Record<number, string> = {
  2: 'Masters',
  1: 'Seniors',
  0: 'Juniors',
}
