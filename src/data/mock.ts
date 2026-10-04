// Demo data. In production these come from the clinic (treatment record)
// and from the voice agent (daily check-in calls).

export const patient = {
  name: '지은',
  clinic: '[병원 이름] 의원',
  doctor: '[원장 이름]',
  phone: '010-0000-0000',
  treatment: { months: 6, lostKg: 12, drug: '위고비', startWeight: 82 },
  targetWeight: 70, // 데모 값: 병원이 설정한 유지 목표 체중
  rangeKg: 2,
}

// 환자는 무료. 의원이 프로그램 사용료(월 10만원)를 내요. 약값·진료비는 기존처럼 병원에 별도 지불
export const program = {
  stage: 2,
  stageWeek: 3,
  stageWeeks: 6,
  patientFee: '0원',
}

export const stages = [
  { title: '투약 · 감량', detail: '첫 내원 ~ 6개월 · -12kg · 이때부터 앱 기록 시작' },
  { title: '용량 줄이기', detail: '1–6주 · 원장님이 2주마다 용량 조정' },
  { title: '단약 적응', detail: '단약 후 1–3개월 · 식욕 반등 집중 관리' },
  { title: '혼자서 유지', detail: '단약 후 4–12개월 · 1년 뒤에도 요요 없이' },
]

// 단약 후 유지 점검 내원 (약을 끊은 뒤에도 원장님이 직접 확인)
export const checkups = [
  { when: '단약 1개월', date: '11월 중순 예정', what: '체중·식욕 점검 · 인바디' },
  { when: '단약 3개월', date: '1월 예정', what: '근육량 확인 · 식단 조정' },
  { when: '단약 6개월', date: '4월 예정', what: '유지 성공 점검 · 이후 계획' },
]

export const missions = [
  { id: 'protein', label: '끼니마다 단백질 먼저 (하루 85g)' },
  { id: 'strength', label: '근력 운동 20분' },
  { id: 'sleep', label: '밤 12시 전 잠들기' },
]

export const recordItems = ['오늘 체중', '식욕 (1–10)', '수면 시간', '원장님께 전할 말']

// 기록하면 원장님 차트에 자동으로 들어가서, 진료 때 문진과 체중 재는 시간이 줄어요
export const symptomOptions = ['없음', '메스꺼움', '변비', '속쓰림', '어지러움', '피로'] as const

// 다음 진료 (병원 예약 시스템에서 받아옴)
export const nextVisit = { slot: '10/8 (목)\n오후 7:00', purpose: '용량 조정 진료' }

// 원장님께 남기기: 진료 사이에 생긴 궁금한 점
export const askKinds = [
  { id: 'visit', label: '다음 진료 때 물어볼게요', hint: '진료 전에 원장님 차트에 미리 올라가요' },
  { id: 'ask', label: '지금 답변 받고 싶어요', hint: '원장님이 진료 사이에 앱으로 답해 드려요' },
] as const
export type AskKind = (typeof askKinds)[number]['id']
export const askSuggestions = ['용량을 줄여도 될까요?', '변비가 계속돼요', '운동 강도를 올려도 될까요?', '약은 언제쯤 끊나요?', '회식 때는 어떻게 먹어요?']

// 식욕 SOS: 먹고 싶을 때 바로 먹지 않고 10분 기다리며 해 볼 것
export const sosKinds = ['속이 비었어요', '입이 심심해요', '스트레스 · 기분', '특정 음식이 당겨요'] as const
export const sosActions = ['물 한 컵 마시기', '양치하기', '10분 걷기', '단백질 간식 (달걀·두유)'] as const
export const sosOutcomes = [
  { id: 'resisted', label: '참았어요' },
  { id: 'protein', label: '단백질로 조금 먹었어요' },
  { id: 'ate', label: '먹었어요' },
] as const
export type SosOutcome = (typeof sosOutcomes)[number]['id']
export const SOS_MINUTES = 10

export type Scenario = 'normal' | 'risk'

export type Line = { who: 'ai' | 'me'; text: string }

type ScenarioData = {
  today: { weight: number; appetite: number; sleep: number; stress: number; symptoms: string[] }
  call: { sleep: number; note: string; appetiteAvg: number } // what the latest AI call recorded (sent to the clinic)
  appetiteNote: string
  summary: { label: string; value: string; warn?: boolean }[]
  transcript: Line[]
  feedback: string
  weekly: { weight: number[]; appetite: number[]; stress: number[] }
  monthly: { weight: number[]; appetite: number[]; stress: number[] }
  stats: { answered: string; missions: string; sleep: string }
  sos: { count: number; resisted: number; peak: string } // 이번 주 식욕 SOS (데모 기본값)
  alert?: { appetiteAvg: string; weightChange: string; message: string }
}

