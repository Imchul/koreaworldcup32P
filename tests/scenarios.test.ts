import { describe, it, expect } from 'vitest'
import {
  buildComboTable,
  computeQualifyProbability,
  resolvedFromWatch,
} from '../src/domain/scenarios'
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

describe('buildComboTable — 확정 조 반영(resolved)', () => {
  it('현재 공식값: L·K 모두 bad 확정, J만 미정 → 진출 확률 0%', () => {
    const { koreaStatus } = computeWorldCupState(matches, teams, fixedThirds)
    const resolved = resolvedFromWatch(koreaStatus.watchGroups)
    expect(resolved.L).toBe('bad')
    expect(resolved.K).toBe('bad')
    expect(resolved.J).toBeUndefined() // 미정이지만 결과와 무관
    expect(computeQualifyProbability(resolved).qualify).toBe(0)
  })

  it('L조 bad 고정 시 남은 K·J만 변수 → 4조합, 모두 L=bad', () => {
    const combos = buildComboTable({ L: 'bad' })
    expect(combos).toHaveLength(4)
    expect(combos.every((c) => c.L === 'bad')).toBe(true)
    expect(Math.round(combos.reduce((a, c) => a + c.probPct, 0))).toBe(100)
  })

  it('L조 bad면 7위(badCount 0) 조합은 사라지고 8위가 최선', () => {
    const odds = computeQualifyProbability({ L: 'bad' })
    expect(odds.p0).toBe(0) // 7위 불가
    expect(odds.qualify).toBeCloseTo(odds.p1, 1) // 진출 = 8위뿐
    expect(Math.round(odds.qualify + odds.pOut)).toBe(100)
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

  it('S1 유일한 진출 경로(K·J 모두 유리) → 진출(8위)', () => {
    const s = outcome('S1')
    expect(s.qualified).toBe(true)
    expect(s.koreaRank).toBe(8)
  })
  it('S2 J조에서 무너짐 → 탈락(9위)', () => {
    const s = outcome('S2')
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(9)
  })
  it('S3 K조에서 무너짐 → 탈락(9위)', () => {
    const s = outcome('S3')
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(9)
  })
  it('S4 최악(K·J 모두 불리) → 탈락(10위)', () => {
    const s = outcome('S4')
    expect(s.qualified).toBe(false)
    expect(s.koreaRank).toBe(10)
  })
})

describe('confirmed 플래그 (와일드카드 표 확정/미확정)', () => {
  it('현재 J 1팀만 미확정 (L·K조 종료)', () => {
    const { rankedThirds } = computeWorldCupState(matches, teams, fixedThirds)
    expect(rankedThirds.filter((r) => !r.confirmed)).toHaveLength(1)
    expect(rankedThirds.filter((r) => r.confirmed)).toHaveLength(11)
  })

  it('결정적 경기 입력 시 해당 조 3위가 확정됨', () => {
    const ms = updateMatchScore(matches, 'J-ALG-AUT', 0, 1) // 오스트리아 승
    const { rankedThirds } = computeWorldCupState(ms, teams, fixedThirds)
    const jThird = rankedThirds.find((r) => r.groupCode === 'J')!
    expect(jThird.confirmed).toBe(true)
    expect(rankedThirds.filter((r) => !r.confirmed)).toHaveLength(0) // 전 조 종료
  })
})
