import type { Team } from '../types/worldcup'

// 한국 팀 ID (도메인 로직에서 한국을 식별하는 단일 상수)
export const KOREA_TEAM_ID = 'KOR'

// 등장 팀 목록.
//  - J/K/L 12팀: 경기(matches)로부터 순위를 직접 계산하는 변수 조
//  - 9개 확정 3위 팀: 이미 조별리그가 끝나 3위가 고정된 조 (fixedThirds.ts에서 스탯 사용)
//
// ⚠️ 확정 3위 9팀의 스탯은 분석 자료 기반 best-effort 값이다.
//    배포 전 공식 순위표와 반드시 대조할 것 (fixedThirds.ts 참고).
export const teams: Team[] = [
  // ── 한국 (A조 3위, 확정) ──
  { id: 'KOR', nameKo: '대한민국', nameEn: 'Korea Republic', groupCode: 'A', flagCode: 'kr' },

  // ── 한국보다 위에 고정된 3위 6팀 ──
  { id: 'SWE', nameKo: '스웨덴', nameEn: 'Sweden', groupCode: 'B', flagCode: 'se' },
  { id: 'ECU', nameKo: '에콰도르', nameEn: 'Ecuador', groupCode: 'C', flagCode: 'ec' },
  { id: 'BIH', nameKo: '보스니아', nameEn: 'Bosnia & Herzegovina', groupCode: 'D', flagCode: 'ba' },
  { id: 'PAR', nameKo: '파라과이', nameEn: 'Paraguay', groupCode: 'E', flagCode: 'py' },
  { id: 'SEN', nameKo: '세네갈', nameEn: 'Senegal', groupCode: 'F', flagCode: 'sn' },
  { id: 'IRN', nameKo: '이란', nameEn: 'Iran', groupCode: 'G', flagCode: 'ir' },

  // ── 한국보다 아래 고정된 3위 2팀 (컷라인에 영향 없음, TODO: 공식값 확인) ──
  { id: 'HAI', nameKo: '아이티', nameEn: 'Haiti', groupCode: 'H', flagCode: 'ht' },
  { id: 'NZL', nameKo: '뉴질랜드', nameEn: 'New Zealand', groupCode: 'I', flagCode: 'nz' },

  // ── J조 ──
  { id: 'ARG', nameKo: '아르헨티나', nameEn: 'Argentina', groupCode: 'J', flagCode: 'ar' },
  { id: 'AUT', nameKo: '오스트리아', nameEn: 'Austria', groupCode: 'J', flagCode: 'at' },
  { id: 'ALG', nameKo: '알제리', nameEn: 'Algeria', groupCode: 'J', flagCode: 'dz' },
  { id: 'JOR', nameKo: '요르단', nameEn: 'Jordan', groupCode: 'J', flagCode: 'jo' },

  // ── K조 ──
  { id: 'COL', nameKo: '콜롬비아', nameEn: 'Colombia', groupCode: 'K', flagCode: 'co' },
  { id: 'POR', nameKo: '포르투갈', nameEn: 'Portugal', groupCode: 'K', flagCode: 'pt' },
  { id: 'COD', nameKo: 'DR콩고', nameEn: 'DR Congo', groupCode: 'K', flagCode: 'cd' },
  { id: 'UZB', nameKo: '우즈베키스탄', nameEn: 'Uzbekistan', groupCode: 'K', flagCode: 'uz' },

  // ── L조 ──
  { id: 'ENG', nameKo: '잉글랜드', nameEn: 'England', groupCode: 'L', flagCode: 'gb' },
  { id: 'GHA', nameKo: '가나', nameEn: 'Ghana', groupCode: 'L', flagCode: 'gh' },
  { id: 'CRO', nameKo: '크로아티아', nameEn: 'Croatia', groupCode: 'L', flagCode: 'hr' },
  { id: 'PAN', nameKo: '파나마', nameEn: 'Panama', groupCode: 'L', flagCode: 'pa' },
]

// 빠른 조회용 맵
export const teamsById: Record<string, Team> = Object.fromEntries(
  teams.map((t) => [t.id, t]),
)
