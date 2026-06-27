import type { Group, ThirdRow } from '../types/worldcup'
import { combinationKey } from '../data/annexC'
import type { ThirdSlot } from '../data/annexC'
import { KOREA_TEAM_ID } from '../data/initialTeams'

export interface BracketSlot {
  matchId: string
  opponentLabel: string
  third: ThirdRow | null // 배정된 3위 팀 (없으면 null)
  isKorea: boolean
}

export interface Bracket {
  slots: BracketSlot[]
  exact: boolean // true=Annexe C 공식 배정, false=폴백(순위순) 배정
}

/**
 * 진출한 8개 조 3위를 32강 슬롯에 배정한다 (pure function).
 *  - annexCCombos에 해당 조합이 있으면 공식 배정(exact=true)
 *  - 없으면 와일드카드 순위 순서대로 슬롯에 채우는 폴백(exact=false)
 */
export function buildBracket(
  rankedThirds: ThirdRow[],
  annexCCombos: Record<string, Group[]>,
  thirdSlots: ThirdSlot[],
): Bracket {
  const qualified = rankedThirds.filter((t) => t.aboveCutline) // 상위 8팀
  const key = combinationKey(qualified.map((t) => t.groupCode))
  const combo = annexCCombos[key]

  if (combo && combo.length === thirdSlots.length) {
    // 공식 배정: 슬롯 i ← combo[i] 조의 3위
    const byGroup = new Map(qualified.map((t) => [t.groupCode, t]))
    return {
      exact: true,
      slots: thirdSlots.map((slot, i) => {
        const third = byGroup.get(combo[i]) ?? null
        return {
          matchId: slot.matchId,
          opponentLabel: slot.opponentLabel,
          third,
          isKorea: third?.teamId === KOREA_TEAM_ID,
        }
      }),
    }
  }

  // 폴백: 와일드카드 순위 순으로 슬롯에 채움 (근사)
  return {
    exact: false,
    slots: thirdSlots.map((slot, i) => {
      const third = qualified[i] ?? null
      return {
        matchId: slot.matchId,
        opponentLabel: slot.opponentLabel,
        third,
        isKorea: third?.teamId === KOREA_TEAM_ID,
      }
    }),
  }
}
