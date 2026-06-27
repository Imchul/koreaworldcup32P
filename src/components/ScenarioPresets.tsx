import type { KoreaStatusLabel } from '../types/worldcup'

export interface PresetResult {
  id: string
  name: string
  desc: string
  probPct: number
  label: KoreaStatusLabel
  koreaRank: number
  qualified: boolean
}

export function ScenarioPresets({
  results,
  activeId,
  onSelect,
  onClear,
}: {
  results: PresetResult[]
  activeId: string | null
  onSelect: (id: string) => void
  onClear: () => void
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">예상 스코어 시나리오</h2>
        {activeId && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 active:bg-slate-200"
          >
            ↺ 해제
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-slate-500">
        버튼을 누르면 6경기 예상 스코어가 적용되고, 한국 가능성·대진표가 그에 맞춰 바뀝니다.
      </p>

      <div className="space-y-2">
        {results.map((r) => {
          const active = r.id === activeId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                active
                  ? 'border-korea bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 active:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-800">{r.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    r.qualified ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {r.qualified ? '진출' : '탈락'} · {r.koreaRank}위
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{r.desc}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                결정적 3경기 조합 확률 약 {r.probPct}% · 한국 상태: {r.label}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
