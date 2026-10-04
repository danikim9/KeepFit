# KeepFit
SNUSV Ideathon

**개인의원·중소 비만 클리닉용 진료 CRM** — 진료와 다음 예약 사이의 환자 커뮤니케이션, 차트 업데이트, 기록을 맡아 진료 효율과 환자 회전율을 높여요. 레퍼런스: 닥터팔레트.

- **환자 앱**: 하루 30초 기록(체중·식욕·스트레스·수면·불편한 증상), 진료 사이 질문 남기기(다음 진료 때 물어볼 것 / 지금 답변 받기), 식욕 SOS → 모두 원장님 대시보드의 **환자 차트에 자동 입력**
- **원장님 대시보드**: 진료실 차트(앱 기록 자동 입력, "이번 진료에서 확인할 것" 자동 정리, 진료 전 기록이 있으면 체중 측정·기본 문진 생략), **문의함**(질문만 모아보기), 처방·답변·조언·다음 예약 **상용구 태그**로 차트·답변 자동 입력
- **확장(BM)**: 병원이 쓰는 예약·접수, 전자의무기록(EMR), 처방 시스템, 서류 템플릿과 연동해 의료 행정·진료 시스템 통합

## 자료 한눈에 보기

| 자료 | 위치 | 설명 |
| --- | --- | --- |
| 환자 앱 (PWA) | [`app/`](app/index.html) + `src/` (주소 `/app/`) | 초대 → 프로그램 → 전화 설정 → 홈·통화·리포트·가이드·내원 요청. 실행 방법은 아래 |
| 병원 대시보드 | [`clinic-dashboard/`](clinic-dashboard/) | 원장님용 화면. `index.html`을 바로 열어도 동작하고, `npm run dev` 후 `/clinic-dashboard/`에서 열면 환자 앱과 실시간 연동 ([설명](clinic-dashboard/README.md)) |
| 시장조사 (TAM·SAM·SOM) | [`docs/market-analysis.html`](docs/market-analysis.html) · [온라인 보기](https://claude.ai/artifact/TH1AWKzgCjCfzzEd3qSQRF) | 시장 현황, 핵심 문제, 경쟁, 수익 모델, 시장 규모, 검증 과제 |
| 가이드 콘텐츠 근거 논문 | [`src/data/guides.ts`](src/data/guides.ts) | 근육·식욕·수면·체중 기록·요요 가이드의 수치와 논문 링크 |
| 발표자료 | [`docs/pitch/KeepFit-pitch.pdf`](docs/pitch/KeepFit-pitch.pdf) · [HTML](docs/pitch/KeepFit-pitch.html) | 문제·해결·기능(개념 화면)·시장·비즈니스 모델·수익성, 13장 |
| 와이어프레임 (환자 앱 8화면) | [Claude 디자인 캔버스](https://claude.ai/artifact/RjFiCd5qQcEYxxS5Ja3itT) | 링크가 있으면 누구나 보기 가능 |

**환자 앱과 병원 대시보드는 실시간으로 연동돼요.** 시연할 때는 두 화면을 한 화면에 띄운 **연동 시연 페이지**를 쓰면 돼요.

| | 배포 (Vercel) | 로컬 (`npm run dev`) |
| --- | --- | --- |
| 랜딩페이지 (환자 지불 의사 테스트) | https://keep-fit-lovat.vercel.app/ | http://localhost:5173/ |
| 연동 시연 (대시보드 + 환자 앱 한 화면) | https://keep-fit-lovat.vercel.app/demo/ | http://localhost:5173/demo/ |
| 환자 앱 | https://keep-fit-lovat.vercel.app/app/ | http://localhost:5173/app/ |
| 병원 대시보드 | https://keep-fit-lovat.vercel.app/clinic-dashboard/ | http://localhost:5173/clinic-dashboard/ |

연동은 같은 브라우저 안에서만 돼요(서버 없이 `localStorage` 사용). 연동 시연 페이지 위쪽의 **홈에서 시작** / **처음부터 (온보딩)** 으로 데모를 초기화하고, 가운데 화살표가 방금 어느 쪽으로 무엇이 넘어갔는지 보여줘요.

환자가 AI 통화를 마치면 대시보드에 바로 반영되고, 원장님이 고른 시간으로 내원 요청을 보내면 환자 앱에 뜨고, 환자가 예약하면 대시보드에 확정으로 바뀌어요. 원장님 메모도 환자 앱 홈에 떠요. 자세한 내용은 [대시보드 설명](clinic-dashboard/README.md#환자-앱과-실시간-연동)을 보세요.

## 실행

```bash
npm install
npm run dev
```

`npm run build` 결과물(`dist/`)은 정적 호스팅(GitHub Pages 등) 어디에나 올릴 수 있어요. 해시 라우팅을 써서 별도 설정이 필요 없습니다.

## 환자 앱 화면 (`/app/` 아래)

| 경로 | 화면 |
| --- | --- |
| `#/invite` | 01 첫 진료 때 받은 초대 수락 (이용료 0원) |
| `#/program` | 02 프로그램 소개 (식욕 SOS · 30초 기록 · 내원 요청 · 단약 후 점검 내원) |
| `#/setup` | 03 기록 알림 시간, 놓치면 AI 전화로 대신 묻기 |
| `#/home` | 04 홈 (식욕 SOS, 오늘 기록, 단계·다음 점검 내원, 최근 상태, 미션) |
| `#/checkin` | 30초 기록 (체중·식욕·스트레스·수면·증상) → 원장님 차트에 자동 입력 |
| `#/ask` | 원장님께 남기기 (다음 진료 때 물어볼 것 / 지금 답변 받기) · 답변 확인 |
| `#/sos` | 식욕 SOS (식욕 점수 → 10분 같이 기다리기 → 결과 기록) |
| `#/call` | AI 코치 전화 (기록을 놓쳤을 때, 데모용 시뮬레이션) |
| `#/summary` | 05 통화 요약 |
| `#/report` | 06 주간/월간 리포트 (체중·식욕·식욕 SOS) |
| `#/guide` | 07 단약 로드맵·단약 후 점검 내원·가이드 |
| `#/guide/:id` | 가이드 상세 (muscle, appetite, sleep, weigh, rebound) — 논문 근거·체크리스트 |
| `#/alert` | 08 원장님 내원 요청·예약 |

## 요금

**의원 → KeepFit: 월 10만원** (의원 1곳 기준). **환자는 무료**예요. 약값·진료비는 기존처럼 병원에 내요.

지인 개원의 5명, 마운자로 복용 경험자 5명 인터뷰에서 의사 지불 의향은 최대 월 10만원, 환자는 최대 1만원이었고, 당근마켓 랜딩 설문(환자 월 9,900원)에서는 응답이 한 건도 없어서 환자 과금을 뺐어요. 매출은 제휴 의원 수 × 10만원이에요.

## 랜딩페이지 — 지불 의사 테스트

루트 [`index.html`](index.html)은 환자(B2C)만 대상으로 한 페이지예요. 환자 월 9,900원 가정을 검증하던 실험이라 지금 요금(환자 무료)과 다르고, 기록용으로 남겨 뒀어요. 의원 관련 내용은 없어요. "2주 무료로 시작하기"를 누르면 결제 대신 짧은 설문이 떠요.

1. 월 9,900원이면 쓰시겠어요? → 네 / 가격이 부담돼요(얼마면? 무료·3천·5천·7천원) / 필요 없어요(이유)
2. GLP-1 치료 상태 (투약 중·줄이는 중·끊었어요·시작 예정·해당 없음)
3. 출시 알림 연락처 (선택, 수집·이용 동의 필수)

응답은 Supabase 프로젝트 `danikim9's Project`의 `keepfit_events`(방문·버튼 클릭·설문 열기·제출)와 `keepfit_wtp`(설문 답)에 쌓여요. 페이지의 공개 키로는 **쓰기만** 되고 읽을 수 없어요. 결과는 Supabase 대시보드 → SQL Editor에서 보세요.

- 가격 바꿔 테스트: `?price=12900`처럼 붙이면 그 가격으로 보여주고 응답에 함께 저장돼요.
- 유입 경로 구분: `?utm_source=instagram&utm_campaign=ad1`
- 내 방문 빼기: `?track=0`을 붙여 한 번 열면 그 브라우저에서는 이후 계속 수집하지 않아요 (`?track=1`로 다시 켜기). 휴대폰·노트북 등 기기마다 한 번씩 열어 주세요.
- `localhost`에서 열면 수집하지 않아요 (`?track=1`을 붙이면 수집).

**구글 스프레드시트로 보기**: [KeepFit 지불 의사 테스트 결과](https://docs.google.com/spreadsheets/d/1bHTx9IAA6XEv-6ISGTjLCkBiohvFwChb4EitIBh97JY/edit) (소유자만 접근)

- `응답`·`방문` 탭은 `=IMPORTDATA("https://keep-fit-lovat.vercel.app/api/sheet?t=wtp|events&token=…")`로 데이터를 불러와요. 구글이 약 1시간마다 다시 불러와요.
- `요약` 탭: 퍼널(방문 → 시작하기 클릭 → 설문 제출, 같은 사람은 한 번만), 지불 의사 비율, 적정 가격 평균, 가격별·GLP-1 상태별·유입별 표.
- [`api/sheet.js`](api/sheet.js)는 Supabase 함수 `keepfit_export`를 불러 CSV로 바꿔요. 토큰은 Supabase `private.keepfit_export_token`에만 있고 레포에는 없어요. 시트 링크가 새면 토큰을 바꾸고(`update private.keepfit_export_token set token = ...`) 시트 두 탭의 주소도 바꿔 주세요.
- 연락처가 들어 있으니 시트를 공유할 때 주의하세요.

```sql
-- 가격별 퍼널: 방문 → 시작하기 클릭 → 설문 제출
select price_krw,
  count(distinct session_id) filter (where event = 'view')          as visitors,
  count(distinct session_id) filter (where event = 'cta_click')     as clicked,
  count(distinct session_id) filter (where event = 'survey_submit') as answered
from keepfit_events group by price_krw order by price_krw;

-- 가격별 지불 의사
select price_krw, answer, count(*), round(avg(fair_price_krw)) as avg_fair_price
from keepfit_wtp group by price_krw, answer order by price_krw, answer;
```

## 데모 시나리오

**발표용 (두 화면 연동)**: [연동 시연 페이지](https://keep-fit-lovat.vercel.app/demo/)를 열고 **홈에서 시작**을 눌러요. 왼쪽이 병원 대시보드, 오른쪽이 환자 앱(휴대폰 프레임)이에요.

1. 환자 앱 홈 맨 아래 **데모 → 위험 신호 시나리오로**, 이어서 **기록하기**로 30초 기록 (식욕 9 선택) — 홈의 **식욕 SOS**도 써 보면 대시보드에 바로 떠요
2. 기록하면 대시보드에서 이지은이 **위험**으로 올라옴 (전화로 기록하려면 기록 화면 아래 **AI 코치 전화로 대신 기록하기**)
3. 대시보드에서 **내원 요청 보내기** → 시간 2–3개 선택 → 보내기
4. 환자 앱 홈 배너 → 알림 화면에서 원장님이 고른 시간 중 하나로 **예약**
5. 대시보드에 **내원 예약 확정**, 메모를 보내면 환자 앱 홈 맨 위에 "새 메모" → 환자가 **확인했어요**를 누르면 대시보드에 "환자가 읽음"
6. 끝나면 환자 앱 **처음부터** 또는 대시보드 설정 → **데모 초기화**

**환자 앱만**: 홈 맨 아래 데모 버튼으로 정상/위험을 바꿔요. "처음부터"를 누르면 온보딩부터 다시 시작해요.

## 구조

- `src/data/guides.ts` — 가이드 콘텐츠와 근거 논문 (STEP 1, SURMOUNT-4, Jensen 2024, Spiegel 2004, Tasali 2022, Wing 2006, Shukla 2015, 2025 GLP-1 영양 공동 권고)
- `src/data/mock.ts` — 데모 데이터 (실서비스에서는 병원 치료 기록 + 보이스 에이전트 수집 데이터로 대체)
- `src/state/AppState.tsx` — 설정·미션·시나리오 상태 (localStorage 저장)
- `src/state/link.ts` — 병원 대시보드와 주고받는 연동 기록 (`keepfit-link`)
- `src/screens/` — 화면별 컴포넌트
- `public/manifest.webmanifest`, `public/sw.js` — PWA 설치·오프라인 캐시

Vite + React + TypeScript, React Router.
