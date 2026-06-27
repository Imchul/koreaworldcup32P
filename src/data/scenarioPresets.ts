// 남은 결정적 경기 시나리오 (가장 유력한 결과부터).
// 각 시나리오를 선택하면 K·J 경기 스코어가 시뮬레이터에 적용되고,
// 한국의 32강 가능성과 대진표가 그에 맞춰 다시 계산된다. (사용자가 직접 수정도 가능)
//
// ▶ L조는 이미 종료됐다(크로아티아 2-1 가나 → L조 3위=가나 4점 = 한국에 불리, 확정).
//   적용 시작점이 공식 경기 결과(L 확정 포함)이므로, 아래 프리셋은 남은 K·J만 지정한다.
//   한국은 위험 1조(L)를 이미 안고 있어 K·J가 모두 유리해야 8위로 진출한다.
//   둘 중 하나라도 불리하면 한국보다 좋은 3위가 2조가 되어 9위 이하로 탈락.
//
// scores: matchId → [홈, 원정] 득점.
// probPct: 남은 K·J 결정적 경기 조합의 대략적 발생 확률(참고 이미지 승률 기반, L 확정 조건부).

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
    name: '시나리오 1 · 유일한 진출 경로',
    desc: 'DR콩고 무 + 오스트리아 승 → K·J 모두 유리, 한국 8위로 진출',
    probPct: 24.3,
    scores: {
      'K-COL-POR': [1, 2], // 포르투갈 승
      'K-COD-UZB': [1, 1], // DR콩고 무 (K 좋음)
      'J-JOR-ARG': [0, 2], // 아르헨티나 승
      'J-ALG-AUT': [0, 1], // 오스트리아 승 (J 좋음)
    },
  },
  {
    id: 'S2',
    name: '시나리오 2 · J조에서 무너짐',
    desc: 'DR콩고 무(K 유리) + 알제리-오스트리아 무(J 불리) → 9위 탈락',
    probPct: 29.7,
    scores: {
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [1, 1], // DR콩고 무 (K 좋음)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [1, 1], // 무승부 (J 나쁨)
    },
  },
  {
    id: 'S3',
    name: '시나리오 3 · K조에서 무너짐',
    desc: 'DR콩고 승(K 불리) + 오스트리아 승(J 유리) → 9위 탈락',
    probPct: 20.7,
    scores: {
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [1, 0], // DR콩고 승 (K 나쁨)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [0, 1], // 오스트리아 승 (J 좋음)
    },
  },
  {
    id: 'S4',
    name: '시나리오 4 · 최악 (K·J 모두 불리)',
    desc: 'DR콩고 승 + 알제리-오스트리아 무 → 위험 3조 전부 불리, 10위',
    probPct: 25.3,
    scores: {
      'K-COL-POR': [1, 2],
      'K-COD-UZB': [1, 0], // DR콩고 승 (K 나쁨)
      'J-JOR-ARG': [0, 2],
      'J-ALG-AUT': [1, 1], // 무승부 (J 나쁨)
    },
  },
]
