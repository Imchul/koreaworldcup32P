// 32강 대진표에서 이미 확정된 조 1·2위 국가.
//
// 조별리그가 끝난 A~I 9개 조의 1·2위는 확정. J·K·L은 결정적 경기 결과에 따라 미정이라 라벨로 둔다.
//
//  key = `${'winner'|'runnerup'}-${조코드}`  (예: 'winner-A' = A조 1위)

export interface ConfirmedTeam {
  nameKo: string
  nameEn: string
  flagCode: string // ISO alpha-2 소문자
}

export const bracketConfirmed: Record<string, ConfirmedTeam> = {
  // A조
  'winner-A': { nameKo: '멕시코', nameEn: 'Mexico', flagCode: 'mx' },
  'runnerup-A': { nameKo: '남아공', nameEn: 'South Africa', flagCode: 'za' },
  // B조
  'winner-B': { nameKo: '스위스', nameEn: 'Switzerland', flagCode: 'ch' },
  'runnerup-B': { nameKo: '캐나다', nameEn: 'Canada', flagCode: 'ca' },
  // C조
  'winner-C': { nameKo: '브라질', nameEn: 'Brazil', flagCode: 'br' },
  'runnerup-C': { nameKo: '모로코', nameEn: 'Morocco', flagCode: 'ma' },
  // D조
  'winner-D': { nameKo: '미국', nameEn: 'United States', flagCode: 'us' },
  'runnerup-D': { nameKo: '호주', nameEn: 'Australia', flagCode: 'au' },
  // E조
  'winner-E': { nameKo: '독일', nameEn: 'Germany', flagCode: 'de' },
  'runnerup-E': { nameKo: '코트디부아르', nameEn: 'Ivory Coast', flagCode: 'ci' },
  // F조
  'winner-F': { nameKo: '네덜란드', nameEn: 'Netherlands', flagCode: 'nl' },
  'runnerup-F': { nameKo: '일본', nameEn: 'Japan', flagCode: 'jp' },
  // G조
  'winner-G': { nameKo: '벨기에', nameEn: 'Belgium', flagCode: 'be' },
  'runnerup-G': { nameKo: '이집트', nameEn: 'Egypt', flagCode: 'eg' },
  // H조
  'winner-H': { nameKo: '스페인', nameEn: 'Spain', flagCode: 'es' },
  'runnerup-H': { nameKo: '카보베르데', nameEn: 'Cabo Verde', flagCode: 'cv' },
  // I조
  'winner-I': { nameKo: '프랑스', nameEn: 'France', flagCode: 'fr' },
  'runnerup-I': { nameKo: '노르웨이', nameEn: 'Norway', flagCode: 'no' },

  // J·K·L 1·2위는 결정적 경기 후 확정 → 채워지면 추가
}
