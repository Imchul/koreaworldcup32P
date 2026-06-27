import { describe, it, expect } from 'vitest'
import { buildComboTable } from '../src/domain/scenarios'
import { computeWorldCupState } from '../src/domain/compute'
import { updateMatchScore } from '../src/domain/standings'
import { teams } from '../src/data/initialTeams'
import { matches } from '../src/data/matches'
import { fixedThirds } from '../src/data/fixedThirds'

describe('buildComboTable (진출 시나리오)', () => {
  const combos = buildComboTable()

  it('8가지 조합', () => {
    expect(combos).toHaveLength(8)
  })

  it('나쁜 조 0~1개면 진출, 2개 이상이면 탈락', () => {
    for (const c of combos) {
      expect(c.qualified).toBe(c.badCount <= 1)
      expect(c.koreaRank).toBe(7 + c.badCount)
    }
  })

  it('진출 가능 조합 4개 (badCount 0 또는 1)', () => {
    expect(combos.filter((c) => c.qualified)).toHaveLength(4)
  })
})

describe('confirmed 플래그 (와일드카드 표 확정/미확정)', () => {
  it('초기에는 J/K/L 3팀만 미확정', () => {
    const { rankedThirds } = computeWorldCupState(matches, teams, fixedThirds)
    expect(rankedThirds.filter((r) => !r.confirmed)).toHaveLength(3)
    expect(rankedThirds.filter((r) => r.confirmed)).toHaveLength(9)
  })

  it('결정적 경기 입력 시 해당 조 3위가 확정됨', () => {
    const ms = updateMatchScore(matches, 'L-CRO-GHA', 0, 1) // 가나 승
    const { rankedThirds } = computeWorldCupState(ms, teams, fixedThirds)
    const lThird = rankedThirds.find((r) => r.groupCode === 'L')!
    expect(lThird.confirmed).toBe(true)
    expect(rankedThirds.filter((r) => !r.confirmed)).toHaveLength(2) // K, J만 미확정
  })
})
