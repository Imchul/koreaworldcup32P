// 32강 대진표에서 이미 확정된 조 1·2위 국가.
//
// ⚠️ 조별리그 최종 순위가 확정되는 대로 여기에 채워 넣으면, 대진표의 해당 자리가
//    라벨('A조 1위') 대신 실제 국기·국가명으로 표시된다.
//
//  key = `${'winner'|'runnerup'}-${조코드}`  (예: 'winner-A' = A조 1위)

export interface ConfirmedTeam {
  nameKo: string
  nameEn: string
  flagCode: string // ISO alpha-2 소문자
}

export const bracketConfirmed: Record<string, ConfirmedTeam> = {
  // 사용자 제공 예시: A조 1위 멕시코 확정
  'winner-A': { nameKo: '멕시코', nameEn: 'Mexico', flagCode: 'mx' },

  // TODO: 최종 순위 확정 시 추가. 예)
  // 'runnerup-A': { nameKo: '...', nameEn: '...', flagCode: '..' },
  // 'winner-J': { nameKo: '아르헨티나', nameEn: 'Argentina', flagCode: 'ar' },
}
