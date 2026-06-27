import type { Team } from '../types/worldcup'
import type { Bracket } from '../domain/bracket'
import { flagEmoji } from '../lib/flag'

export function BracketPreview({
  bracket,
  teamsById,
}: {
  bracket: Bracket
  teamsById: Record<string, Team>
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-1 text-base font-bold text-slate-800">32강 대진표 (3위 진출 슬롯)</h2>
      <p className="mb-3 text-xs text-slate-500">
        진출한 8개 조 3위가 들어가는 자리.{' '}
        {bracket.exact ? (
          <span className="text-emerald-600">Annexe C 공식 배정</span>
        ) : (
          <span className="text-amber-600">근사 배정 (공식 표 입력 전 임시)</span>
        )}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {bracket.slots.map((slot) => {
          const t = slot.third ? teamsById[slot.third.teamId] : null
          return (
            <div
              key={slot.matchId}
              className={`rounded-xl border p-3 text-sm ${
                slot.isKorea
                  ? 'border-korea bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="text-xs text-slate-500">{slot.opponentLabel} vs 3위</div>
              <div className={`mt-1 font-bold ${slot.isKorea ? 'text-korea' : 'text-slate-700'}`}>
                {t ? (
                  <>
                    {flagEmoji(t.flagCode)} {t.nameKo}
                    {slot.isKorea && <span className="ml-1">🇰🇷 한국!</span>}
                  </>
                ) : (
                  <span className="text-slate-400">미정</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
