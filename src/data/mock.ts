// Demo data. In production these come from the clinic (treatment record)
// and from the voice agent (daily check-in calls).

export const patient = {
  name: '지은',
  clinic: '[병원 이름] 의원',
  doctor: '[원장 이름]',
  phone: '010-0000-0000',
  treatment: { months: 6, lostKg: 12, drug: '위고비' },
  targetWeight: 70, // 데모 값: 병원이 설정한 유지 목표 체중
  rangeKg: 2,
}

// 환자가 우리에게 내는 서비스 이용료 (약값·진료비는 병원에 별도 지불)
export const pricing = {
  trialDays: 14,
  tiers: [
    { period: '1–3개월', phase: '집중기', calls: '매일 통화', monthly: '4.9만원' },
    { period: '4–6개월', phase: '적응기', calls: '주 2–3회 통화', monthly: '2.9만원' },
    { period: '7개월~', phase: '혼자서 유지', calls: '주 1회 통화', monthly: '1.9만원' },
  ],
  refund: '6개월 목표 범위(±2kg)를 지키면 마지막 달 요금을 돌려드려요',
}

export const program = {
  day: 21,
  totalDays: 180,
  stage: 2,
  stageWeek: 3,
  stageWeeks: 6,
}

export const stages = [
  { title: '감량 치료 완료', detail: '6개월 · -12kg' },
  { title: '용량 줄이기', detail: '1–6주 · 원장님이 2주마다 용량 조정' },
  { title: '단약 적응', detail: '7–12주 · 식욕 반등 집중 관리' },
  { title: '혼자서 유지', detail: '13–26주 · 전화 주 1회로 줄이기' },
]

export const missions = [
  { id: 'protein', label: '끼니마다 단백질 먼저 (하루 85g)' },
  { id: 'strength', label: '근력 운동 20분' },
  { id: 'sleep', label: '밤 12시 전 잠들기' },
]

export const callQuestions = ['식욕 (1–10)', '오늘 체중', '수면 시간', '미션 수행 여부']

export type Scenario = 'normal' | 'risk'

export type Line = { who: 'ai' | 'me'; text: string }

type ScenarioData = {
  today: { weight: number; appetite: number; sleep: number }
  appetiteNote: string
  summary: { label: string; value: string; warn?: boolean }[]
  transcript: Line[]
  feedback: string
  weekly: { weight: number[]; appetite: number[] }
  monthly: { weight: number[]; appetite: number[] }
  stats: { answered: string; missions: string; sleep: string }
  alert?: { appetiteAvg: string; weightChange: string; message: string }
}

export const scenarios: Record<Scenario, ScenarioData> = {
  normal: {
    today: { weight: 70.4, appetite: 6, sleep: 6.5 },
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
    },
    monthly: {
      weight: [69.6, 69.7, 69.9, 70.2],
      appetite: [3.8, 4.1, 4.6, 5.4],
    },
    stats: { answered: '6/7', missions: '71%', sleep: '6.2h' },
  },
  risk: {
    today: { weight: 72.6, appetite: 9, sleep: 5 },
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
    },
    monthly: {
      weight: [70.1, 70.6, 71.4, 72.3],
      appetite: [5.2, 6.4, 7.5, 8.2],
    },
    stats: { answered: '7/7', missions: '38%', sleep: '5.4h' },
    alert: {
      appetiteAvg: '8.2 / 10',
      weightChange: '+2.4kg (유지 범위 초과)',
      message: '걱정할 단계는 아니에요. 지금 잡으면 충분히 돌아갈 수 있으니 이번 주에 한번 들러 주세요.',
    },
  },
}

export const visitSlots = ['10/6 (화)\n오후 7:00', '10/8 (목)\n오후 7:30', '10/10 (토)\n오전 10:00']

export const frequencies = ['매일', '주 3회', '주 1회'] as const
export const callTimes = ['아침 8:00', '점심 12:30', '저녁 9:00'] as const
