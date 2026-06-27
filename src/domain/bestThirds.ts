import type { Group, Match, StandingRow, Team, ThirdRow } from '../types/worldcup'
import type { FixedThird } from '../data/fixedThirds'
import { compareRank } from './standings'

// J/K/L = 경기로 직접 계산하는 변수 조
export const VARIABLE_GROUPS: Group[] = ['J', 'K', 'L']

// 정렬 전 3위 후보 (확정 여부 포함)
export type ThirdCandidate = FixedThird & { confirmed: boolean }

/**
 * 12개 조의 3위 팀을 모은다.
 *  - J/K/L: 계산된 조 순위의 3번째 행 (결정적 경기가 끝나야 confirmed)
 *  - 나머지 9개 조: 이미 확정된 fixedThirds (항상 confirmed)
 * 반환은 정렬 전 상태(랭킹은 rankBestThirds가 부여).
 */
export function getThirdPlacedTeams(
  groupStandings: Record<Group, StandingRow[]>,
  fixedThirds: FixedThird[],
  matches: Match[],
): ThirdCandidate[] {
  const variable: ThirdCandidate[] = []
  for (const g of VARIABLE_GROUPS) {
    const rows = groupStandings[g]
    if (rows && rows.length >= 3) {
      const decisive = matches.find((m) => m.groupCode === g && m.decisive)
      const confirmed = decisive ? decisive.status === 'finished' : true
      variable.push({ ...rows[2], groupCode: g, confirmed })
    }
  }
  const fixed: ThirdCandidate[] = fixedThirds.map((f) => ({ ...f, confirmed: true }))
  return [...fixed, ...variable]
}

/**
 * 3위 와일드카드 순위표를 만든다 (pure function).
 * 정렬: 승점 → 골득실 → 다득점 → (optional). 상위 8위 = 진출권(aboveCutline).
 */
export function rankBestThirds(
  thirds: ThirdCandidate[],
  teamsById?: Record<string, Team>,
): ThirdRow[] {
  const sorted = [...thirds].sort((a, b) => compareRank(b, a, teamsById))
  return sorted.map((row, i) => ({
    ...row,
    rank: i + 1,
    aboveCutline: i < 8,
  }))
}
