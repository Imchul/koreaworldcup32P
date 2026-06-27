import type {
  Group, KoreaStatus, KoreaWatchGroup, Match, StandingRow, Team, ThirdRow,
} from '../types/worldcup'
import { KOREA_TEAM_ID } from '../data/initialTeams'
import { compareRank } from './standings'
import { VARIABLE_GROUPS } from './bestThirds'

const GROUP_LABEL: Record<'J' | 'K' | 'L', string> = { J: 'J조', K: 'K조', L: 'L조' }

/**
 * 한국의 32강 진출 상태를 판정한다 (pure function).
 *
 * 핵심 모델(분석 기반):
 *  - 한국보다 위에 고정된 3위 6팀 + 한국 = 현재 7위권
 *  - 남은 변수는 J/K/L 세 조. 각 조에서 "한국보다 좋은 3위"가 나오면 bad
 *  - koreaRank ≈ 7 + (한국보다 좋은 3위를 만든 조 수)
 *  - bad가 0~1개면 진출(≤8위), 2개 이상이면 탈락(≥9위)
 *
 * 라벨은 best/worst case로 확정 여부를 구분:
 *  - 최악의 경우에도 bad ≤ 1 → '진출 확정'
 *  - 최선의 경우에도 bad ≥ 2 → '탈락 확정'
 *  - 이미 bad 1개 + 남은 위험 → '탈락 위험'
 *  - 그 외 → '아직 불확실'
 */
export function getKoreaStatus(
  rankedThirds: ThirdRow[],
  groupStandings: Record<Group, StandingRow[]>,
  matches: Match[],
  teamsById?: Record<string, Team>,
): KoreaStatus {
  const koreaRow = rankedThirds.find((r) => r.teamId === KOREA_TEAM_ID)
  const koreaRank = koreaRow?.rank ?? rankedThirds.length + 1

  const watchGroups: KoreaWatchGroup[] = VARIABLE_GROUPS.map((g) =>
    evaluateWatchGroup(g as 'J' | 'K' | 'L', groupStandings, matches, koreaRow, teamsById),
  )

  const badCount = watchGroups.filter((w) => w.status === 'bad_for_korea').length
  const pendingCount = watchGroups.filter((w) => w.status === 'pending').length
  const worstBad = badCount + pendingCount
  const bestBad = badCount

  let label: KoreaStatus['label']
  if (worstBad <= 1) label = '진출 확정'
  else if (bestBad >= 2) label = '탈락 확정'
  else if (badCount >= 1) label = '탈락 위험'
  else label = '아직 불확실'

  const qualified = koreaRank <= 8

  const reason =
    `한국 예상 ${koreaRank}위 · 한국보다 좋은 3위 ${badCount}개` +
    (pendingCount > 0 ? ` · 남은 위험 조 ${pendingCount}개` : '')

  return { label, koreaRank, qualified, watchGroups, badCount, reason }
}

function evaluateWatchGroup(
  group: 'J' | 'K' | 'L',
  groupStandings: Record<Group, StandingRow[]>,
  matches: Match[],
  koreaRow: StandingRow | undefined,
  teamsById?: Record<string, Team>,
): KoreaWatchGroup {
  const decisive = matches.find((m) => m.groupCode === group && m.decisive)
  const label = GROUP_LABEL[group]

  if (!decisive || decisive.status !== 'finished') {
    return { group, status: 'pending', reason: `${label}: 결과 대기` }
  }

  const rows = groupStandings[group]
  const third = rows && rows.length >= 3 ? rows[2] : undefined
  if (!third || !koreaRow) {
    return { group, status: 'pending', reason: `${label}: 계산 불가` }
  }

  const thirdName = teamsById?.[third.teamId]?.nameKo ?? third.teamId
  const aboveKorea = compareRank(third, koreaRow, teamsById) > 0

  return aboveKorea
    ? { group, status: 'bad_for_korea', reason: `${label}: ${thirdName} 3위가 한국보다 위 ⚠️` }
    : { group, status: 'good_for_korea', reason: `${label}: ${thirdName} 3위가 한국보다 아래 ✓` }
}
