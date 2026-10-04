// 가이드 콘텐츠 (데모). 수치는 아래 refs의 원 논문에서 가져왔습니다.

export type Ref = { id: string; cite: string; url: string }

export type Fact = { stat: string; text: string; refs: string[] }

export type Guide = {
  id: string
  icon: 'dumbbell' | 'utensils' | 'moon' | 'scale' | 'book'
  title: string
  cardStat: string // 가이드 탭 카드에 보이는 한 줄
  focus: boolean // 이번 주 집중 항목 여부
  readMin: number
  summary: string
  facts: Fact[]
  actionsTitle: string
  actions: string[]
  table?: { title: string; note?: string; rows: [string, string][] }
  tips?: { title: string; items: string[] }
  refs: string[]
}

export const refs: Record<string, Ref> = {
  wilding2022: {
    id: 'wilding2022',
    cite: 'Wilding JPH et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide: The STEP 1 trial extension. Diabetes Obes Metab. 2022.',
    url: 'https://doi.org/10.1111/dom.14725',
  },
  aronne2024: {
    id: 'aronne2024',
    cite: 'Aronne LJ et al. Continued treatment with tirzepatide for maintenance of weight reduction in adults with obesity: The SURMOUNT-4 randomized clinical trial. JAMA. 2024.',
    url: 'https://doi.org/10.1001/jama.2023.24945',
  },
  wilding2021: {
    id: 'wilding2021',
    cite: 'Wilding JPH et al. Once-weekly semaglutide in adults with overweight or obesity (STEP 1, DXA substudy). N Engl J Med. 2021.',
    url: 'https://doi.org/10.1056/NEJMoa2032183',
  },
  lundgren2021: {
    id: 'lundgren2021',
    cite: 'Lundgren JR et al. Healthy weight loss maintenance with exercise, liraglutide, or both combined. N Engl J Med. 2021.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/33951361/',
  },
  jensen2024: {
    id: 'jensen2024',
    cite: 'Jensen SBK et al. Healthy weight loss maintenance with exercise, GLP-1 receptor agonist, or both combined followed by one year without treatment. eClinicalMedicine. 2024.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Jensen+Blond+Sandsdal+eClinicalMedicine+2024+liraglutide+exercise+termination',
  },
  advisory2025: {
    id: 'advisory2025',
    cite: 'Mozaffarian D et al. Nutritional priorities to support GLP-1 therapy for obesity: A joint Advisory from ACLM, ASN, OMA and TOS. 2025.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12304835/',
  },
  spiegel2004: {
    id: 'spiegel2004',
    cite: 'Spiegel K et al. Brief communication: Sleep curtailment in healthy young men is associated with decreased leptin levels, elevated ghrelin levels, and increased hunger and appetite. Ann Intern Med. 2004.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15583226/',
  },
  tasali2022: {
    id: 'tasali2022',
    cite: 'Tasali E et al. Effect of sleep extension on objectively assessed energy intake among adults with overweight in real-life settings. JAMA Intern Med. 2022.',
    url: 'https://doi.org/10.1001/jamainternmed.2021.8098',
  },
  wing2006: {
    id: 'wing2006',
    cite: 'Wing RR et al. A self-regulation program for maintenance of weight loss (STOP Regain). N Engl J Med. 2006.',
    url: 'https://doi.org/10.1056/NEJMoa061883',
  },
  shukla2015: {
    id: 'shukla2015',
    cite: 'Shukla AP et al. Food order has a significant impact on postprandial glucose and insulin levels. Diabetes Care. 2015.',
    url: 'https://doi.org/10.2337/dc15-0429',
  },
}

