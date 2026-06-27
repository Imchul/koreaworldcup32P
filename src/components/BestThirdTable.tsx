import type { Team, ThirdRow } from '../types/worldcup'
import { KOREA_TEAM_ID } from '../data/initialTeams'
import { flagEmoji } from '../lib/flag'

export function BestThirdTable({
  rows,
  teamsById,
}: {
  rows: ThirdRow[]
  teamsById: Record<string, Team>
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-1 text-base font-bold text-slate-800">12개 조 3위 와일드카드 순위</h2>
      <p className="mb-3 text-xs text-slate-500">
        상위 <b className="text-emerald-600">8팀</b>이 32강 진출. 점선이 8위↔9위 컷라인.
      </p>

      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-2 py-2 text-left font-medium">#</th>
              <th className="px-2 py-2 text-left font-medium">팀</th>
              <th className="px-1 py-2 text-center font-medium">조</th>
              <th className="px-1 py-2 text-center font-medium">승점</th>
              <th className="px-1 py-2 text-center font-medium">득실</th>
              <th className="px-1 py-2 text-center font-medium">득점</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isKorea = r.teamId === KOREA_TEAM_ID
              const t = teamsById[r.teamId]
              const cutlineAfter = i === 7 // 8위 행 아래 컷라인
              return (
                <tr
                  key={r.teamId}
                  className={[
                    'border-t border-slate-100',
                    isKorea ? 'bg-blue-50 font-bold text-korea' : 'text-slate-700',
                    cutlineAfter ? 'border-b-2 border-dashed border-emerald-400' : '',
                  ].join(' ')}
                >
                  <td className="px-2 py-2">
                    <span className={r.aboveCutline ? 'text-emerald-600' : 'text-slate-400'}>
                      {r.rank}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="mr-1">{flagEmoji(t?.flagCode ?? 'xx')}</span>
                    {t?.nameKo ?? r.teamId}
                    {isKorea && <span className="ml-1 text-xs">← 한국</span>}
                  </td>
                  <td className="px-1 py-2 text-center text-slate-500">{r.groupCode}</td>
                  <td className="px-1 py-2 text-center font-semibold">{r.points}</td>
                  <td className="px-1 py-2 text-center">
                    {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
                  </td>
                  <td className="px-1 py-2 text-center">{r.goalsFor}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
