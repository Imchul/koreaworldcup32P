import { describe, it, expect } from 'vitest'
import { buildComboTable, computeQualifyProbability } from '../src/domain/scenarios'
import { computeWorldCupState } from '../src/domain/compute'
import { updateMatchScore } from '../src/domain/standings'
import { teams } from '../src/data/initialTeams'
import { matches } from '../src/data/matches'
import { fixedThirds } from '../src/data/fixedThirds'
import { scenarioPresets } from '../src/data/scenarioPresets'
import type { Match } from '../src/types/worldcup'

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

  it('조합 확률 합은 100%', () => {
    const total = combos.reduce((a, c) => a + c.probPct, 0)
    expect(Math.round(total)).toBe(100)
  })
})

describe('computeQualifyProbability', () => {
  it('진출 = p0 + p1, 합 100%', () => {
    const o = computeQualifyProbability()
    expect(o.qualify).toBeCloseTo(o.p0 + o.p1, 1)
    expect(Math.round(o.qualify + o.pOut)).toBe(100)
    expect(o.qualify).toBeGreaterThan(0)
    expect(o.qualify).toBeLessThan(100)
  })
})

describe('scenarioPresets — 버튼별 한국 결과', () => {
  function apply(scores: Record<string, [number, number]>): Match[] {
    let ms = matches
    for (const [id, [h, a]] of Object.entries(scores)) ms = updateMatchScore(ms, id, h, a)
    return ms
  }
  const outcome = (id: string) => {
    const p = scenarioPresets.find((x) => x.id === id)!
    return computeWorldCupState(apply(p.scores), teams, fixedThirds).koreaStatus
  }

  it('S1 가장 유력 → 탈락(10위)', () => {
    const s = outcome('S1')
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(10)
  })
  it('S2 한국 생존 → 진출(7위)', () => {
    const s = outcome('S2')
    expect(s.qualified).toBe(true)
    expect(s.koreaRank).toBe(7)
  })
  it('S3 아슬아슬 진출 → 진출(8위)', () => {
    const s = outcome('S3')
    expect(s.qualified).toBe(true)
    expect(s.koreaRank).toBe(8)
  })
  it('S4 최상 → 진출(7위)', () => {
    expect(outcome('S4').koreaRank).toBe(7)
  })
  it('S5 한 끗 차 탈락 → 탈락(9위)', () => {
    const s = outcome('S5')
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(9)
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
