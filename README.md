# KeepFit
SNUSV Ideathon

GLP-1(위고비·마운자로) 감량 치료를 마친 환자의 **체중 유지 프로그램** — 환자용 웹앱(PWA) 데모.

병원이 치료 종료 시점에 환자를 초대하고(B2B2C), 환자는 매일 AI 코치 전화만 받으면 체중·식욕·수면이 기록됩니다. 위험 신호가 보이면 원장님이 내원을 요청합니다.

- 와이어프레임: https://claude.ai/artifact/RjFiCd5qQcEYxxS5Ja3itT

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
| `#/alert` | 08 원장님 내원 요청·예약 |

## 데모 시나리오

홈 화면 맨 아래 **데모** 버튼으로 전환합니다.

1. **정상**: 홈 → 지금 받기(통화) → 통화 요약 → 리포트
2. **위험 신호**: "위험 신호 시나리오로" → 홈에 내원 요청 배너 → 통화 → 요약 → 내원 예약
3. "처음부터"를 누르면 온보딩부터 다시 시작해요.

## 구조

- `src/data/mock.ts` — 데모 데이터 (실서비스에서는 병원 치료 기록 + 보이스 에이전트 수집 데이터로 대체)
- `src/state/AppState.tsx` — 설정·미션·시나리오 상태 (localStorage 저장)
- `src/screens/` — 화면별 컴포넌트
- `public/manifest.webmanifest`, `public/sw.js` — PWA 설치·오프라인 캐시

Vite + React + TypeScript, React Router.
