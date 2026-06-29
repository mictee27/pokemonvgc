import type { TournamentRecord, TomPlayer, TomMatch, TomStanding } from '../types/tournament'

export function parseTdf(xmlString: string): TournamentRecord {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('Invalid TDF file: ' + parseError.textContent)

  const txt = (sel: string) => doc.querySelector(sel)?.textContent?.trim() ?? ''

  const id = txt('data > id')
  const name = txt('data > name')
  const city = txt('data > city')
  const country = txt('data > country')
  const date = txt('data > startdate')

  // Players
  const players: TomPlayer[] = []
  for (const el of doc.querySelectorAll('players > player')) {
    const userId = el.getAttribute('userid') ?? ''
    const seedEl = el.querySelector('seed')
    const orderEl = el.querySelector('order')
    players.push({
      userId,
      firstName: el.querySelector('firstname')?.textContent?.trim() ?? '',
      lastName: el.querySelector('lastname')?.textContent?.trim() ?? '',
      birthdate: el.querySelector('birthdate')?.textContent?.trim(),
      seed: seedEl ? parseInt(seedEl.textContent ?? '0') : undefined,
      order: orderEl ? parseInt(orderEl.textContent ?? '0') : undefined,
    })
  }

  // All matches from all rounds (use latest snapshot — each file is cumulative)
  const matches: TomMatch[] = []
  const seenRoundMatchKeys = new Set<string>()

  for (const roundEl of doc.querySelectorAll('round')) {
    const roundNum = parseInt(roundEl.getAttribute('number') ?? '0')
    const roundType = roundEl.getAttribute('type') === '1' ? 'topcut' : 'swiss'

    for (const matchEl of roundEl.querySelectorAll('match')) {
      const outcome = parseInt(matchEl.getAttribute('outcome') ?? '0')
      const singlePlayer = matchEl.querySelector(':scope > player')
      const p1El = matchEl.querySelector('player1')
      const p2El = matchEl.querySelector('player2')

      let match: TomMatch

      if (singlePlayer && !p1El) {
        // Bye
        const byeId = singlePlayer.getAttribute('userid') ?? ''
        const key = `${roundNum}-bye-${byeId}`
        if (seenRoundMatchKeys.has(key)) continue
        seenRoundMatchKeys.add(key)
        match = { round: roundNum, roundType, player1Id: null, player2Id: null, byePlayerId: byeId, outcome: 'bye' }
      } else {
        const p1Id = p1El?.getAttribute('userid') ?? null
        const p2Id = p2El?.getAttribute('userid') ?? null
        const key = `${roundNum}-${p1Id}-${p2Id}`
        if (seenRoundMatchKeys.has(key)) continue
        seenRoundMatchKeys.add(key)
        const outcomeVal: TomMatch['outcome'] = outcome === 1 ? 'p1win' : outcome === 2 ? 'p2win' : 'pending'
        const tableEl = matchEl.querySelector('tablenumber')
        const tableNumber = tableEl ? parseInt(tableEl.textContent ?? '0') : undefined
        match = { round: roundNum, roundType, player1Id: p1Id, player2Id: p2Id, byePlayerId: null, outcome: outcomeVal, tableNumber }
      }

      matches.push(match)
    }
  }

  // Standings (only present in FINAL file)
  const standings: TomStanding[] = []
  for (const pod of doc.querySelectorAll('standings > pod[type="finished"]')) {
    const category = parseInt(pod.getAttribute('category') ?? '0')
    for (const el of pod.querySelectorAll('player')) {
      standings.push({
        userId: el.getAttribute('id') ?? '',
        place: parseInt(el.getAttribute('place') ?? '0'),
        category,
      })
    }
  }

  return {
    id,
    name,
    date,
    city,
    country,
    players,
    matches,
    standings,
    eventTag: '',
    importedAt: new Date().toISOString(),
  }
}

/** Compute W / L / bye record for each player across swiss rounds only */
export function computeSwissRecords(tournament: TournamentRecord): Map<string, { w: number; l: number; bye: number }> {
  const records = new Map<string, { w: number; l: number; bye: number }>()
  const init = (id: string) => { if (!records.has(id)) records.set(id, { w: 0, l: 0, bye: 0 }) }

  for (const m of tournament.matches) {
    if (m.roundType !== 'swiss') continue
    if (m.outcome === 'bye' && m.byePlayerId) {
      init(m.byePlayerId); records.get(m.byePlayerId)!.bye++
    } else if (m.player1Id && m.player2Id && m.outcome !== 'pending') {
      init(m.player1Id); init(m.player2Id)
      if (m.outcome === 'p1win') { records.get(m.player1Id)!.w++; records.get(m.player2Id)!.l++ }
      else { records.get(m.player2Id)!.w++; records.get(m.player1Id)!.l++ }
    }
  }
  return records
}
