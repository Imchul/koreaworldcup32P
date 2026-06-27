import type { Group } from '../types/worldcup'

// ============================================================================
//  32강(Round of 32) 대진 배정 데이터 — Annexe C
//
//  FIFA 2026은 12개 조 3위 중 상위 8팀이 32강에 진출하며,
//  "어느 8개 조의 3위가 올라오는가"의 조합(12개 중 8개 = 495가지)에 따라
//  각 3위 팀이 어느 조 1위와 붙는지가 공식 표(Annexe C)로 미리 정해져 있다.
//
//  ⚠️ MVP 한계: 495행 공식 표 전체는 아직 입력하지 않았다.
//     - annexCCombos에 해당 조합이 있으면 그 배정을 사용(정확)
//     - 없으면 buildBracket()이 와일드카드 순위 순서대로 슬롯에 채우는 폴백 사용(근사)
//     공식 표를 확보하면 annexCCombos를 채워 정확도를 높인다. (계획 §10 참고)
// ============================================================================

// 3위 팀과 맞붙는 8개 조 1위 슬롯. (대진표의 '3위가 들어가는 자리')
// ⚠️ 어느 조 1위가 3위와 붙는지는 공식 브래킷 기준 — 배포 전 확인 필요(placeholder).
export interface ThirdSlot {
  matchId: string // R32 경기 식별자
  opponentLabel: string // 상대 (예: 'A조 1위')
}

export const thirdSlots: ThirdSlot[] = [
  { matchId: 'R32-1', opponentLabel: 'A조 1위' },
  { matchId: 'R32-2', opponentLabel: 'B조 1위' },
  { matchId: 'R32-3', opponentLabel: 'C조 1위' },
  { matchId: 'R32-4', opponentLabel: 'D조 1위' },
  { matchId: 'R32-5', opponentLabel: 'E조 1위' },
  { matchId: 'R32-6', opponentLabel: 'F조 1위' },
  { matchId: 'R32-7', opponentLabel: 'G조 1위' },
  { matchId: 'R32-8', opponentLabel: 'H조 1위' },
]

// 정확 배정 조합표.
//   key   = 진출한 8개 조 코드를 알파벳 정렬해 이은 문자열 (예: 'ABCDEFGI')
//   value = thirdSlots[0..7]에 들어갈 조 코드 (순서 = 슬롯 순서)
// MVP에서는 비어 있으며, 채워지지 않은 조합은 폴백 배정을 사용한다.
export const annexCCombos: Record<string, Group[]> = {
  // 예시(샘플) — 실제 공식 표로 대체할 것:
  // 'ABCDEFGH': ['C', 'D', 'A', 'F', 'E', 'G', 'H', 'B'],
}

// 조합 키 생성기 (진출 조 코드 정렬)
export function combinationKey(groups: Group[]): string {
  return [...groups].sort().join('')
}
