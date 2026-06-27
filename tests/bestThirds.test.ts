import { describe, it, expect } from 'vitest'
import { computeGroupStandings } from '../src/domain/standings'
import { getThirdPlacedTeams, rankBestThirds } from '../src/domain/bestThirds'
import { teams, teamsById } from '../src/data/initialTeams'
import { matches } from '../src/data/matches'
import { fixedThirds } from '../src/data/fixedThirds'

function rankNow(ms = matches) {
  const st = computeGroupStandings(ms, teams)
  const thirds = getThirdPlacedTeams(st, fixedThirds)
  return rankBestThirds(thirds, teamsById)
}

describe('rankBestThirds', () => {
  it('항상 12개 조 3위 행을 만든다', () => {
    expect(rankNow()).toHaveLength(12)
  })

  it('상위 8위만 aboveCutline=true (컷라인)', () => {
    const ranked = rankNow()
    expect(ranked.filter((r) => r.aboveCutline)).toHaveLength(8)
    expect(ranked[7].aboveCutline).toBe(true)
    expect(ranked[8].aboveCutline).toBe(false)
  })

  it('순위는 승점 → 골득실 → 다득점 내림차순', () => {
    const ranked = rankNow()
    const notDescending = (a: number[], b: number[]) => {
      // a가 b보다 상위여야 함: 첫 다른 키에서 a < b 면 위반
      for (let k = 0; k < a.length; k++) {
        if (a[k] !== b[k]) return a[k] < b[k]
      }
      return false
    }
    for (let i = 1; i < ranked.length; i++) {
      const a = ranked[i - 1]
      const b = ranked[i]
      expect(
        notDescending(
          [a.points, a.goalDifference, a.goalsFor],
          [b.points, b.goalDifference, b.goalsFor],
        ),
      ).toBe(false)
    }
  })

  it('초기 상태에서 한국은 8위 이내(진출권)', () => {
    const korea = rankNow().find((r) => r.teamId === 'KOR')!
    expect(korea.aboveCutline).toBe(true)
    expect(korea.rank).toBeLessThanOrEqual(8)
  })
})
