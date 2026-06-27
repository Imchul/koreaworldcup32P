// 2026 월드컵 도메인 타입 정의.
// 모든 계산은 이 타입들을 받는 pure function(src/domain)에서 수행한다.

export type Group =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

export interface Team {
  id: string
  nameKo: string
  nameEn: string
  groupCode: Group
  flagCode: string // ISO 3166-1 alpha-2 (소문자) — 이모지 국기 변환용
  fifaRank?: number
  conductScore?: number // 페어플레이 점수 (낮을수록 좋음). MVP에서는 optional fallback
}

export interface Match {
  id: string
  groupCode: Group
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  status: 'scheduled' | 'finished'
  kickoffAt?: string // ISO 8601 (한국시간 표기는 화면에서 변환)
  decisive?: boolean // 한국 운명을 가르는 결정적 경기 여부 (시뮬레이터 입력 대상)
}

export interface StandingRow {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

// 12개 조 3위 와일드카드 순위 한 행
export interface ThirdRow extends StandingRow {
  groupCode: Group
  rank: number // 1..12
  aboveCutline: boolean // 상위 8위 이내 = 진출권
}

export type KoreaStatusLabel =
  | '진출 확정'
  | '현재 진출권'
  | '아직 불확실'
  | '탈락 위험'
  | '탈락 확정'

// J/K/L 위험 조 판정 (분석 기반 하이브리드 요약)
export interface KoreaWatchGroup {
  group: 'J' | 'K' | 'L'
  status: 'pending' | 'good_for_korea' | 'bad_for_korea'
  reason: string
}

export interface KoreaStatus {
  label: KoreaStatusLabel
  koreaRank: number // 와일드카드 예상 순위
  qualified: boolean // 현재 기준 32강 진출권(8위 이내)
  watchGroups: KoreaWatchGroup[]
  badCount: number // 한국보다 좋은 3위를 만든 위험 조 수
  reason: string
}
