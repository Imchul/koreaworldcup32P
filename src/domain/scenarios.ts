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

// 각 조에서 "한국에 좋은 결과(한국보다 좋은 3위가 안 나옴)"가 나올 확률(%).
// 참고 이미지의 승/무/패 확률 + 분석의 결과 매핑으로 도출(근사):
//   L: 가나 승(22%)만 좋음 → good 22 / bad 78
//   K: DR콩고 무·패(무25 + 우즈벡승29)면 좋음 → good 54 / bad 46  (우즈벡 6골차 이변 무시)
//   J: 오스트리아 승(33%) + 알제리 2골차+ 승(약 12%) → good 45 / bad 55
export interface GroupProb {
  group: 'L' | 'K' | 'J'
  goodPct: number
  badPct: number
  note: string
}

export const GROUP_PROBS: GroupProb[] = [
  { group: 'L', goodPct: 22, badPct: 78, note: '가나 승(22%)만 한국에 유리' },
  { group: 'K', goodPct: 54, badPct: 46, note: 'DR콩고가 이기지 않으면 유리(54%)' },
  { group: 'J', goodPct: 45, badPct: 55, note: '오스트리아 승 또는 알제리 2골차+ 승(약 45%)' },
]

const goodPctOf = (g: 'L' | 'K' | 'J') => GROUP_PROBS.find((p) => p.group === g)!.goodPct / 100

export interface ComboRow {
  L: 'good' | 'bad'
  K: 'good' | 'bad'
  J: 'good' | 'bad'
  badCount: number
  koreaRank: number
  qualified: boolean
  probPct: number // 이 조합이 나올 확률(%)
}

// 8가지 조합 (각 조 good/bad) + 발생 확률
export function buildComboTable(): ComboRow[] {
  const states: Array<'good' | 'bad'> = ['good', 'bad']
  const rows: ComboRow[] = []
  for (const L of states)
    for (const K of states)
      for (const J of states) {
        const badCount = [L, K, J].filter((s) => s === 'bad').length
        const p =
          (L === 'good' ? goodPctOf('L') : 1 - goodPctOf('L')) *
          (K === 'good' ? goodPctOf('K') : 1 - goodPctOf('K')) *
          (J === 'good' ? goodPctOf('J') : 1 - goodPctOf('J'))
        rows.push({
          L,
          K,
          J,
          badCount,
          koreaRank: 7 + badCount,
          qualified: badCount <= 1,
          probPct: Math.round(p * 1000) / 10,
        })
      }
  // 진출 가능한 조합 먼저, 그 안에서 발생 확률 높은 순
  return rows.sort((a, b) => a.badCount - b.badCount || b.probPct - a.probPct)
}

// 한국 진출(8위 이내) 종합 확률 = P(나쁜 조 ≤ 1)
export function computeQualifyProbability(): {
  p0: number // 0 bad
  p1: number // 1 bad
  pOut: number // 2+ bad (탈락)
  qualify: number
} {
  const combos = buildComboTable()
  const sum = (n: number) =>
    combos.filter((c) => c.badCount === n).reduce((a, c) => a + c.probPct, 0)
  const p0 = Math.round(sum(0) * 10) / 10
  const p1 = Math.round(sum(1) * 10) / 10
  const qualify = Math.round((p0 + p1) * 10) / 10
  const pOut = Math.round((100 - qualify) * 10) / 10
  return { p0, p1, pOut, qualify }
}

export const QUALIFICATION_RULE =
  '한국보다 위에 고정된 3위 6팀 + 한국 = 현재 7위권. ' +
  '남은 위험 3조(J·K·L) 중 한국보다 좋은 3위가 0~1개면 진출(7~8위), 2개 이상이면 탈락(9위↓).'
