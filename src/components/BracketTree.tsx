import type { Team } from '../types/worldcup'
import type { Bracket, ResolvedMatch, ResolvedSeed } from '../domain/bracket'
import { flagEmoji } from '../lib/flag'

const COL_H = 560 // 브래킷 영역 높이(px) — R32 8경기 기준

function SeedCell({
  seed,
  teamsById,
}: {
  seed: ResolvedSeed
  teamsById: Record<string, Team>
}) {
  const team = seed.kind === 'team' && seed.teamId ? teamsById[seed.teamId] : null
  const base = 'flex items-center gap-1 px-2 h-7 text-xs truncate'

  if (seed.isKorea) {
    return (
      <div className={`${base} bg-korea font-bold text-white`}>
        🇰🇷 {team?.nameKo ?? '대한민국'} <span className="ml-auto text-[10px]">한국!</span>
      </div>
    )
  }
  if (team) {
    return (
      <div className={`${base} font-medium text-slate-700`}>
        <span>{flagEmoji(team.flagCode)}</span>
        <span className="truncate">{team.nameKo}</span>
        <span className="ml-auto text-[10px] text-slate-400">3위</span>
      </div>
    )
  }
  // 라벨(조 1·2위 자리 또는 3위 미정)
  return (
    <div className={`${base} ${seed.isThird ? 'text-amber-600' : 'text-slate-400'}`}>
      {seed.isThird ? '❓' : ''} {seed.label}
    </div>
  )
}

function MatchBox({
  match,
  teamsById,
  isKorea,
}: {
  match: ResolvedMatch
  teamsById: Record<string, Team>
  isKorea: boolean
}) {
  return (
    <div
      className={`w-32 overflow-hidden rounded-md border bg-white ${
        isKorea ? 'border-korea ring-2 ring-blue-300' : 'border-slate-200'
      }`}
    >
      <SeedCell seed={match.top} teamsById={teamsById} />
      <div className="h-px bg-slate-100" />
      <SeedCell seed={match.bottom} teamsById={teamsById} />
    </div>
  )
}

// 빈 박스 컬럼 (R16 이후 라운드)
function EmptyColumn({ header, count }: { header: string; count: number }) {
  return (
    <Column header={header}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-12 w-28 rounded-md border border-slate-200 bg-slate-100/70" />
      ))}
    </Column>
  )
}

function Column({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">{header}</div>
      <div
        className="flex flex-col justify-around"
        style={{ height: COL_H }}
      >
        {children}
      </div>
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

  const matchCol = (header: string, matches: ResolvedMatch[]) => (
    <Column header={header}>
      {matches.map((m) => (
        <MatchBox
          key={m.id}
          match={m}
          teamsById={teamsById}
          isKorea={m.id === bracket.koreaMatchId}
        />
      ))}
    </Column>
  )

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">32강 대진표</h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
          예시 구조
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {koreaIn ? (
          <span className="font-medium text-korea">
            🇰🇷 한국이 진출하면 표시된 위치에 들어갑니다 (시뮬레이션에 따라 이동).
          </span>
        ) : (
          <span className="text-rose-600">현재 시뮬레이션 기준 한국은 32강에 없습니다.</span>
        )}{' '}
        조 1·2위 자리는 라벨로 표시, 3위 자리는 와일드카드 결과로 채워집니다.
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-start gap-3">
          {matchCol('R32', bracket.left)}
          <EmptyColumn header="R16" count={4} />
          <EmptyColumn header="QF" count={2} />
          <EmptyColumn header="SF" count={1} />
          <div className="flex flex-col items-center">
            <div className="mb-2 text-[11px] font-bold tracking-wide text-amber-500">FINAL</div>
            <div className="flex flex-col justify-center" style={{ height: COL_H }}>
              <div className="text-center text-3xl">🏆</div>
              <div className="mt-1 text-center text-[10px] font-semibold text-slate-400">FIFA 26</div>
            </div>
          </div>
          <EmptyColumn header="SF" count={1} />
          <EmptyColumn header="QF" count={2} />
          <EmptyColumn header="R16" count={4} />
          {matchCol('R32', bracket.right)}
        </div>
      </div>
    </section>
  )
}
