import type { Group } from '../types/worldcup'

// ============================================================================
//  32강(Round of 32) 대진 구조
//
//  ⚠️ 구조는 예시(illustrative)다. 조 1·2위 자리는 그룹 코드 라벨로 표시하고,
//     3위(슬롯)는 와일드카드 순위 결과로 채워진다. 한국은 자신이 배정된 3위 슬롯에 등장하며,
//     시뮬레이션으로 한국의 와일드카드 순위가 바뀌면 대진표 위치도 함께 바뀐다.
//
//  정확한 Annexe C 배정표가 확보되면 slotIndex↔조 매핑을 그에 맞게 교체한다. (README 참고)
// ============================================================================

export type Seed =
  | { type: 'winner'; group: Group } // 조 1위
  | { type: 'runnerup'; group: Group } // 조 2위
  | { type: 'third'; slotIndex: number } // 3위 와일드카드 (0..7)

export interface SeedMatch {
  id: string
  side: 'L' | 'R'
  top: Seed
  bottom: Seed
}

// 16개 R32 경기 (좌 8 / 우 8). 8개의 third 슬롯이 고르게 분산된다.
export const r32Seeds: SeedMatch[] = [
  // ── 좌측 ──
  { id: 'L1', side: 'L', top: { type: 'winner', group: 'A' }, bottom: { type: 'runnerup', group: 'B' } },
  { id: 'L2', side: 'L', top: { type: 'winner', group: 'C' }, bottom: { type: 'third', slotIndex: 0 } },
  { id: 'L3', side: 'L', top: { type: 'winner', group: 'D' }, bottom: { type: 'runnerup', group: 'E' } },
  { id: 'L4', side: 'L', top: { type: 'winner', group: 'F' }, bottom: { type: 'third', slotIndex: 1 } },
  { id: 'L5', side: 'L', top: { type: 'winner', group: 'G' }, bottom: { type: 'runnerup', group: 'H' } },
  { id: 'L6', side: 'L', top: { type: 'winner', group: 'I' }, bottom: { type: 'third', slotIndex: 2 } },
  { id: 'L7', side: 'L', top: { type: 'winner', group: 'J' }, bottom: { type: 'runnerup', group: 'K' } },
  { id: 'L8', side: 'L', top: { type: 'winner', group: 'L' }, bottom: { type: 'third', slotIndex: 3 } },

  // ── 우측 ──
  { id: 'R1', side: 'R', top: { type: 'winner', group: 'B' }, bottom: { type: 'runnerup', group: 'A' } },
  { id: 'R2', side: 'R', top: { type: 'winner', group: 'E' }, bottom: { type: 'third', slotIndex: 4 } },
  { id: 'R3', side: 'R', top: { type: 'winner', group: 'H' }, bottom: { type: 'runnerup', group: 'C' } },
  { id: 'R4', side: 'R', top: { type: 'winner', group: 'K' }, bottom: { type: 'third', slotIndex: 5 } },
  { id: 'R5', side: 'R', top: { type: 'runnerup', group: 'D' }, bottom: { type: 'runnerup', group: 'F' } },
  { id: 'R6', side: 'R', top: { type: 'runnerup', group: 'G' }, bottom: { type: 'third', slotIndex: 6 } },
  { id: 'R7', side: 'R', top: { type: 'runnerup', group: 'I' }, bottom: { type: 'runnerup', group: 'J' } },
  { id: 'R8', side: 'R', top: { type: 'runnerup', group: 'L' }, bottom: { type: 'third', slotIndex: 7 } },
]
