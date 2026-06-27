import {
  GROUP_SCENARIOS,
  GROUP_PROBS,
  QUALIFICATION_RULE,
  buildComboTable,
  computeQualifyProbability,
} from '../domain/scenarios'

export function ScenarioModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  const combos = buildComboTable()
  const odds = computeQualifyProbability()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-screen-sm overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">🇰🇷 한국 진출 시나리오</h2>
            <p className="mt-0.5 text-xs text-slate-500">어떤 결과가 나오면 한국이 32강에 가는가</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 active:bg-slate-200"
          >
            닫기 ✕
          </button>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-sm text-slate-700">
          <b className="text-korea">진출 규칙</b> · {QUALIFICATION_RULE}
        </div>

        {/* 진출 확률 요약 */}
        <div className="mt-3 rounded-xl border border-slate-100 p-3">
          <div className="flex items-end justify-between">
            <span className="text-sm font-bold text-slate-800">예상 진출 확률</span>
            <span className="text-2xl font-extrabold text-korea">{odds.qualify}%</span>
          </div>
          <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
            <div className="bg-emerald-500" style={{ width: `${odds.p0}%` }} title="7위" />
            <div className="bg-emerald-300" style={{ width: `${odds.p1}%` }} title="8위" />
            <div className="bg-rose-400" style={{ width: `${odds.pOut}%` }} title="탈락" />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-slate-500">
            <span>7위 진출 {odds.p0}%</span>
            <span>8위 진출 {odds.p1}%</span>
            <span className="text-rose-500">탈락(9위↓) {odds.pOut}%</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px]">
            {GROUP_PROBS.map((g) => (
              <div key={g.group} className="rounded-lg bg-slate-50 px-2 py-1.5 text-center">
                <div className="font-bold text-slate-700">{g.group}조</div>
                <div className="text-emerald-600">유리 {g.goodPct}%</div>
                <div className="text-rose-500">불리 {g.badPct}%</div>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            참고 이미지 승률 + 분석 매핑 기반 근사치. 정확한 확률은 스코어 분포에 따라 달라집니다.
          </p>
        </div>

        <h3 className="mt-4 mb-2 text-sm font-bold text-slate-800">조별 핵심 변수</h3>
        <div className="space-y-2">
          {GROUP_SCENARIOS.map((g) => (
            <div key={g.group} className="rounded-xl border border-slate-100 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {g.group}조 · {g.match}
                </span>
                <span className="text-[11px] text-slate-400">{g.kickoffKo}</span>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <span className="mt-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  좋음
                </span>
                <span className="text-slate-700">{g.good}</span>
              </div>
              <div className="mt-1 flex items-start gap-2">
                <span className="mt-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  나쁨
                </span>
                <span className="text-slate-700">{g.bad}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-4 mb-2 text-sm font-bold text-slate-800">8가지 조합별 결과</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="whitespace-nowrap bg-slate-50 text-[11px] text-slate-500">
                <th className="px-1 py-2 font-medium">L조</th>
                <th className="px-1 py-2 font-medium">K조</th>
                <th className="px-1 py-2 font-medium">J조</th>
                <th className="px-1 py-2 font-medium">확률</th>
                <th className="px-1 py-2 font-medium">순위</th>
                <th className="px-1 py-2 font-medium">결과</th>
              </tr>
            </thead>
            <tbody>
              {combos.map((c, i) => (
                <tr
                  key={i}
                  className={`border-t border-slate-100 text-center ${
                    c.qualified ? 'bg-emerald-50/40' : 'bg-rose-50/40'
                  }`}
                >
                  <Cell s={c.L} />
                  <Cell s={c.K} />
                  <Cell s={c.J} />
                  <td className="px-1 py-2 text-slate-500">{c.probPct}%</td>
                  <td className="px-1 py-2 font-semibold text-slate-700">{c.koreaRank}위</td>
                  <td className="whitespace-nowrap px-1 py-2">
                    {c.qualified ? (
                      <span className="font-bold text-emerald-600">진출 ✓</span>
                    ) : (
                      <span className="font-bold text-rose-600">탈락 ✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          "좋음" = 그 조에서 한국보다 좋은 3위가 나오지 않음. 위험 3조 중 2조 이상에서 한국보다 좋은
          3위가 나오면 한국은 9위로 밀려 탈락합니다.
        </p>
      </div>
    </div>
  )
}

function Cell({ s }: { s: 'good' | 'bad' }) {
  return (
    <td className="px-1 py-2">
      <span
        className={`inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-bold ${
          s === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}
      >
        {s === 'good' ? '좋음' : '나쁨'}
      </span>
    </td>
  )
}
