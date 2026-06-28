# 🇰🇷 대한민국 월드컵 32강 진출 가능성

2026 월드컵에서 한국이 **12개 조 3위 와일드카드 상위 8팀** 안에 들어 32강에 진출할 수 있는지를
보여주는 모바일 우선 정적 웹사이트입니다. 결정적 남은 경기 결과를 입력하면 순위·한국 상태·대진표가
즉시 다시 계산됩니다.

## 핵심 모델 (분석 기반)

- 한국은 A조 3위(3점 / 골득실 -1 / 득점 2).
- 한국보다 위에 고정된 3위 6팀(스웨덴·에콰도르·보스니아·파라과이·세네갈·이란) + 한국 = 현재 7위권.
- 결정적 3경기와 현재 상태:
  | 한국시간 | 조 | 경기 | 한국에 좋은 결과 | 상태 |
  |---|---|---|---|---|
  | 6/28 06:00 | L | 크로아티아 vs 가나 | **가나 승** | ✅ 종료 — **크로아티아 2-1 가나** → L조 3위 가나(4점)가 한국보다 위 → **한국에 불리** |
  | 6/28 08:30 | K | DR콩고 vs 우즈베키스탄 | DR콩고가 **이기지만 않으면** | ✅ 종료 — **DR콩고 3-1 우즈벡** → K조 3위 DR콩고(4점)가 한국보다 위 → **한국에 불리** |
  | 6/28 11:00 | J | 알제리 vs 오스트리아 | **오스트리아 승** 또는 알제리 2골차↑ 승 | ⏳ 대기 (한국 탈락엔 영향 없음) |
- 한국보다 좋은 3위를 만든 위험 조가 **0~1개면 진출(7~8위), 2개 이상이면 탈락(9위↓)**.
- **최종(6/28 L·K조 종료 기준)**: 위험 2조(L·K)가 모두 불리로 확정 → 한국은 와일드카드 **9위로 탈락 확정**.
  J조 결과와 무관하게 **2026 월드컵 32강 진출이 무산**됐다.

## 주요 기능

- **남은 6경기 시뮬레이터**: 모든 잔여 경기 스코어 직접 입력. 결정적 경기(⭐) + 예상 승률 막대(참고 이미지).
- **예상 스코어 시나리오 버튼**: 남은 K·J 결정적 경기 조합(유일한 진출 경로/K 무너짐/J 무너짐/최악) —
  클릭 시 스코어가 적용되어 한국 가능성·대진표가 즉시 갱신. (L조 종료 전에는 J·K·L 전체 조합으로 구성)
- **진출 확률 · 경우의 수 표**(팝업): 승률 기반 종합 진출 확률 + 조합별 확률·순위·진출여부.
  **이미 끝난 결정적 조는 결과로 고정**되고 남은 조만 변수로 둬 조건부 확률·경우의 수가 다시 계산된다.
- **와일드카드 순위표**: 경기수 + 확정/미확정(J·K·L) 구분.
- **32강 대진표**: 와일드카드 결과로 한국 위치 표시, 확정된 조 1·2위 국가([`bracketConfirmed.ts`](src/data/bracketConfirmed.ts)) 반영.

> 승률 수치는 참고 이미지(Football Meets Data)의 승/무/패 확률을 입력값으로 쓰며, 데이터는 스크래핑하지
> 않습니다. 확정 국가는 최종 순위가 나오는 대로 `bracketConfirmed.ts`에 추가하세요.

## 아키텍처

순수 정적 사이트(백엔드/DB 없음). 모든 계산은 브라우저의 pure function에서 수행합니다.

