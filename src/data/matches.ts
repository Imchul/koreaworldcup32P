import type { Match } from '../types/worldcup'

// ============================================================================
//  J / K / L 조 경기 데이터 — "진실의 원천"
//
//  ▶ 공식 결과가 나오면 아래 decisive(결정적) 3경기의 homeScore/awayScore를
//    채우고 status를 'finished'로 바꾼 뒤 commit & push 하면
//    Cloudflare Pages가 자동 재빌드하여 모든 사용자에게 반영된다.
//
//  ▶ 화면의 시뮬레이터는 이 값을 기본값으로 쓰고, 사용자가 바꾸면 즉시 재계산한다.
//    (시뮬레이터 변경은 새로고침하면 이 공식값으로 복귀)
//
//  이미 끝난 경기의 스코어는 각 조 현재 순위(분석 기준)를 정확히 재현하도록 구성:
//    J: ARG 6 / AUT 3·GD0 / ALG 3·GD-2 / JOR 0
//    K: COL 6 / POR 4 / COD 1·GD-1 / UZB 0·GD-7
//    L: ENG 4 / GHA 4 / CRO 3·GD-1 / PAN 0
//    (한국 = A조 3위, 3점·GD-1·득점2)
// ============================================================================

export const matches: Match[] = [
  // ───────────────────────── J조 (이미 끝난 경기) ─────────────────────────
  { id: 'J-ARG-AUT', groupCode: 'J', homeTeamId: 'ARG', awayTeamId: 'AUT', homeScore: 1, awayScore: 0, status: 'finished' },
  { id: 'J-ARG-ALG', groupCode: 'J', homeTeamId: 'ARG', awayTeamId: 'ALG', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'J-AUT-JOR', groupCode: 'J', homeTeamId: 'AUT', awayTeamId: 'JOR', homeScore: 1, awayScore: 0, status: 'finished' },
  { id: 'J-ALG-JOR', groupCode: 'J', homeTeamId: 'ALG', awayTeamId: 'JOR', homeScore: 1, awayScore: 0, status: 'finished' },

  // ───────────────────────── K조 (이미 끝난 경기) ─────────────────────────
  { id: 'K-COL-COD', groupCode: 'K', homeTeamId: 'COL', awayTeamId: 'COD', homeScore: 1, awayScore: 0, status: 'finished' },
  { id: 'K-COL-UZB', groupCode: 'K', homeTeamId: 'COL', awayTeamId: 'UZB', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'K-POR-COD', groupCode: 'K', homeTeamId: 'POR', awayTeamId: 'COD', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'K-POR-UZB', groupCode: 'K', homeTeamId: 'POR', awayTeamId: 'UZB', homeScore: 4, awayScore: 0, status: 'finished' },

  // ───────────────────────── L조 (이미 끝난 경기) ─────────────────────────
  { id: 'L-ENG-GHA', groupCode: 'L', homeTeamId: 'ENG', awayTeamId: 'GHA', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'L-ENG-CRO', groupCode: 'L', homeTeamId: 'ENG', awayTeamId: 'CRO', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'L-GHA-PAN', groupCode: 'L', homeTeamId: 'GHA', awayTeamId: 'PAN', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'L-CRO-PAN', groupCode: 'L', homeTeamId: 'CRO', awayTeamId: 'PAN', homeScore: 1, awayScore: 0, status: 'finished' },

  // ═══════════════════ 결정적 3경기 (시뮬레이터 입력 대상) ═══════════════════
  // 한국시간 6/28(일) 오전. 공식 결과가 나오면 점수 채우고 status='finished'.
  {
    id: 'L-CRO-GHA', groupCode: 'L', homeTeamId: 'CRO', awayTeamId: 'GHA',
    homeScore: null, awayScore: null, status: 'scheduled',
    kickoffAt: '2026-06-28T06:00:00+09:00', decisive: true,
  },
  {
    id: 'K-COD-UZB', groupCode: 'K', homeTeamId: 'COD', awayTeamId: 'UZB',
    homeScore: null, awayScore: null, status: 'scheduled',
    kickoffAt: '2026-06-28T08:30:00+09:00', decisive: true,
  },
  {
    id: 'J-ALG-AUT', groupCode: 'J', homeTeamId: 'ALG', awayTeamId: 'AUT',
    homeScore: null, awayScore: null, status: 'scheduled',
    kickoffAt: '2026-06-28T11:00:00+09:00', decisive: true,
  },
]

// 마지막 공식 갱신 시각 (결과 입력 시 함께 수정)
export const lastUpdated = '2026-06-27T23:00:00+09:00'
