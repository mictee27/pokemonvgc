import { useState, useMemo, useEffect } from 'react'
import { loadTournaments } from '../utils/tournamentStorage'
import { computeSwissRecords } from '../utils/parseTdf'
import { apiFetchSubmissions } from '../lib/api'
import type { TournamentRecord } from '../types/tournament'
import type { TeamSubmission } from '../types'
import { CATEGORY_LABELS } from '../types/tournament'
import type { TomPlayer } from '../types/tournament'
import { POKEMON_MAP, getSpriteUrl } from '../data/pokemon'

function formatDate(d: string) {
  // d is MM/DD/YYYY from TOM
  const parts = d.split('/')
  if (parts.length !== 3) return d
  const date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`)
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function placeSuffix(n: number) {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

interface PokemonUsageStat {
  speciesId: string
  name: string
  spriteKey: string
  count: number
  wins: number
  losses: number
}

function PlayerModal({ player, tournament, onClose }: {
  player: TomPlayer
  tournament: TournamentRecord
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const playerMap = useMemo(() => new Map(tournament.players.map(p => [p.userId, p])), [tournament])
  const records = useMemo(() => computeSwissRecords(tournament), [tournament])
  const rec = records.get(player.userId)

  const standing = tournament.standings.find(s => s.userId === player.userId)

  // All matches involving this player, sorted by round
  const playerMatches = useMemo(() => {
    return tournament.matches
      .filter(m =>
        m.player1Id === player.userId ||
        m.player2Id === player.userId ||
        m.byePlayerId === player.userId
      )
      .sort((a, b) => a.round - b.round)
  }, [tournament, player])

  // Group: last swiss round number
  const lastSwissRound = Math.max(...tournament.matches.filter(m => m.roundType === 'swiss').map(m => m.round), 0)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '520px',
          maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #2D3A52 100%)',
          padding: '1.25rem 1.5rem', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
              {player.firstName} {player.lastName}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              {standing ? `${placeSuffix(standing.place)} place · ${CATEGORY_LABELS[standing.category] ?? ''}` : ''}
              {rec ? ` · Swiss record: ${rec.w}W – ${rec.l}L${rec.bye > 0 ? ` (${rec.bye} bye)` : ''}` : ''}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: '#94A3B8',
            fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '0 0 0 12px',
          }}>✕</button>
        </div>

        {/* Rounds */}
        <div style={{ overflowY: 'auto', padding: '12px 0' }}>
          {playerMatches.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
              No match data found
            </div>
          ) : playerMatches.map((m, i) => {
            const isBye = m.outcome === 'bye'
            const isP1 = m.player1Id === player.userId
            const won = isBye || (isP1 ? m.outcome === 'p1win' : m.outcome === 'p2win')
            const opponentId = isP1 ? m.player2Id : m.player1Id
            const opponent = opponentId ? playerMap.get(opponentId) : null
            const isTopCut = m.roundType === 'topcut'
            const cutRound = m.round - lastSwissRound
            const roundLabel = isTopCut
              ? (cutRound === 1 ? 'Semi-final' : cutRound === 2 ? 'Final' : `Top cut R${cutRound}`)
              : `Round ${m.round}`

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
              }}>
                {/* Round label */}
                <div style={{ width: '110px', flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: isTopCut ? 600 : 400, color: isTopCut ? 'var(--accent)' : 'var(--text)' }}>
                    {roundLabel}
                  </div>
                  {!isBye && m.tableNumber !== undefined && m.tableNumber > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Table {m.tableNumber}</div>
                  )}
                </div>

                {/* Opponent */}
                <div style={{ flex: 1, fontSize: '13px', color: 'var(--text)' }}>
                  {isBye ? (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Bye</span>
                  ) : opponent ? (
                    `${opponent.firstName} ${opponent.lastName}`
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Unknown</span>
                  )}
                </div>

                {/* Result */}
                <div style={{
                  fontSize: '12px', fontWeight: 600, flexShrink: 0,
                  padding: '3px 10px', borderRadius: '6px',
                  background: isBye ? 'var(--accent-muted)' : won ? 'var(--success-muted)' : 'var(--error-muted)',
                  color: isBye ? 'var(--accent-text)' : won ? 'var(--success-text)' : 'var(--error)',
                }}>
                  {isBye ? 'BYE' : won ? 'WIN' : 'LOSS'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function MetaDashboard() {
  const tournaments = loadTournaments()
  const [selectedId, setSelectedId] = useState<string>(tournaments[0]?.id ?? '')
  const [selectedCategory, setSelectedCategory] = useState<number>(2)
  const [submissions, setSubmissions] = useState<TeamSubmission[]>([])
  const [loadedSubs, setLoadedSubs] = useState(false)
  const [modalPlayer, setModalPlayer] = useState<TomPlayer | null>(null)

  const tournament: TournamentRecord | undefined = tournaments.find(t => t.id === selectedId)

  // Load submissions once
  useMemo(() => {
    if (loadedSubs) return
    setLoadedSubs(true)
    apiFetchSubmissions().then(setSubmissions).catch(() => {})
  }, [loadedSubs])

  const records = useMemo(() =>
    tournament ? computeSwissRecords(tournament) : new Map(),
    [tournament]
  )

  // Categories present in this tournament
  const categories = useMemo(() => {
    if (!tournament) return []
    const cats = [...new Set(tournament.standings.map(s => s.category))].sort((a, b) => b - a)
    return cats
  }, [tournament])

  // Standing players for selected category
  const standingPlayers = useMemo(() => {
    if (!tournament) return []
    return tournament.standings
      .filter(s => s.category === selectedCategory)
      .sort((a, b) => a.place - b.place)
      .map(s => {
        const p = tournament.players.find(pl => pl.userId === s.userId)
        return { ...s, player: p }
      })
  }, [tournament, selectedCategory])

  // Link submissions to tournament players via playerId = userId
  const linkedSubmissions = useMemo(() => {
    if (!tournament) return new Map<string, TeamSubmission>()
    const map = new Map<string, TeamSubmission>()
    for (const sub of submissions) {
      const byId = tournament.players.find(p => p.userId === sub.player.playerId)
      const byName = !byId && tournament.players.find(p =>
        p.firstName.toLowerCase() === sub.player.firstName.toLowerCase() &&
        p.lastName.toLowerCase() === sub.player.lastName.toLowerCase()
      )
      const matched = byId ?? byName
      if (matched) {
        // Prefer event-tagged match if tournament has a tag
        if (!tournament.eventTag || sub.eventTag === tournament.eventTag || !map.has(matched.userId)) {
          map.set(matched.userId, sub)
        }
      }
    }
    return map
  }, [tournament, submissions])

  // Pokémon usage stats (all players in this tournament)
  const usageStats = useMemo((): PokemonUsageStat[] => {
    if (!tournament || linkedSubmissions.size === 0) return []

    const statMap = new Map<string, PokemonUsageStat>()

    // Iterate over matched players
    for (const [userId, sub] of linkedSubmissions) {
      const rec = records.get(userId)
      const playerWon = (opponentId: string) => {
        return tournament.matches.filter(m => m.roundType === 'swiss' && m.outcome !== 'pending' && m.outcome !== 'bye').some(m =>
          (m.player1Id === userId && m.player2Id === opponentId && m.outcome === 'p1win') ||
          (m.player2Id === userId && m.player1Id === opponentId && m.outcome === 'p2win')
        )
      }

      // Count wins and losses from Swiss matches
      const swissWins = rec?.w ?? 0
      const swissLosses = rec?.l ?? 0

      for (const slot of sub.slots) {
        if (!slot.speciesId) continue
        const species = POKEMON_MAP.get(slot.speciesId)
        if (!statMap.has(slot.speciesId)) {
          statMap.set(slot.speciesId, {
            speciesId: slot.speciesId,
            name: species?.name ?? slot.speciesId,
            spriteKey: species?.spriteKey ?? slot.speciesId,
            count: 0, wins: 0, losses: 0,
          })
        }
        const s = statMap.get(slot.speciesId)!
        s.count++
        s.wins += swissWins
        s.losses += swissLosses
      }
    }

    return [...statMap.values()].sort((a, b) => b.count - a.count)
  }, [tournament, linkedSubmissions, records])

  const totalLinked = linkedSubmissions.size
  const totalPlayers = tournament?.players.length ?? 0

  if (tournaments.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>No tournament data yet</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
          Tournament results will appear here once the organiser uploads TOM data from a completed event.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Tournament selector */}
      {tournaments.length > 1 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tournaments.map(t => (
            <button key={t.id} onClick={() => { setSelectedId(t.id); setSelectedCategory(2) }} style={{
              padding: '6px 14px', fontSize: '13px', borderRadius: '20px', cursor: 'pointer', border: 'none',
              background: selectedId === t.id ? 'var(--accent)' : 'var(--surface)',
              color: selectedId === t.id ? '#fff' : 'var(--text)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {t.name}
            </button>
          ))}
        </div>
      )}

      {tournament && (
        <>
          {/* Header card */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #2D3A52 100%)',
            borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFDE00', letterSpacing: '0.08em', marginBottom: '4px' }}>
                TOURNAMENT RESULTS
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {tournament.name}
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                {formatDate(tournament.date)} · {tournament.city}, {tournament.country}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{totalPlayers}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>players</div>
              {totalLinked > 0 && (
                <div style={{ fontSize: '11px', color: '#FFDE00', marginTop: '4px' }}>
                  {totalLinked} team sheets linked
                </div>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                  padding: '6px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: selectedCategory === cat ? 600 : 400,
                  background: selectedCategory === cat ? 'var(--accent)' : 'var(--surface)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {CATEGORY_LABELS[cat] ?? `Category ${cat}`}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: usageStats.length > 0 ? '1fr 1fr' : '1fr', gap: '1rem', alignItems: 'start' }}>
            {/* Standings */}
            <div style={{ background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  FINAL STANDINGS — {CATEGORY_LABELS[selectedCategory] ?? `CAT ${selectedCategory}`}
                </div>
              </div>
              {standingPlayers.length === 0 ? (
                <div style={{ padding: '24px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No standings data
                </div>
              ) : (
                <div>
                  {standingPlayers.map(({ userId, place, player }) => {
                    const rec = records.get(userId)
                    const sub = linkedSubmissions.get(userId)
                    const isTop4 = place <= 4
                    return (
                      <div key={userId} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 16px', borderBottom: '1px solid var(--border-color)',
                        background: place === 1 ? 'rgba(255,222,0,0.06)' : 'transparent',
                      }}>
                        <div style={{
                          width: '32px', textAlign: 'center', flexShrink: 0,
                          fontSize: place <= 3 ? '15px' : '13px',
                          fontWeight: isTop4 ? 700 : 400,
                          color: place === 1 ? '#B7960A' : place === 2 ? '#64748B' : place === 3 ? '#7C4A1E' : 'var(--text-muted)',
                        }}>
                          {place <= 3 ? ['🥇','🥈','🥉'][place-1] : placeSuffix(place)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <button
                            onClick={() => player && setModalPlayer(player)}
                            style={{
                              fontSize: '14px', fontWeight: isTop4 ? 600 : 400,
                              color: 'var(--accent)', background: 'none', border: 'none',
                              padding: 0, cursor: 'pointer', textAlign: 'left',
                              textDecoration: 'underline', textDecorationColor: 'transparent',
                              transition: 'text-decoration-color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.textDecorationColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
                          >
                            {player ? `${player.firstName} ${player.lastName}` : userId}
                          </button>
                          {rec && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {rec.w}W – {rec.l}L{rec.bye > 0 ? ` (${rec.bye} bye)` : ''}
                            </div>
                          )}
                        </div>
                        {/* Team sprite strip if linked */}
                        {sub && (
                          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                            {sub.slots.filter(s => s.speciesId).slice(0, 6).map((slot, i) => {
                              const sp = POKEMON_MAP.get(slot.speciesId!)
                              return sp ? (
                                <img key={i} src={getSpriteUrl(sp.spriteKey)} alt={sp.name}
                                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                                />
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pokémon usage */}
            {usageStats.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    POKÉMON USAGE — {totalLinked} TEAMS
                  </div>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {usageStats.slice(0, 20).map(stat => {
                    const pct = Math.round((stat.count / totalLinked) * 100)
                    const totalGames = stat.wins + stat.losses
                    const winRate = totalGames > 0 ? Math.round((stat.wins / totalGames) * 100) : null
                    return (
                      <div key={stat.speciesId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px' }}>
                        <img src={getSpriteUrl(stat.spriteKey)} alt={stat.name}
                          style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{stat.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>
                              {pct}%
                              {winRate !== null && (
                                <span style={{ marginLeft: '8px', color: winRate >= 50 ? 'var(--success)' : 'var(--error)' }}>
                                  {winRate}% WR
                                </span>
                              )}
                            </span>
                          </div>
                          <div style={{ height: '4px', background: 'var(--accent-muted)', borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Placeholder when no team sheets linked */}
            {usageStats.length === 0 && linkedSubmissions.size === 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>No team sheets linked</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '220px', margin: '0 auto' }}>
                  Tag submitted team sheets with <strong>"{tournament.eventTag || tournament.name}"</strong> to see Pokémon usage and win rates.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
            W/L records reflect Swiss rounds only · Win rate reflects team performance across all Swiss rounds
          </div>
        </>
      )}

      {modalPlayer && tournament && (
        <PlayerModal
          player={modalPlayer}
          tournament={tournament}
          onClose={() => setModalPlayer(null)}
        />
      )}
    </div>
  )
}
