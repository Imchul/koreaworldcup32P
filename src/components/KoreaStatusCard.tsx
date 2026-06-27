import type { KoreaStatus, KoreaStatusLabel } from '../types/worldcup'

const STYLE: Record<KoreaStatusLabel, { bg: string; ring: string; emoji: string }> = {
  '진출 확정': { bg: 'bg-emerald-600', ring: 'ring-emerald-300', emoji: '🎉' },
  '현재 진출권': { bg: 'bg-blue-600', ring: 'ring-blue-300', emoji: '🙂' },
  '아직 불확실': { bg: 'bg-amber-500', ring: 'ring-amber-300', emoji: '⏳' },
  '탈락 위험': { bg: 'bg-orange-600', ring: 'ring-orange-300', emoji: '⚠️' },
  '탈락 확정': { bg: 'bg-rose-700', ring: 'ring-rose-300', emoji: '😢' },
}

const WATCH_STYLE = {
  pending: 'bg-slate-100 text-slate-600 border-slate-200',
  good_for_korea: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  bad_for_korea: 'bg-rose-50 text-rose-700 border-rose-200',
} as const

export function KoreaStatusCard({ status }: { status: KoreaStatus }) {
  const s = STYLE[status.label]
  return (
    <section className={`rounded-2xl text-white shadow-lg ${s.bg} ring-4 ${s.ring} p-5`}>
      <div className="flex items-center gap-2 text-sm font-medium opacity-90">
        <span>🇰🇷 대한민국 32강 진출</span>
      </div>

      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-4xl font-extrabold tracking-tight">{s.emoji} {status.label}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span>와일드카드 예상 순위 <b className="text-lg">{status.koreaRank}위</b> / 12</span>
        <span>컷라인 8위 {status.qualified ? '이내 ✓' : '밖 ✗'}</span>
      </div>

      <p className="mt-2 text-sm opacity-90">{status.reason}</p>

      <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        {status.watchGroups.map((w) => (
          <div
            key={w.group}
            className={`rounded-lg border px-3 py-2 text-xs font-medium ${WATCH_STYLE[w.status]}`}
          >
            {w.reason}
          </div>
        ))}
      </div>
    </section>
  )
}
