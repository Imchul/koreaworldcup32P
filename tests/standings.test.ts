import { describe, it, expect } from 'vitest'
import { computeGroupStandings, updateMatchScore } from '../src/domain/standings'
import { teams } from '../src/data/initialTeams'
import { matches } from '../src/data/matches'

describe('computeGroupStandings', () => {
  const st = computeGroupStandings(matches, teams)

  it('J조 현재 순위: ARG 6 / AUT 3·GD0 / ALG 3·GD-2 / JOR 0', () => {
    const j = st.J.map((r) => ({ id: r.teamId, pts: r.points, gd: r.goalDifference }))
    expect(j[0]).toMatchObject({ id: 'ARG', pts: 6 })
    expect(j[1]).toMatchObject({ id: 'AUT', pts: 3, gd: 0 })
    expect(j[2]).toMatchObject({ id: 'ALG', pts: 3, gd: -2 })
    expect(j[3]).toMatchObject({ id: 'JOR', pts: 0 })
  })

  it('K조 현재 순위: COL 6 / POR 4 / COD 1·GD-1 / UZB 0·GD-7', () => {
    const k = st.K.map((r) => ({ id: r.teamId, pts: r.points, gd: r.goalDifference }))
    expect(k[0]).toMatchObject({ id: 'COL', pts: 6 })
    expect(k[1]).toMatchObject({ id: 'POR', pts: 4 })
    expect(k[2]).toMatchObject({ id: 'COD', pts: 1, gd: -1 })
    expect(k[3]).toMatchObject({ id: 'UZB', pts: 0, gd: -7 })
  })

  it('L조 최종 순위: ENG 7 / CRO 6 / GHA 4(3위) / PAN 0', () => {
    const l = st.L
    expect(l[0]).toMatchObject({ teamId: 'ENG', points: 7 })
    expect(l[1]).toMatchObject({ teamId: 'CRO', points: 6 })
    expect(l[2]).toMatchObject({ teamId: 'GHA', points: 4, goalDifference: 1 })
    expect(l[3].teamId).toBe('PAN')
  })

  it('한국(A조)은 경기 데이터가 없어 0경기로만 잡힌다 (3위는 fixedThirds가 담당)', () => {
    expect(st.A).toHaveLength(1)
    expect(st.A[0]).toMatchObject({ teamId: 'KOR', played: 0 })
  })
})

describe('updateMatchScore', () => {
  it('두 점수가 채워지면 finished, 불변 갱신', () => {
    const next = updateMatchScore(matches, 'K-COD-UZB', 0, 1)
    const m = next.find((x) => x.id === 'K-COD-UZB')!
    expect(m).toMatchObject({ homeScore: 0, awayScore: 1, status: 'finished' })
    // 원본 불변 (K-COD-UZB는 공식값에서 아직 미정)
    expect(matches.find((x) => x.id === 'K-COD-UZB')!.status).toBe('scheduled')
  })

  it('한쪽이 null이면 scheduled', () => {
    const next = updateMatchScore(matches, 'K-COD-UZB', 1, null)
    expect(next.find((x) => x.id === 'K-COD-UZB')!.status).toBe('scheduled')
  })
})
