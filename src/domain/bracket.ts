import type { Group, ThirdRow } from '../types/worldcup'
import { KOREA_TEAM_ID } from '../data/initialTeams'
import type { Seed, SeedMatch } from '../data/bracketSeeds'
import { bracketConfirmed, type ConfirmedTeam } from '../data/bracketConfirmed'

// 해소된 한 자리(슬롯)
export interface ResolvedSeed {
  kind: 'team' | 'confirmed' | 'label' // team=3위, confirmed=확정된 조1·2위, label=미확정 자리
  groupCode: Group
  label: string // 'A조 1위' 등
  teamId?: string // kind==='team' (3위, teamsById 조회)
  confirmed?: ConfirmedTeam // kind==='confirmed' (이름·국기 직접 포함)
  isThird: boolean
  isKorea: boolean
  determined: boolean // 실제 팀으로 채워졌는지
}

export interface ResolvedMatch {
  id: string
  side: 'L' | 'R'
  top: ResolvedSeed
  bottom: ResolvedSeed
}

export interface Bracket {
  left: ResolvedMatch[]
  right: ResolvedMatch[]
  koreaMatchId: string | null // 한국이 위치한 R32 경기 (없으면 탈락)
  exact: boolean // Annexe C 공식 배정 여부 (현재는 항상 false=예시 구조)
}

/**
 * 와일드카드 순위 상위 8팀을 R32 3위 슬롯에 배정하고 대진표를 만든다 (pure function).
 * 배정은 와일드카드 순위 순(slotIndex 0=1위 …). 시뮬레이션으로 순위가 바뀌면 한국 위치도 바뀐다.
 */
export function buildBracket(
  rankedThirds: ThirdRow[],
  r32Seeds: SeedMatch[],
): Bracket {
  const qualified = rankedThirds.filter((t) => t.aboveCutline) // 상위 8팀 (slotIndex 순)

  const resolveSeed = (seed: Seed): ResolvedSeed => {
    if (seed.type === 'third') {
      const third = qualified[seed.slotIndex]
      if (!third) {
        return {
          kind: 'label', groupCode: 'A', label: '3위 미정',
          isThird: true, isKorea: false, determined: false,
        }
      }
      return {
        kind: 'team',
        groupCode: third.groupCode,
        label: `${third.groupCode}조 3위`,
        teamId: third.teamId,
        isThird: true,
        isKorea: third.teamId === KOREA_TEAM_ID,
        determined: true,
      }
    }
    const suffix = seed.type === 'winner' ? '1위' : '2위'
    const confirmed = bracketConfirmed[`${seed.type}-${seed.group}`]
    return {
      kind: confirmed ? 'confirmed' : 'label',
      groupCode: seed.group,
      label: `${seed.group}조 ${suffix}`,
      confirmed,
      isThird: false,
      isKorea: false,
      determined: !!confirmed,
    }
  }

  const resolveMatch = (m: SeedMatch): ResolvedMatch => ({
    id: m.id,
    side: m.side,
    top: resolveSeed(m.top),
    bottom: resolveSeed(m.bottom),
  })

  const all = r32Seeds.map(resolveMatch)
  const koreaMatch = all.find((m) => m.top.isKorea || m.bottom.isKorea)

  return {
    left: all.filter((m) => m.side === 'L'),
    right: all.filter((m) => m.side === 'R'),
    koreaMatchId: koreaMatch?.id ?? null,
    exact: false,
  }
}
