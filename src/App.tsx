import { useMemo, useState } from 'react'
import type { Match } from './types/worldcup'
import { teams, teamsById } from './data/initialTeams'
import { matches as officialMatches, lastUpdated } from './data/matches'
import { fixedThirds } from './data/fixedThirds'
import { computeWorldCupState } from './domain/compute'
import { updateMatchScore } from './domain/standings'
import { KoreaStatusCard } from './components/KoreaStatusCard'
import { BestThirdTable } from './components/BestThirdTable'
import { RemainingMatches } from './components/RemainingMatches'
import { BracketPreview } from './components/BracketPreview'
import { formatKST } from './lib/flag'

export default function App() {
  // 기본값 = 코드의 공식 경기 결과. 시뮬레이터로 바꾸면 이 state만 갱신.
  const [matches, setMatches] = useState<Match[]>(officialMatches)
  const dirty = matches !== officialMatches

  const state = useMemo(
    () => computeWorldCupState(matches, teams, fixedThirds),
    [matches],
  )

  const handleScore = (id: string, home: number | null, away: number | null) =>
    setMatches((ms) => updateMatchScore(ms, id, home, away))

  const handleReset = () => setMatches(officialMatches)

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm px-3 pb-12 pt-4">
      <header className="mb-4">
        <h1 className="text-xl font-extrabold text-slate-900">
          🇰🇷 대한민국 월드컵 32강 진출 가능성
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          2026 월드컵 · 조 3위 와일드카드 순위 시뮬레이터 · 마지막 공식 갱신{' '}
          {formatKST(lastUpdated)}
          {dirty && <span className="ml-1 font-medium text-amber-600">· 시뮬레이션 중</span>}
        </p>
      </header>

      <main className="space-y-4">
        <KoreaStatusCard status={state.koreaStatus} />
        <RemainingMatches
          matches={matches}
          teamsById={teamsById}
          onScore={handleScore}
          onReset={handleReset}
          dirty={dirty}
        />
        <BestThirdTable rows={state.rankedThirds} teamsById={teamsById} />
        <BracketPreview bracket={state.bracket} teamsById={teamsById} />
      </main>

      <footer className="mt-8 text-center text-[11px] leading-relaxed text-slate-400">
        <p>
          동률은 승점 → 골득실 → 다득점 순(MVP). 조 내 head-to-head 및 일부 확정 3위 스탯은
          공식 순위표 기준으로 추후 보정.
        </p>
        <p className="mt-1">데이터·UI는 참고용이며 FIFA 공식 결과와 다를 수 있습니다.</p>
      </footer>
    </div>
  )
}
