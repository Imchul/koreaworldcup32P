import { useMemo, useState } from 'react'
import type { Match } from './types/worldcup'
import { teams, teamsById } from './data/initialTeams'
import { matches as officialMatches, lastUpdated } from './data/matches'
import { fixedThirds } from './data/fixedThirds'
import { scenarioPresets } from './data/scenarioPresets'
import { computeWorldCupState } from './domain/compute'
import { updateMatchScore } from './domain/standings'
import { KoreaStatusCard } from './components/KoreaStatusCard'
import { BestThirdTable } from './components/BestThirdTable'
import { RemainingMatches } from './components/RemainingMatches'
import { BracketTree } from './components/BracketTree'
import { ScenarioModal } from './components/ScenarioModal'
import { ScenarioPresets, type PresetResult } from './components/ScenarioPresets'
import { formatKST } from './lib/flag'

// 예상 스코어를 공식 경기에 적용한 matches 생성
function applyScores(scores: Record<string, [number, number]>): Match[] {
  let ms = officialMatches
  for (const [id, [h, a]] of Object.entries(scores)) ms = updateMatchScore(ms, id, h, a)
  return ms
}

export default function App() {
  // 기본값 = 코드의 공식 경기 결과. 시뮬레이터/시나리오로 바꾸면 이 state만 갱신.
  const [matches, setMatches] = useState<Match[]>(officialMatches)
  const [scenarioOpen, setScenarioOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const dirty = matches !== officialMatches

  const state = useMemo(
    () => computeWorldCupState(matches, teams, fixedThirds),
    [matches],
  )

  // 시나리오 버튼별 한국 결과 미리 계산 (현재 시뮬레이션과 무관, 1회 계산)
  const presetResults = useMemo<PresetResult[]>(
    () =>
      scenarioPresets.map((p) => {
        const s = computeWorldCupState(applyScores(p.scores), teams, fixedThirds).koreaStatus
        return {
          id: p.id,
          name: p.name,
          desc: p.desc,
          probPct: p.probPct,
          label: s.label,
          koreaRank: s.koreaRank,
          qualified: s.qualified,
        }
      }),
    [],
  )

  const handleScore = (id: string, home: number | null, away: number | null) => {
    setMatches((ms) => updateMatchScore(ms, id, home, away))
    setActivePreset(null) // 수동 수정 시 시나리오 선택 해제
  }

  const handleReset = () => {
    setMatches(officialMatches)
    setActivePreset(null)
  }

  const handleSelectPreset = (id: string) => {
    const p = scenarioPresets.find((x) => x.id === id)
    if (!p) return
    setMatches(applyScores(p.scores))
    setActivePreset(id)
  }

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

      <button
        type="button"
        onClick={() => setScenarioOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow active:bg-slate-700"
      >
        📊 한국 진출 확률 · 경우의 수 표 보기
      </button>

      <main className="space-y-4">
        <KoreaStatusCard status={state.koreaStatus} />
        <ScenarioPresets
          results={presetResults}
          activeId={activePreset}
          onSelect={handleSelectPreset}
          onClear={handleReset}
        />
        <RemainingMatches
          matches={matches}
          teamsById={teamsById}
          onScore={handleScore}
          onReset={handleReset}
          dirty={dirty}
        />
        <BestThirdTable rows={state.rankedThirds} teamsById={teamsById} />
        <BracketTree bracket={state.bracket} teamsById={teamsById} />
      </main>

      <ScenarioModal open={scenarioOpen} onClose={() => setScenarioOpen(false)} />

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
