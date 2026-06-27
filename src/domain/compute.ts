import type { Group, Match, StandingRow, Team, ThirdRow, KoreaStatus } from '../types/worldcup'
import { computeGroupStandings } from './standings'
import { getThirdPlacedTeams, rankBestThirds } from './bestThirds'
import { getKoreaStatus } from './koreaStatus'
import { buildBracket, type Bracket } from './bracket'
import type { FixedThird } from '../data/fixedThirds'
import { annexCCombos, thirdSlots } from '../data/annexC'

export interface WorldCupState {
  groupStandings: Record<Group, StandingRow[]>
  rankedThirds: ThirdRow[]
  koreaStatus: KoreaStatus
  bracket: Bracket
}

/**
 * 주어진 경기 결과로 전체 상태를 한 번에 계산한다 (pure).
 * App과 시뮬레이터, 테스트가 모두 이 함수를 호출한다.
 */
export function computeWorldCupState(
  matches: Match[],
  teams: Team[],
  fixedThirds: FixedThird[],
): WorldCupState {
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))
  const groupStandings = computeGroupStandings(matches, teams)
  const thirds = getThirdPlacedTeams(groupStandings, fixedThirds)
  const rankedThirds = rankBestThirds(thirds, teamsById)
  const koreaStatus = getKoreaStatus(rankedThirds, groupStandings, matches, teamsById)
  const bracket = buildBracket(rankedThirds, annexCCombos, thirdSlots)
  return { groupStandings, rankedThirds, koreaStatus, bracket }
}