export const guides: Guide[] = [
  {
    id: 'muscle',
    icon: 'dumbbell',
    title: '근육 지키기',
    cardStat: '감량한 체중의 약 40%는 근육 등 제지방',
    focus: true,
    readMin: 3,
    summary: '약으로 덜 먹는 동안 지방과 함께 근육도 빠져요. 근육이 줄면 기초대사량이 떨어져 요요가 쉬워져요. 단약기에는 근력 운동과 단백질로 근육을 지키는 게 첫 번째예요.',
    facts: [
      {
        stat: '약 40%',
        text: '세마글루타이드 68주 치료에서 빠진 체중 중 지방이 약 10.4kg, 근육 등 제지방이 약 6.9kg이었어요.',
        refs: ['wilding2021'],
      },
      {
        stat: '6.0kg',
        text: '치료를 끝내고 1년 뒤, 약만 썼던 그룹은 운동했던 그룹보다 체중이 6.0kg 더 늘었어요. 운동 그룹은 체중과 체성분이 유지됐어요.',
        refs: ['jensen2024', 'lundgren2021'],
      },
      {
        stat: '핵심 권고',
        text: '미국 비만·영양 4개 학회는 GLP-1 치료 중 근육과 뼈를 지키기 위해 근력 운동과 충분한 단백질 섭취를 우선순위로 권고했어요.',
        refs: ['advisory2025'],
      },
    ],
    actionsTitle: '이번 주 이렇게 해요',
    actions: [
      '월·수·금 맨몸 근력 운동 20분',
      '끼니마다 단백질 25–30g 먼저 먹기',
      '하루 단백질 체중 1kg당 약 1.2g (70kg → 약 85g)',
      '엘리베이터 대신 계단 한 번',
    ],
    table: {
      title: '20분 맨몸 근력 루틴',
      note: '세트 사이 30–60초 쉬기. 통증이 있으면 멈추고 원장님과 상의하세요.',
      rows: [
        ['스쿼트', '12회 × 3세트'],
        ['무릎 대고 푸시업', '10회 × 3세트'],
        ['힙 브릿지', '15회 × 3세트'],
        ['런지 (한쪽씩)', '10회 × 3세트'],
        ['플랭크', '30초 × 3세트'],
      ],
    },
    refs: ['wilding2021', 'jensen2024', 'lundgren2021', 'advisory2025'],
  },
  {
    id: 'appetite',
    icon: 'utensils',
    title: '식욕 다루기',
    cardStat: '먹는 순서만 바꿔도 식후 혈당 28.6%↓',
    focus: true,
    readMin: 3,
    summary: '용량이 줄면 식욕이 돌아와요. 참는 것보다 먹는 순서와 구성을 바꾸는 게 오래가요. 채소와 단백질을 먼저, 탄수화물은 마지막에.',
    facts: [
      {
        stat: '28.6%↓',
        text: '같은 식사라도 채소와 단백질을 탄수화물보다 먼저 먹었을 때 식후 평균 혈당이 28.6% 낮았어요. (제2형 당뇨 11명 대상 소규모 연구)',
        refs: ['shukla2015'],
      },
      {
        stat: '우선순위',
        text: 'GLP-1 치료 중 식사의 핵심 우선순위로 단백질, 식이섬유, 수분, 적정 칼로리가 꼽혔어요.',
        refs: ['advisory2025'],
      },
    ],
    actionsTitle: '이번 주 이렇게 해요',
    actions: [
      '채소 → 단백질 → 탄수화물 순서로 먹기',
      '식욕 7점 이상인 날은 단백질 간식 준비',
      '배고플 때 물 한 컵 마시고 10분 기다리기',
      '야식이 당기면 홈의 식욕 SOS 누르기',
    ],
    table: {
      title: '편의점 단백질 조합',
      note: '제품마다 다르니 영양성분표를 확인하세요. 수치는 대략값이에요.',
      rows: [
        ['닭가슴살 1팩 (100g)', '단백질 약 23g'],
        ['삶은 달걀 2개', '단백질 약 12g'],
        ['두부 반 모 (150g)', '단백질 약 12g'],
        ['그릭요거트 (100g)', '단백질 약 9g'],
        ['단백질 음료 1병', '단백질 약 20g (제품별 상이)'],
      ],
    },
    tips: {
      title: '식욕이 확 올라올 때',
      items: ['지금 식욕 점수를 1–10으로 매겨 보기', '배고픔인지 습관·스트레스인지 구분하기', '먹기로 했다면 단백질부터, 천천히'],
    },
    refs: ['shukla2015', 'advisory2025'],
  },
  {
    id: 'sleep',
    icon: 'moon',
    title: '잠과 식욕',
    cardStat: '수면 1.2시간↑ → 하루 270kcal 덜 먹음',
    focus: false,
    readMin: 2,
    summary: '잠이 부족하면 배고픔 호르몬이 늘고 포만 호르몬이 줄어요. 통화 요약에서 수면이 짧았던 날 식욕이 높았다면 이 때문일 수 있어요.',
    facts: [
      {
        stat: '그렐린 28%↑',
        text: '이틀간 4시간만 잔 건강한 남성들은 포만 호르몬(렙틴)이 18% 줄고, 배고픔 호르몬(그렐린)이 28% 늘었으며, 배고픔은 24% 커졌어요.',
        refs: ['spiegel2004'],
      },
      {
        stat: '270kcal',
        text: '평소 6.5시간 미만 자던 과체중 성인이 수면을 하루 평균 1.2시간 늘리자, 섭취 칼로리가 하루 약 270kcal 줄었어요.',
        refs: ['tasali2022'],
      },
    ],
    actionsTitle: '이번 주 이렇게 해요',
    actions: ['밤 12시 전에 잠들기', '매일 같은 시간에 일어나기', '잠들기 1시간 전 휴대폰 내려놓기', '오후 늦게는 카페인 피하기'],
    refs: ['spiegel2004', 'tasali2022'],
  },
  {
    id: 'weigh',
    icon: 'scale',
    title: '매일 체중 재기',
    cardStat: '매일 잰 사람, 다시 찔 확률 82%↓',
    focus: false,
    readMin: 2,
    summary: '작은 변화를 일찍 알아채는 게 요요를 막는 가장 쉬운 방법이에요. KeepFit에서는 아침 체중을 재고 AI 코치에게 말하기만 하면 돼요.',
    facts: [
      {
        stat: '72% → 46%',
        text: '감량에 성공한 사람들을 18개월 추적했을 때, 2.3kg 이상 다시 찐 비율이 대조군 72%, 매일 체중을 재며 스스로 조절한 그룹 46%였어요.',
        refs: ['wing2006'],
      },
      {
        stat: '82%↓',
        text: '같은 연구의 개입 그룹에서 매일 체중을 잰 사람은 그렇지 않은 사람보다 다시 찔 가능성이 82% 낮았어요.',
        refs: ['wing2006'],
      },
    ],
    actionsTitle: '이번 주 이렇게 해요',
    actions: ['아침에 일어나 화장실 다녀온 뒤 재기', 'AI 코치 통화 때 숫자만 말하기', '유지 범위(±2kg)를 벗어나면 식사·운동 바로 조정'],
    refs: ['wing2006'],
  },
]

