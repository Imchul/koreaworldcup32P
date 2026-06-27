import type { Team } from '../types/worldcup'
import type { Bracket, ResolvedMatch, ResolvedSeed } from '../domain/bracket'
import { flagEmoji } from '../lib/flag'

function SeedCell({
  seed,
  teamsById,
}: {
  seed: ResolvedSeed
  teamsById: Record<string, Team>
}) {
  const team = seed.kind === 'team' && seed.teamId ? teamsById[seed.teamId] : null
  const base = 'flex items-center gap-2 px-2.5 h-9 text-sm'

  if (seed.isKorea) {
    return (
      <div className={`${base} bg-korea font-bold text-white`}>
        <span>🇰🇷</span>
        <span>{team?.nameKo ?? '대한민국'}</span>
        <span className="ml-auto text-[10px]">3위 · 한국!</span>
      </div>
    )
  }
  if (team) {
    return (
      <div className={`${base} font-medium text-slate-700`}>
        <span>{flagEmoji(team.flagCode)}</span>
        <span>{team.nameKo}</span>
        <span className="ml-auto text-[10px] text-slate-400">{seed.groupCode}조 3위</span>
      </div>
    )
  }
  if (seed.kind === 'confirmed' && seed.confirmed) {
    return (
      <div className={`${base} font-medium text-slate-700`}>
        <span>{flagEmoji(seed.confirmed.flagCode)}</span>
        <span>{seed.confirmed.nameKo}</span>
        <span className="ml-auto text-[10px] text-slate-400">{seed.label.slice(-2)}</span>
      </div>
    )
  }
  // 미확정 자리 (J·K·L 1·2위, 또는 3위 미정)
  return (
    <div className={`${base} ${seed.isThird ? 'text-amber-600' : 'text-slate-400'}`}>
      <span>{seed.isThird ? '❓' : '⏳'}</span>
      <span>{seed.label}</span>
    </div>
  )
}

function MatchCard({
  match,
  index,
  teamsById,
}: {
  match: ResolvedMatch
  index: number
  teamsById: Record<string, Team>
}) {
  const isKorea = match.top.isKorea || match.bottom.isKorea
  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        isKorea ? 'border-korea ring-2 ring-blue-300' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
        <span>{index + 1}경기</span>
        <span>{match.id}</span>
      </div>
      <SeedCell seed={match.top} teamsById={teamsById} />
      <div className="flex items-center">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="px-2 text-[10px] font-bold text-slate-300">VS</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      <SeedCell seed={match.bottom} teamsById={teamsById} />
    </div>
  )
}

export function BracketTree({
  bracket,
  teamsById,
}: {
  bracket: Bracket
  teamsById: Record<string, Team>
}) {
  const koreaIn = bracket.koreaMatchId != null
  const all = [...bracket.left, ...bracket.right] // 16경기 전체

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">32강 대진표 (16경기)</h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
          3위 배정 예시
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {koreaIn ? (
          <span className="font-medium text-korea">
            🇰🇷 한국이 진출하면 강조된 경기에 들어갑니다 (시뮬레이션에 따라 이동).
          </span>
        ) : (
          <span className="text-rose-600">현재 시뮬레이션 기준 한국은 32강에 없습니다.</span>
        )}{' '}
        A~I조 1·2위는 확정, J·K·L 1·2위와 3위는 결과에 따라 채워집니다.
      </p>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {all.map((m, i) => (
          <MatchCard key={m.id} match={m} index={i} teamsById={teamsById} />
        ))}
      </div>
    </section>
  )
}
