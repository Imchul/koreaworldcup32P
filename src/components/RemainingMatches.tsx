import type { Match, Team } from '../types/worldcup'
import { flagEmoji, formatKST } from '../lib/flag'

interface Props {
  matches: Match[]
  teamsById: Record<string, Team>
  onScore: (matchId: string, home: number | null, away: number | null) => void
  onReset: () => void
  dirty: boolean
}

function Stepper({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number) => void
}) {
  const v = value ?? 0
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, v - 1))}
        className="h-8 w-8 rounded-full bg-slate-100 text-lg font-bold text-slate-600 active:bg-slate-200"
        aria-label="감소"
      >
        −
      </button>
      <span className="w-7 text-center text-xl font-extrabold tabular-nums text-slate-800">
        {value ?? '–'}
      </span>
      <button
        type="button"
        onClick={() => onChange(v + 1)}
        className="h-8 w-8 rounded-full bg-slate-100 text-lg font-bold text-slate-600 active:bg-slate-200"
        aria-label="증가"
      >
        +
      </button>
    </div>
  )
}

export function RemainingMatches({ matches, teamsById, onScore, onReset, dirty }: Props) {
  const decisive = matches.filter((m) => m.decisive)

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">결정적 남은 경기 · 시뮬레이터</h2>
        {dirty && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 active:bg-slate-200"
          >
            ↺ 공식값으로
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-slate-500">
        점수를 바꾸면 위 순위와 한국 상태가 즉시 다시 계산됩니다. (새로고침하면 공식값 복귀)
      </p>

      <div className="space-y-3">
        {decisive.map((m) => {
          const home = teamsById[m.homeTeamId]
          const away = teamsById[m.awayTeamId]
          const entered = m.homeScore != null && m.awayScore != null
          return (
            <div key={m.id} className="rounded-xl border border-slate-100 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{m.groupCode}조</span>
                <span className="flex items-center gap-2">
                  {m.kickoffAt && <span className="text-slate-400">{formatKST(m.kickoffAt)}</span>}
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      entered ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {entered ? '입력 완료' : '예정'}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-right text-sm font-medium text-slate-800">
                  {home?.nameKo} <span className="ml-1">{flagEmoji(home?.flagCode ?? 'xx')}</span>
                </div>
                <Stepper value={m.homeScore} onChange={(v) => onScore(m.id, v, m.awayScore ?? 0)} />
                <span className="text-slate-300">:</span>
                <Stepper value={m.awayScore} onChange={(v) => onScore(m.id, m.homeScore ?? 0, v)} />
                <div className="flex-1 text-left text-sm font-medium text-slate-800">
                  <span className="mr-1">{flagEmoji(away?.flagCode ?? 'xx')}</span> {away?.nameKo}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
