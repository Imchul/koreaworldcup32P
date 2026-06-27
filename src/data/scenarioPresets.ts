// 남은 6경기 예상 스코어 시나리오 (가장 유력한 결과부터).
// 각 시나리오를 선택하면 6경기 스코어가 시뮬레이터에 적용되고,
// 한국의 32강 가능성과 대진표가 그에 맞춰 다시 계산된다. (사용자가 직접 수정도 가능)
//
// scores: matchId → [홈, 원정] 득점.
// probPct: 결정적 3경기 결과 조합의 대략적 발생 확률(참고 이미지 승률 기반).

export interface ScenarioPreset {
  id: string
  name: string
  desc: string
  probPct: number
  scores: Record<string, [number, number]>
}

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: 'S1',
    name: '시나리오 1 · 가장 유력',
    desc: '크로아티아 승 + DR콩고 승 + 알제리-오스트리아 무 → 위험 3조 모두 불리',
    probPct: 10.9,
    scores: {
      'L-PAN-ENG': [0, 2], // 잉글랜드 승
      'L-CRO-GHA': [1, 0], // 크로아티아 승 (L 나쁨)
      'K-COL-POR': [1, 2], // 포르투갈 승
      'K-COD-UZB': [1, 0], // DR콩고 승 (K 나쁨)
      'J-JOR-ARG': [0, 2], // 아르헨티나 승
      'J-ALG-AUT': [1, 1], // 무승부 (J 나쁨)
    },
  },
  {
    id: 'S2',
    name: '시나리오 2 · 한국 생존',
    desc: '가나 승 + DR콩고 무 + 오스트리아 승 → 위험 3조 모두 유리',
    probPct: 1.8,
    scores: {
      'L-PAN-ENG': [0, 2],
      'L-CRO-GHA': [0, 1], // 가나 승 (L 좋음)
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [1, 1], // DR콩고 무 (K 좋음)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [0, 1], // 오스트리아 승 (J 좋음)
    },
  },
  {
    id: 'S3',
    name: '시나리오 3 · 아슬아슬 진출',
    desc: '크로아티아 무(L 불리) + 우즈벡 승(K 유리) + 오스트리아 승(J 유리)',
    probPct: 2.2,
    scores: {
      'L-PAN-ENG': [0, 2],
      'L-CRO-GHA': [1, 1], // 무 (L 나쁨)
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [0, 1], // 우즈벡 승 (K 좋음)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [0, 1], // 오스트리아 승 (J 좋음)
    },
  },
  {
    id: 'S4',
    name: '시나리오 4 · 최상',
    desc: '가나 승 + 우즈벡 승 + 알제리 2골차 승 → 7위 안정권',
    probPct: 1.5,
    scores: {
      'L-PAN-ENG': [0, 2],
      'L-CRO-GHA': [0, 2], // 가나 승 (L 좋음)
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [0, 1], // 우즈벡 승 (K 좋음)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [2, 0], // 알제리 2골차 승 (J 좋음)
    },
  },
  {
    id: 'S5',
    name: '시나리오 5 · 한 끗 차 탈락',
    desc: '크로아티아 무(L 불리) + DR콩고 승(K 불리) + 오스트리아 승(J 유리) → 9위',
    probPct: 8.4,
    scores: {
      'L-PAN-ENG': [0, 2],
      'L-CRO-GHA': [1, 1], // 무 (L 나쁨)
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [1, 0], // DR콩고 승 (K 나쁨)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [0, 1], // 오스트리아 승 (J 좋음)
    },
  },
]
