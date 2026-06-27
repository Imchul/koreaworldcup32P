import type { Group, StandingRow } from '../types/worldcup'

// 이미 조별리그가 끝나 3위가 고정된 9개 조의 3위 행.
// (A=한국 포함, 한국보다 위 6팀 + 아래 2팀)
//
// ⚠️ 아래 스탯은 분석 자료 기반 best-effort 값이다. head-to-head 등 세부는 반영하지 않았다.
//    배포 전 공식 순위표(승점/골득실/득점)와 반드시 대조하여 수정할 것.
//    단 한국의 컷라인 판정은 J/K/L 결과에만 좌우되므로, 이 9팀의 상대 순서만 맞으면 결론은 안전하다.

export type FixedThird = StandingRow & { groupCode: Group }

// 정렬 기준: 승점 → 골득실 → 다득점. (한국 = 3점 / GD -1 / 득점 2)
export const fixedThirds: FixedThird[] = [
  // ── 한국보다 위 (6팀) ──
  { teamId: 'SWE', groupCode: 'B', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 4 },
  { teamId: 'ECU', groupCode: 'C', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 4 },
  { teamId: 'BIH', groupCode: 'D', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 3 },
  { teamId: 'PAR', groupCode: 'E', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 3 },
  { teamId: 'SEN', groupCode: 'F', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 3 },
  { teamId: 'IRN', groupCode: 'G', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 2, goalDifference: 0, points: 3 },

  // ── 한국 (A조 3위) ──
  { teamId: 'KOR', groupCode: 'A', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 3, goalDifference: -1, points: 3 },

  // ── 한국보다 아래 (2팀, 컷라인에 영향 없음) ──
  { teamId: 'HAI', groupCode: 'H', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
  { teamId: 'NZL', groupCode: 'I', played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 4, goalDifference: -3, points: 1 },
]
