// ISO 3166-1 alpha-2 코드(소문자) → 이모지 국기 변환
export function flagEmoji(code: string): string {
  const cc = code.trim().toLowerCase()
  if (cc.length !== 2) return '🏳️'
  const base = 0x1f1e6
  return String.fromCodePoint(
    base + (cc.charCodeAt(0) - 97),
    base + (cc.charCodeAt(1) - 97),
  )
}

// 한국시간(KST) 표기로 변환
export function formatKST(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(d)
}