export const reboundArticle: Guide = {
  id: 'rebound',
  icon: 'book',
  title: '단약 후 요요는 왜 올까?',
  cardStat: '',
  focus: false,
  readMin: 3,
  summary: '요요는 의지가 약해서가 아니라 몸의 자연스러운 반응이에요. 약의 식욕 억제 효과가 사라지고, 감량 중 빠진 근육만큼 쓰는 에너지도 줄었기 때문이에요. 그래서 단약 전후 몇 달이 가장 중요해요.',
  facts: [
    {
      stat: '2/3',
      text: '세마글루타이드(위고비 성분)를 끊고 1년 뒤, 참가자들은 감량한 체중의 약 3분의 2를 다시 회복했어요.',
      refs: ['wilding2022'],
    },
    {
      stat: '14%',
      text: '터제파타이드(마운자로 성분)를 끊고 위약으로 바꾼 그룹은 52주 동안 체중이 14% 다시 늘었고, 82%가 감량분의 25% 이상을 회복했어요.',
      refs: ['aronne2024'],
    },
    {
      stat: '운동이 차이',
      text: '반면 치료 중 운동을 병행한 사람들은 치료를 끝낸 1년 뒤에도 체중과 체성분이 더 잘 유지됐어요.',
      refs: ['jensen2024'],
    },
  ],
  actionsTitle: 'KeepFit이 돕는 것',
  actions: ['매일 AI 전화로 식욕·체중 변화를 일찍 알아채기', '근력 운동과 단백질로 근육 지키기', '위험 신호가 보이면 원장님이 바로 확인하기'],
  refs: ['wilding2022', 'aronne2024', 'jensen2024'],
}

export const allGuides = [...guides, reboundArticle]
