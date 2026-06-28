import { describe, it, expect } from 'vitest'
import { computeWorldCupState } from '../src/domain/compute'
import { updateMatchScore } from '../src/domain/standings'
import { teams } from '../src/data/initialTeams'
import { matches } from '../src/data/matches'
import { fixedThirds } from '../src/data/fixedThirds'
import type { Match } from '../src/types/worldcup'

// 결정적 경기 ID
const L = 'L-CRO-GHA' // 크로아티아(home) vs 가나(away)
const K = 'K-COD-UZB' // DR콩고(home) vs 우즈베키스탄(away)
const J = 'J-ALG-AUT' // 알제리(home) vs 오스트리아(away)

function withResults(results: Array<[string, number, number]>): Match[] {
  let ms = matches
  for (const [id, h, a] of results) ms = updateMatchScore(ms, id, h, a)
  return ms
}

function status(ms: Match[]) {
  return computeWorldCupState(ms, teams, fixedThirds).koreaStatus
}

describe('getKoreaStatus — 분석 시나리오', () => {
  it('현재 공식값(L·K 종료·J 미정): 한국 9위 탈락 확정', () => {
    const s = status(matches)
    expect(s.badCount).toBe(2) // L조 가나 + K조 DR콩고가 한국보다 좋은 3위
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(9)
    expect(s.label).toBe('탈락 확정') // J 결과와 무관
  })

  it('최상 시나리오(가나 승·DRC 무·오스트리아 승) → bad 0 → 진출 확정 7위', () => {
    // L: 가나 승(크로 0-1), K: DRC 무(0-0), J: 오스트리아 승(알제리 0-1)
    const s = status(withResults([[L, 0, 1], [K, 0, 0], [J, 0, 1]]))
    expect(s.badCount).toBe(0)
    expect(s.label).toBe('진출 확정')
    expect(s.koreaRank).toBe(7)
  })

  it('한 조만 나쁨(크로아티아 무) → bad 1 → 진출 확정 8위', () => {
    const s = status(withResults([[L, 1, 1], [K, 0, 0], [J, 0, 1]]))
    expect(s.badCount).toBe(1)
    expect(s.qualified).toBe(true)
    expect(s.koreaRank).toBe(8)
    expect(s.label).toBe('진출 확정')
  })

  it('두 조 나쁨(크로아티아 무 + DRC 승) → bad 2 → 탈락 확정 9위', () => {
    const s = status(withResults([[L, 1, 1], [K, 1, 0], [J, 0, 1]]))
    expect(s.badCount).toBe(2)
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(9)
    expect(s.label).toBe('탈락 확정')
  })

  it('두 조 확정 나쁨이면 J 미정이어도 탈락 확정', () => {
    const s = status(withResults([[L, 1, 1], [K, 1, 0]])) // J 미정
    expect(s.badCount).toBe(2)
    expect(s.label).toBe('탈락 확정')
  })

  it('우즈벡 6골차 이변(0-6) → K조 나쁨', () => {
    const s = status(withResults([[K, 0, 6]]))
    const k = s.watchGroups.find((w) => w.group === 'K')!
    expect(k.status).toBe('bad_for_korea')
  })

  it('우즈벡 5골차(0-5) → K조 좋음', () => {
    const s = status(withResults([[K, 0, 5]]))
    const k = s.watchGroups.find((w) => w.group === 'K')!
    expect(k.status).toBe('good_for_korea')
  })

  it('알제리 1골차 승이라도 오스트리아 득점 많으면(3-2) J조 나쁨', () => {
    const s = status(withResults([[J, 3, 2]]))
    const j = s.watchGroups.find((w) => w.group === 'J')!
    expect(j.status).toBe('bad_for_korea')
  })

  it('알제리 2골차 승(2-0) → J조 좋음', () => {
    const s = status(withResults([[J, 2, 0]]))
    const j = s.watchGroups.find((w) => w.group === 'J')!
    expect(j.status).toBe('good_for_korea')
  })

  it('크로아티아 승(2-0) → L조 나쁨(3위 최소 4점)', () => {
    const s = status(withResults([[L, 2, 0]]))
    const l = s.watchGroups.find((w) => w.group === 'L')!
    expect(l.status).toBe('bad_for_korea')
  })
})