export const scenarios: Record<Scenario, ScenarioData> = {
  normal: {
    today: { weight: 70.4, appetite: 6, sleep: 6.5, stress: 5, symptoms: ['없음'] },
    call: { sleep: 5.5, note: '밤에 라면이 당겼다고 함 · 근력 운동 20분', appetiteAvg: 5.4 },
    appetiteNote: '지난주보다 ↑',
    summary: [
      { label: '체중', value: '70.4kg' },
      { label: '식욕', value: '7 / 10 · 3일 연속 상승', warn: true },
      { label: '수면', value: '5.5시간' },
      { label: '근력 운동', value: '했음 (20분)' },
      { label: '특이사항', value: '야식 1회 (라면)' },
    ],
    transcript: [
      { who: 'ai', text: '지은님, 안녕하세요. 오늘 하루 어떠셨어요? 2분이면 끝나요.' },
      { who: 'me', text: '네, 괜찮았어요.' },
      { who: 'ai', text: '오늘 아침 체중은 몇 kg이었어요?' },
      { who: 'me', text: '70.4요.' },
      { who: 'ai', text: '오늘 식욕은 1부터 10 중에 어느 정도였어요?' },
      { who: 'me', text: '한 7 정도요. 밤에 라면이 너무 당겼어요.' },
      { who: 'ai', text: '어젯밤엔 몇 시간 주무셨어요?' },
      { who: 'me', text: '5시간 반쯤이요.' },
      { who: 'ai', text: '근력 운동은 하셨어요?' },
      { who: 'me', text: '네, 20분 했어요.' },
      { who: 'ai', text: '잘하셨어요. 요약은 앱에 보내드릴게요.' },
    ],
    feedback: '수면이 짧으면 식욕이 올라가요. 내일은 저녁에 단백질을 30g 이상 먹고 12시 전에 잠들어 봐요.',
    weekly: {
      weight: [69.8, 69.9, 70.0, 69.9, 70.1, 70.3, 70.4],
      appetite: [4, 4, 5, 5, 6, 7, 7],
      stress: [4, 4, 5, 5, 6, 6, 5],
    },
    monthly: {
      weight: [69.6, 69.7, 69.9, 70.2],
      appetite: [3.8, 4.1, 4.6, 5.4],
      stress: [4, 4.5, 5, 5.2],
    },
    stats: { answered: '6/7', missions: '71%', sleep: '6.2h' },
    sos: { count: 3, resisted: 2, peak: '밤 10–12시' },
  },
  risk: {
    today: { weight: 72.6, appetite: 9, sleep: 5, stress: 8, symptoms: ['변비'] },
    call: { sleep: 5, note: '하루 종일 배고팠다고 함 · 체중 계속 상승', appetiteAvg: 8.2 },
    appetiteNote: '주의 기준 초과',
    summary: [
      { label: '체중', value: '72.6kg · 유지 범위 초과', warn: true },
      { label: '식욕', value: '9 / 10 · 7일 평균 8.2', warn: true },
      { label: '수면', value: '5시간' },
      { label: '근력 운동', value: '못 했음' },
      { label: '특이사항', value: '야식 3회 (이번 주)' },
    ],
    transcript: [
      { who: 'ai', text: '지은님, 안녕하세요. 오늘 하루 어떠셨어요?' },
      { who: 'me', text: '좀 힘들었어요.' },
      { who: 'ai', text: '오늘 아침 체중은 몇 kg이었어요?' },
      { who: 'me', text: '72.6이요… 계속 올라가네요.' },
      { who: 'ai', text: '식욕은 1부터 10 중에 어느 정도였어요?' },
      { who: 'me', text: '9요. 하루 종일 배고팠어요.' },
      { who: 'ai', text: '말해줘서 고마워요. 이 내용은 원장님께 바로 전달할게요.' },
    ],
    feedback: '식욕과 체중이 함께 올라가는 건 흔한 반등 신호예요. 원장님이 확인 후 연락드릴 거예요.',
    weekly: {
      weight: [71.2, 71.5, 71.6, 72.0, 72.1, 72.4, 72.6],
      appetite: [7, 8, 8, 9, 8, 8, 9],
      stress: [6, 7, 7, 8, 8, 8, 8],
    },
    monthly: {
      weight: [70.1, 70.6, 71.4, 72.3],
      appetite: [5.2, 6.4, 7.5, 8.2],
      stress: [5, 6, 7, 7.8],
    },
    stats: { answered: '7/7', missions: '38%', sleep: '5.4h' },
    sos: { count: 7, resisted: 2, peak: '밤 10–12시' },
    alert: {
      appetiteAvg: '8.2 / 10',
      weightChange: '+2.4kg (유지 범위 초과)',
      message: '걱정할 단계는 아니에요. 지금 잡으면 충분히 돌아갈 수 있으니 이번 주에 한번 들러 주세요.',
    },
  },
}

export const visitSlots = ['10/6 (화)\n오후 7:00', '10/8 (목)\n오후 7:30', '10/10 (토)\n오전 10:00']

export const callTimes = ['아침 8:00', '점심 12:30', '저녁 9:00'] as const