```
src/
  types/worldcup.ts        도메인 타입
  data/                    "진실의 원천" (코드에 박힌 공식 데이터)
    initialTeams.ts        팀·국기
    matches.ts             J/K/L 경기 + 결정적 3경기   ← 공식 결과 갱신 지점
    fixedThirds.ts         확정된 9개 조 3위 행
    bracketSeeds.ts        32강 대진 구조(조 1·2위 자리 + 3위 슬롯, 예시)
    bracketConfirmed.ts    확정된 조 1·2위 국가(예: A조 1위 멕시코) ← 확정 시 채움
    scenarioPresets.ts     예상 스코어 시나리오 1~5 (6경기 스코어셋)
  domain/                  pure function (테스트 대상)
    standings.ts           computeGroupStandings / updateMatchScore
    bestThirds.ts          getThirdPlacedTeams(확정여부 포함) / rankBestThirds
    koreaStatus.ts         getKoreaStatus (진출/탈락 판정)
    bracket.ts             buildBracket (3위→대진 슬롯 배정, 확정국가 반영)
    scenarios.ts           진출 규칙·8조합 표·진출 확률(승률 기반)
    compute.ts             전체 상태 조합
  components/              UI (계산 로직 없음)
    KoreaStatusCard / BestThirdTable(경기수·확정구분) / RemainingMatches(6경기·승률바)
    ScenarioPresets(시나리오 버튼) / BracketTree(대진표) / ScenarioModal(확률·경우의 수)
  App.tsx                  data → domain → UI
tests/                     Vitest (분석 시나리오 검증, 32 tests)
```

## 결과 갱신 방법 (어드민)

비밀번호·서버 없이, **코드 수정 → push**로 모든 사용자에게 반영됩니다.

1. [`src/data/matches.ts`](src/data/matches.ts)에서 결정적 3경기(`L-CRO-GHA`, `K-COD-UZB`,
   `J-ALG-AUT`)의 `homeScore`/`awayScore`를 채우고 `status: 'finished'`로 변경.
2. `lastUpdated` 값도 갱신.
3. `git commit && git push` → Cloudflare Pages가 자동 재빌드/배포.

> **시뮬레이터**: 화면에서 누구나 3경기 점수를 바꿔 결과를 미리 볼 수 있습니다(what-if).
> 이 변경은 **내 브라우저에만** 적용되며, 새로고침하면 코드의 공식값으로 돌아갑니다.
> "전체 공유"는 위의 코드 갱신으로만 이뤄집니다.

## 개발 / 빌드

```bash
npm install
npm test        # Vitest — 순위/와일드카드/한국상태 시나리오
npm run dev     # 로컬 개발 서버
npm run build   # 타입체크 + 정적 빌드 → dist/
```

## 배포 (Cloudflare Pages)

순수 정적이라 Pages만으로 배포됩니다. (KV / Pages Functions / Wrangler 불필요)

- 연결 레포: `github.com/Imchul/koreaworldcup32P`
- 빌드 명령: `npm run build`
- 출력 디렉터리: `dist`
- push 시 자동 빌드/배포.

## MVP 한계 (중요)

- **동률 규칙**: 승점 → 골득실 → 다득점까지만 구현. 조 내 **head-to-head**는 미구현
  (FIFA는 조 3위 결정 시 조 내 순위에 head-to-head를 먼저 적용). 한국의 컷라인은 J/K/L 결과에만
  좌우되고 9개 조는 확정 시드라 결론은 안전하지만, 일반화 시 보정 필요.
- **conduct score / FIFA 랭킹**: optional fallback 자리만 마련(현재 값 미입력).
- **확정 3위 9팀 스탯**([`fixedThirds.ts`](src/data/fixedThirds.ts))은 분석 기반 best-effort 값.
  배포 전 공식 순위표와 대조할 것. (상대 순서만 맞으면 한국 판정은 정확)
- **32강 대진표**: 대진 **구조는 예시(illustrative)**. 조 1·2위 자리는 그룹 라벨로 표시하고,
  3위 슬롯은 와일드카드 순위 순으로 채워집니다([`bracketSeeds.ts`](src/data/bracketSeeds.ts)).
  한국은 자신의 와일드카드 순위에 해당하는 슬롯에 표시되며, 시뮬레이션으로 순위가 바뀌면 위치도
  바뀝니다. 정확한 Annexe C 495행 배정표를 확보하면 `bracketSeeds`의 slotIndex↔조 매핑을 교체.

## 향후 확장

- Annexe C 495행 전체 입력 → 정확한 3위 슬롯 배정
- 조 내 head-to-head 정식 구현
- 비개발자용 갱신이 필요하면 Cloudflare Pages Functions + KV(또는 D1 히스토리) 도입
