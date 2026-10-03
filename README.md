# KeepFit
SNUSV Ideathon

GLP-1(위고비·마운자로) 감량 치료를 마친 환자의 **체중 유지 프로그램** — 환자용 웹앱(PWA) 데모.

병원이 치료 종료 시점에 환자를 초대하고(B2B2C), 환자는 매일 AI 코치 전화만 받으면 체중·식욕·수면이 기록됩니다. 위험 신호가 보이면 원장님이 내원을 요청합니다.

## 자료 한눈에 보기

| 자료 | 위치 | 설명 |
| --- | --- | --- |
| 환자 앱 (PWA) | 레포 루트 (`src/`) | 초대 → 프로그램 → 전화 설정 → 홈·통화·리포트·가이드·내원 요청. 실행 방법은 아래 |
| 병원 대시보드 | [`clinic-dashboard/`](clinic-dashboard/) | 원장님용 화면. `index.html`을 바로 열어도 동작하고, `npm run dev` 후 `/clinic-dashboard/`에서 열면 환자 앱과 실시간 연동 ([설명](clinic-dashboard/README.md)) |
| 시장조사 (TAM·SAM·SOM) | [`docs/market-analysis.html`](docs/market-analysis.html) · [온라인 보기](https://claude.ai/artifact/TH1AWKzgCjCfzzEd3qSQRF) | 시장 현황, 핵심 문제, 경쟁, 수익 모델, 시장 규모, 검증 과제 |
| 가이드 콘텐츠 근거 논문 | [`src/data/guides.ts`](src/data/guides.ts) | 근육·식욕·수면·체중 기록·요요 가이드의 수치와 논문 링크 |
| 발표자료 | [`docs/pitch/KeepFit-pitch.pdf`](docs/pitch/KeepFit-pitch.pdf) · [HTML](docs/pitch/KeepFit-pitch.html) | 문제·해결·기능(개념 화면)·시장·비즈니스 모델·수익성, 13장 |
| 와이어프레임 (환자 앱 8화면) | [Claude 디자인 캔버스](https://claude.ai/artifact/RjFiCd5qQcEYxxS5Ja3itT) | 링크가 있으면 누구나 보기 가능 |

**환자 앱과 병원 대시보드는 실시간으로 연동돼요.** 시연할 때는 두 화면을 한 화면에 띄운 **연동 시연 페이지**를 쓰면 돼요.

| | 배포 (Vercel) | 로컬 (`npm run dev`) |
| --- | --- | --- |
| 랜딩페이지 | https://keep-fit-lovat.vercel.app/landing/ | http://localhost:5173/landing/ |
| 연동 시연 (대시보드 + 환자 앱 한 화면) | https://keep-fit-lovat.vercel.app/demo/ | http://localhost:5173/demo/ |
| 환자 앱 | https://keep-fit-lovat.vercel.app/ | http://localhost:5173/ |
| 병원 대시보드 | https://keep-fit-lovat.vercel.app/clinic-dashboard/ | http://localhost:5173/clinic-dashboard/ |

연동은 같은 브라우저 안에서만 돼요(서버 없이 `localStorage` 사용). 연동 시연 페이지 위쪽의 **홈에서 시작** / **처음부터 (온보딩)** 으로 데모를 초기화하고, 가운데 화살표가 방금 어느 쪽으로 무엇이 넘어갔는지 보여줘요.

환자가 AI 통화를 마치면 대시보드에 바로 반영되고, 원장님이 고른 시간으로 내원 요청을 보내면 환자 앱에 뜨고, 환자가 예약하면 대시보드에 확정으로 바뀌어요. 원장님 메모도 환자 앱 홈에 떠요. 자세한 내용은 [대시보드 설명](clinic-dashboard/README.md#환자-앱과-실시간-연동)을 보세요.

## 실행

```bash
npm install
npm run dev
```

`npm run build` 결과물(`dist/`)은 정적 호스팅(GitHub Pages 등) 어디에나 올릴 수 있어요. 해시 라우팅을 써서 별도 설정이 필요 없습니다.

## 화면

| 경로 | 화면 |
| --- | --- |
| `#/invite` | 01 병원 초대 수락 |
| `#/program` | 02 유지 프로그램 확인·결제 |
| `#/setup` | 03 AI 전화 빈도·시간 설정 |
| `#/home` | 04 홈 (단약 단계, 다음 전화, 최근 상태, 미션) |
| `#/call` | AI 코치 통화 (데모용 시뮬레이션) |
| `#/summary` | 05 통화 요약 |
| `#/report` | 06 주간/월간 리포트 |
| `#/guide` | 07 단약 로드맵·가이드 |
| `#/guide/:id` | 가이드 상세 (muscle, appetite, sleep, weigh, rebound) — 논문 근거·체크리스트 |
| `#/alert` | 08 원장님 내원 요청·예약 |

## 요금 (서비스 이용료만, 약값·진료비는 병원에 별도 지불)

**환자 → KeepFit**: 월 9,900원 (앱 결제, 첫 2주 무료). 요금은 같고 통화 횟수만 단약 단계에 맞춰 줄어요.

| 기간 | 통화 |
| --- | --- |
| 1–3개월 · 집중기 | 매일 |
| 4–6개월 · 적응기 | 주 2–3회 |
| 7개월~ · 혼자서 유지 | 주 1회 |

6개월 이용 시 1인당 5만 9,400원 · 목표 범위(±2kg)를 지키면 마지막 달 요금 환급 · 회사 복지포인트 결제 가능

**의원 → KeepFit**: 원장님 대시보드(환자 모니터링·후속 관리 도구) 월 1만 9,000원 (12개월 → 1곳당 연 22만 8,000원)

가격과 이용 기간은 실제 결제·유지 데이터로 검증할 가정이에요. 시장 규모와 근거는 [시장 분석](docs/market-analysis.html)을 보세요.

## 데모 시나리오

**발표용 (두 화면 연동)**: [연동 시연 페이지](https://keep-fit-lovat.vercel.app/demo/)를 열고 **홈에서 시작**을 눌러요. 왼쪽이 병원 대시보드, 오른쪽이 환자 앱(휴대폰 프레임)이에요.

1. 환자 앱 홈 맨 아래 **데모 → 위험 신호 시나리오로**, 이어서 **지금 받기**로 AI 통화
2. 통화가 끝나면 대시보드에서 이지은이 **위험**으로 올라옴
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
