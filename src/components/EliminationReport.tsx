import type { KoreaStatus } from '../types/worldcup'

// 최종 탈락 확정 리포트.
// L조(가나)·K조(DR콩고) 두 곳에서 한국보다 좋은 3위가 나와 위험 2조가 확정되면서
// 한국은 와일드카드 9위로 밀려 32강 진출이 무산됐다. (J조 결과와 무관)
//
// ▶ koreaStatus.label === '탈락 확정'일 때만 노출된다.
export function EliminationReport({ status }: { status: KoreaStatus }) {
  if (status.label !== '탈락 확정') return null

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-rose-300 bg-white shadow-lg">
      <div className="bg-rose-700 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">최종 리포트</p>
        <h2 className="mt-0.5 text-2xl font-extrabold">😢 대한민국 32강 진출 실패 · 탈락 확정</h2>
        <p className="mt-1 text-sm opacity-90">
          와일드카드 최종 {status.koreaRank}위 — 컷라인(8위) 밖. J조 결과와 무관하게 탈락이 확정됐습니다.
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
          <b className="text-rose-700">어떻게 됐나</b> · 마지막 변수였던 세 조 중{' '}
          <b>L조에서 가나(2위 크로아티아에 1-2 패배에도 4점)</b>, <b>K조에서 DR콩고(우즈벡 3-1 승, 4점)</b>가
          각각 한국(3점)보다 좋은 3위로 올라섰습니다. 한국보다 위에 선 3위가 위험 2조에서 나오면서, 한국은
          12개 조 3위 와일드카드 순위에서 9위로 밀려 상위 8팀 컷라인 밖으로 떨어졌습니다.
        </div>

        <div className="rounded-xl border-l-4 border-rose-600 bg-slate-50 p-4">
          <h3 className="text-base font-extrabold text-slate-900">이번 탈락은 홍명보 감독의 책임이다</h3>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
            <p>
              한국은 자력 진출에 실패해 마지막까지 <b>다른 팀의 결과에 운명을 맡기는 처지</b>에 놓였습니다.
              조별리그에서 보여준 무기력한 경기력과 결과는 선수 개인의 문제가 아니라, 팀을 준비하고 전술과
              엔트리를 책임진 <b>홍명보 감독의 지도력 문제</b>입니다.
            </p>
            <p>
              팬들은 독일·호주·일본·이집트·이라크·가나까지 응원하며 <b>'구걸 축구'</b>라는 자조 섞인 말을
              들어야 했고, 일부 일본 팬들에게 <b>"한국이 부럽다, 월드컵 전 경기를 즐기고 있다"</b>는 조롱까지
              받았습니다. 이는 한 경기의 불운이 아니라, <b>대표팀을 이 지경까지 끌고 온 감독 체제의 총체적
              실패</b>가 만들어낸 비참한 현실입니다.
            </p>
            <p className="font-semibold text-rose-700">
              결론: 2026 월드컵 32강 탈락의 책임은 홍명보 감독에게 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-xl border border-slate-200">
            <img
              src="/report-fan-article.jpeg"
              alt="한국 팬들이 다른 팀을 응원하며 '구걸 축구'라는 말까지 나온 상황을 다룬 기사"
              className="w-full object-cover"
              loading="lazy"
            />
            <figcaption className="bg-slate-50 px-3 py-2 text-xs text-slate-500">
              '구걸 축구'·일본 팬의 조롱까지 — 홍명보호가 월드컵에서 만들어낸 현실을 다룬 기사.
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-slate-200">
            <img
              src="/report-hong-banned.png"
              alt="'홍명보는 출입금지'라고 적힌 안내문"
              className="w-full object-cover"
              loading="lazy"
            />
            <figcaption className="bg-slate-50 px-3 py-2 text-xs text-slate-500">
              민심을 보여주는 '홍명보는 출입금지' 안내문.
            </figcaption>
          </figure>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-400">
          ※ 첨부 이미지는 사용자가 제공한 것이며, 본 섹션은 사이트 운영자의 의견(논평)입니다.
        </p>
      </div>
    </section>
  )
}
