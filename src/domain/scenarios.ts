// 한국 진출 시나리오 리포트 (분석 기반, pure / 정적 데이터)
//
// 시뮬레이션 전에도 "J/K/L 세 조가 어떻게 되면 한국이 올라가는가"를 보여주기 위한 데이터.
// 핵심 규칙: 한국보다 위 고정 3위 6팀 + 한국 = 7위. 위험 3조(J/K/L) 중 "한국보다 좋은 3위"가
//           0~1개면 진출(≤8위), 2개 이상이면 탈락(≥9위).

export const FIXED_ABOVE_KOREA = 6

export interface GroupScenario {
  group: 'L' | 'K' | 'J'
  kickoffKo: string
  match: string
  good: string // 한국에 유리(한국보다 좋은 3위가 안 나옴)
  bad: string // 한국에 불리(한국보다 좋은 3위가 나옴)
}

export const GROUP_SCENARIOS: GroupScenario[] = [
  {
    group: 'L',
    kickoffKo: '6/28(일) 06:00',
    match: '크로아티아 vs 가나',
    good: '가나 승 (크로아티아가 가나에 패)',
    bad: '크로아티아가 비기거나 이김 → L조 3위 4점 이상',
  },
  {
    group: 'K',
    kickoffKo: '6/28(일) 08:30',
    match: 'DR콩고 vs 우즈베키스탄',
    good: 'DR콩고가 이기지 못함 (무·패). 우즈벡이 이겨도 5골차 이하면 OK',
    bad: 'DR콩고 승 또는 우즈베키스탄 6골차 이상 승(초대형 이변)',
  },
  {
    group: 'J',
    kickoffKo: '6/28(일) 11:00',
    match: '알제리 vs 오스트리아',
    good: '오스트리아 승 또는 알제리 2골차 이상 승',
    bad: '무승부 또는 알제리 1골차 승(오스트리아 득점 多)',
  },
]

export interface ComboRow {
  L: 'good' | 'bad'
  K: 'good' | 'bad'
  J: 'good' | 'bad'
  badCount: number
  koreaRank: number
  qualified: boolean
}

// 8가지 조합 (각 조 good/bad)
export function buildComboTable(): ComboRow[] {
  const states: Array<'good' | 'bad'> = ['good', 'bad']
  const rows: ComboRow[] = []
  for (const L of states)
    for (const K of states)
      for (const J of states) {
        const badCount = [L, K, J].filter((s) => s === 'bad').length
        rows.push({
          L,
          K,
          J,
          badCount,
          koreaRank: 7 + badCount,
          qualified: badCount <= 1,
        })
      }
  // 진출 가능한 조합 먼저, 그 안에서 badCount 적은 순
  return rows.sort((a, b) => a.badCount - b.badCount)
}

export const QUALIFICATION_RULE =
  '한국보다 위에 고정된 3위 6팀 + 한국 = 현재 7위권. ' +
  '남은 위험 3조(J·K·L) 중 한국보다 좋은 3위가 0~1개면 진출(7~8위), 2개 이상이면 탈락(9위↓).'
