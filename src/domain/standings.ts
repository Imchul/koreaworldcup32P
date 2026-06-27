import type { Group, Match, StandingRow, Team } from '../types/worldcup'

// 빈 순위 행 생성
function emptyRow(teamId: string): StandingRow {
  return {
    teamId, played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
  }
}

/**
 * 동률 비교 (내림차순 정렬용 comparator).
 * 양수면 a가 b보다 상위. 순서: 승점 → 골득실 → 다득점 → (FIFA랭크 → conduct: optional fallback).
 * head-to-head는 MVP 미구현 (README 한계 명시).
 */
export function compareRank(
  a: StandingRow,
  b: StandingRow,
  teamsById?: Record<string, Team>,
): number {
  if (a.points !== b.points) return a.points - b.points
  if (a.goalDifference !== b.goalDifference) return a.goalDifference - b.goalDifference
  if (a.goalsFor !== b.goalsFor) return a.goalsFor - b.goalsFor

  // optional fallback (값이 있을 때만)
  const ta = teamsById?.[a.teamId]
  const tb = teamsById?.[b.teamId]
  if (ta && tb) {
    // conduct score: 낮을수록 좋음 → 더 좋은(작은) 쪽이 상위
    if (ta.conductScore != null && tb.conductScore != null && ta.conductScore !== tb.conductScore) {
      return tb.conductScore - ta.conductScore
    }
    // FIFA 랭킹: 숫자가 작을수록 상위
    if (ta.fifaRank != null && tb.fifaRank != null && ta.fifaRank !== tb.fifaRank) {
      return tb.fifaRank - ta.fifaRank
    }
  }
  return 0
}

/**
 * 끝난 경기만으로 조별 순위를 계산한다 (pure function).
 * 반환: 조 코드 → 순위 내림차순 정렬된 StandingRow[]
 */
export function computeGroupStandings(
  matches: Match[],
  teams: Team[],
): Record<Group, StandingRow[]> {
  const rows = new Map<string, StandingRow>()
  const groupOf = new Map<string, Group>()
  for (const t of teams) {
    rows.set(t.id, emptyRow(t.id))
    groupOf.set(t.id, t.groupCode)
  }

  for (const m of matches) {
    if (m.status !== 'finished' || m.homeScore == null || m.awayScore == null) continue
    const home = rows.get(m.homeTeamId)
    const away = rows.get(m.awayTeamId)
    if (!home || !away) continue

    home.played++; away.played++
    home.goalsFor += m.homeScore; home.goalsAgainst += m.awayScore
    away.goalsFor += m.awayScore; away.goalsAgainst += m.homeScore

    if (m.homeScore > m.awayScore) {
      home.won++; home.points += 3; away.lost++
    } else if (m.homeScore < m.awayScore) {
      away.won++; away.points += 3; home.lost++
    } else {
      home.drawn++; away.drawn++; home.points += 1; away.points += 1
    }
  }

  // 골득실 마무리
  for (const r of rows.values()) {
    r.goalDifference = r.goalsFor - r.goalsAgainst
  }

  // 조별로 묶고 정렬
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))
  const result = {} as Record<Group, StandingRow[]>
  for (const [teamId, row] of rows) {
    const g = groupOf.get(teamId)!
    ;(result[g] ??= []).push(row)
  }
  for (const g of Object.keys(result) as Group[]) {
    result[g].sort((a, b) => compareRank(b, a, teamsById)) // 내림차순
  }
  return result
}

/**
 * 시뮬레이터/공식값 수정용 — 특정 경기 스코어를 불변 갱신한다.
 * 두 점수가 모두 채워지면 status='finished', 아니면 'scheduled'.
 */
export function updateMatchScore(
  matches: Match[],
  matchId: string,
  homeScore: number | null,
  awayScore: number | null,
): Match[] {
  return matches.map((m) =>
    m.id === matchId
      ? {
          ...m,
          homeScore,
          awayScore,
          status: homeScore != null && awayScore != null ? 'finished' : 'scheduled',
        }
      : m,
  )
}
