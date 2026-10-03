// AI 코치 전화의 대화 규칙. 소리(브라우저 음성, 실제 전화)와 상관없이 그대로 재사용해요.
// 원칙: 환자는 평소 말투로 대충 답해도 된다. 못 알아들으면 한 번만 다시 묻고 넘어간다.
// 용량·처방 질문에는 답하지 않고 원장님께 전달한다.

export type Slot = 'weight' | 'appetite' | 'sleep' | 'exercise' | 'extra'

export type Answers = {
  weight?: number | null // null = 안 쟀음 / 건너뜀
  appetite?: number | null
  sleep?: number | null
  exercise?: boolean | null
  extra?: string | null
  doseQuestion?: string // 환자가 한 용량 질문 원문
  appetiteWords?: string // 식욕을 말로 표현한 원문 (대시보드 "환자 한마디")
}

export const SLOTS: Slot[] = ['weight', 'appetite', 'sleep', 'exercise', 'extra']

export const TARGET = { weight: 70, range: 2 } // 유지 목표 70kg ±2kg (병원 설정)

const NATIVE: [string, number][] = [
  ['아홉', 9], ['여덟', 8], ['일곱', 7], ['여섯', 6], ['다섯', 5], ['하나', 1], ['둘', 2], ['셋', 3], ['넷', 4],
  ['한', 1], ['두', 2], ['세', 3], ['네', 4], ['열', 10],
]
const SINO: Record<string, number> = { 영: 0, 공: 0, 일: 1, 이: 2, 삼: 3, 사: 4, 오: 5, 육: 6, 륙: 6, 칠: 7, 팔: 8, 구: 9 }

function sinoToNumber(word: string): number | null {
  // 칠십이 → 72, 십 → 10, 구 → 9
  let total = 0
  let cur = 0
  for (const ch of word) {
    if (ch === '십') {
      total += (cur || 1) * 10
      cur = 0
    } else if (ch in SINO) cur = SINO[ch]
    else return null
  }
  return total + cur
}

/** 문장에서 숫자 하나를 찾아요. "72.6", "72점6", "칠십이 점 육", "아홉", "구요", "다섯 시간 반" */
export function parseNumber(text: string): number | null {
  const t = text.replace(/,/g, '.').trim()
  const dot = t.match(/(\d+)\s*점\s*(\d)/)
  if (dot) return parseFloat(`${dot[1]}.${dot[2]}`)
  const digits = t.match(/\d+(?:\.\d+)?/)
  if (digits) return parseFloat(digits[0])
  // 한자어 숫자는 단어 맨 앞에서만 (보통'이'요 같은 조사와 헷갈리지 않게)
  const sino = t.match(/(?:^|\s)([영공일이삼사오육륙칠팔구]*십[영공일이삼사오육륙칠팔구]?|[일이삼사오육칠팔구])(?:\s*점\s*([영공일이삼사오육륙칠팔구]))?(?=$|\s|[?.!]|요|이요|쯤|정도|키로|킬로|kg|시간)/)
  if (sino) {
    const whole = sinoToNumber(sino[1])
    if (whole !== null) return sino[2] ? whole + SINO[sino[2]] / 10 : whole
  }
  for (const [w, n] of NATIVE) {
    if (new RegExp(`(^|\\s)${w}(\\s|$|시간|개|요|쯤|정도|점)`).test(t)) return n
  }
  return null
}

const SKIP = /(안|못)\s*(쟀|재|잼|쟀어)|모르|몰라|기억\s*안/
const SAME = /(어제|지난번|저번).*(비슷|같|똑같|그대로)|그대로/

/** 질문 하나에 대한 답을 해석해요. undefined = 못 알아들음, null = 건너뜀 */
export function parseSlot(slot: Slot, text: string, prev: { weight: number }): number | boolean | string | null | undefined {
  // 체중·식욕을 물었는데 "다섯 시간 잤어요"까지 같이 말하면, 수면 숫자는 빼고 봐요
  const t = (slot === 'weight' || slot === 'appetite' ? text.replace(/\S+\s*시간(\s*반)?/g, ' ') : text).trim()
  if (slot === 'weight') {
    if (SKIP.test(t)) return null
    if (SAME.test(t)) return prev.weight
    const n = parseNumber(t)
    return n !== null && n >= 30 && n <= 200 ? Math.round(n * 10) / 10 : undefined
  }
  if (slot === 'appetite') {
    const n = parseNumber(t)
    if (n !== null && n >= 0 && n <= 10) return Math.round(n)
    if (/(엄청|너무|하루\s*종일|계속|많이|미친듯).*(배고|당기|당겼|먹고)|폭식/.test(t)) return 9
    if (/배고|당기|당겼|출출/.test(t)) return 7
    if (/보통|괜찮|그럭저럭|평소/.test(t)) return 5
    if (/없|별로|안\s*고|입맛\s*없/.test(t)) return 3
    return undefined
  }
  if (slot === 'sleep') {
    if (/잘\s*잤|푹/.test(t) && parseNumber(t) === null) return 7
    if (/못\s*잤|거의\s*안/.test(t) && parseNumber(t) === null) return 4
    const n = parseNumber(t)
    if (n === null || n > 14) return undefined
    return /반/.test(t) ? n + 0.5 : n
  }
  if (slot === 'exercise') {
    if (/(못|안)\s*했|못\s*해|안\s*해|아니|못했|안했|패스/.test(t)) return false
    if (/했|네|응|예|어\s*했|그럼|당연/.test(t)) return true
    return undefined
  }
  // extra
  if (/^(없|아니|괜찮|끝|됐|없어|없습)/.test(t) || /(없어요|없습니다|없어)$/.test(t)) return null
  return t
}

const DOSE = /약\s*관련\s*질문|(약|용량|주사|mg|밀리|위고비|마운자로).*(올려|늘려|줄여|끊|바꿔|어떻게|해야|돼요|되나|될까|맞|괜찮)|((올려|늘려)야)/
export const isDoseQuestion = (text: string) => DOSE.test(text)

/** 다른 질문에 대한 답도 같이 말했으면 미리 챙겨요. (질문 수를 줄여 귀찮음을 덜어요) */
export function extractExtra(text: string, answers: Answers) {
  if (answers.sleep === undefined && /시간/.test(text) && /잤|잠|수면/.test(text)) {
    const m = text.match(/(\S+?)\s*시간(\s*반)?/)
    const v = m ? parseSlot('sleep', `${m[1]} 시간${m[2] ? ' 반' : ''}`, { weight: 0 }) : undefined
    if (typeof v === 'number') answers.sleep = v
  }
  if (answers.exercise === undefined && /운동|헬스|근력/.test(text)) {
    const v = parseSlot('exercise', text, { weight: 0 })
    if (typeof v === 'boolean') answers.exercise = v
  }
}

/** 같이 말해 준 값도 기록했다고 짧게 알려줘요 */
export function extraAck(before: Answers, after: Answers): string {
  const parts: string[] = []
  if (before.sleep === undefined && typeof after.sleep === 'number') parts.push(`수면 ${after.sleep}시간`)
  if (before.exercise === undefined && typeof after.exercise === 'boolean') parts.push(after.exercise ? '근력 운동 하신 것' : '운동 못 하신 것')
  return parts.length ? `${parts.join(', ')}도 기록했어요.` : ''
}

export const GREETING = '지은님, 안녕하세요. 유지케어 AI 코치예요. 2분이면 끝나요.'

export const QUESTION: Record<Slot, string> = {
  weight: '오늘 아침 체중 재셨어요? 대충만 말씀해 주셔도 돼요.',
  appetite: '오늘 식욕은 1부터 10 중에 어느 정도였어요?',
  sleep: '어젯밤엔 몇 시간 주무셨어요?',
  exercise: '오늘 근력 운동은 하셨어요?',
  extra: '마지막으로, 원장님께 전할 말 있으세요? 없으면 없다고 해 주세요.',
}

export const REPROMPT: Record<Slot, string> = {
  weight: '숫자만 대충 말씀해 주세요. 예를 들면, 칠십 점 오요.',
  appetite: '1부터 10 중에 숫자 하나만 말씀해 주세요.',
  sleep: '몇 시간 정도 주무셨어요?',
  exercise: '했어요, 못 했어요 중에 말씀해 주세요.',
  extra: '없으면 없다고 해 주세요.',
}

export const SKIP_LINE = '괜찮아요, 넘어갈게요.'
export const DOSE_LINE = '그건 원장님과 상의할 부분이라 제가 답하긴 어려워요. 질문 그대로 원장님께 전달할게요.'

const over = (w?: number | null) => typeof w === 'number' && Math.abs(w - TARGET.weight) > TARGET.range

export function ack(slot: Slot, v: Answers[keyof Answers]): string {
  if (slot === 'weight') {
    if (v === null) return '괜찮아요, 내일 아침에 재 주세요.'
    return over(v as number) ? `${v}킬로그램, 기록했어요. 목표 범위보다 조금 높네요.` : `${v}킬로그램, 기록했어요. 범위 안이에요.`
  }
  if (slot === 'appetite') return (v as number) >= 8 ? `${v}점이요. 많이 배고프셨겠어요.` : `${v}점, 알겠어요.`
  if (slot === 'sleep') return (v as number) < 6 ? `${v}시간이요. 조금 짧았네요.` : `${v}시간이요. 잘 주무셨네요.`
  if (slot === 'exercise') return v ? '잘하셨어요.' : '괜찮아요, 내일 20분만 해 봐요.'
  return v ? '그대로 원장님께 전할게요.' : '알겠어요.'
}

export function isRisk(a: Answers) {
  return over(a.weight) || (typeof a.appetite === 'number' && a.appetite >= 8)
}

export function feedback(a: Answers): string {
  if (isRisk(a)) return '식욕과 체중이 함께 오르는 건 흔한 반등 신호예요. 오늘 내용은 원장님께 바로 전달할게요. 내일은 저녁에 단백질부터 드셔 보세요.'
  if (typeof a.sleep === 'number' && a.sleep < 6) return '수면이 짧으면 식욕이 올라가요. 오늘은 12시 전에 주무셔 보세요.'
  if (a.exercise === false) return '내일은 근력 운동 20분만 챙겨 봐요. 근육이 유지돼야 요요가 덜 와요.'
  return '잘 유지하고 계세요. 지금처럼만 하면 충분해요.'
}

export const CLOSING = '요약은 앱에 보내 드릴게요. 좋은 밤 되세요.'

/** 통화 결과를 사람이 읽는 요약 행으로 (환자 앱 통화 요약 · 대시보드 공용) */
export function summaryRows(a: Answers, appetiteAvg: number) {
  const rows: { label: string; value: string; warn?: boolean }[] = []
  rows.push(
    typeof a.weight === 'number'
      ? { label: '체중', value: `${a.weight}kg${over(a.weight) ? ' · 유지 범위 초과' : ''}`, warn: over(a.weight) }
      : { label: '체중', value: '안 쟀음' },
  )
  rows.push(
    typeof a.appetite === 'number'
      ? { label: '식욕', value: `${a.appetite} / 10 · 7일 평균 ${appetiteAvg}`, warn: a.appetite >= 8 }
      : { label: '식욕', value: '기록 없음' },
  )
  rows.push({ label: '수면', value: typeof a.sleep === 'number' ? `${a.sleep}시간` : '기록 없음' })
  rows.push({ label: '근력 운동', value: a.exercise === true ? '했음' : a.exercise === false ? '못 했음' : '기록 없음' })
  rows.push({ label: '특이사항', value: a.extra || '없음' })
  if (a.doseQuestion) rows.push({ label: '원장님께 전달', value: '용량 질문', warn: true })
  return rows
}

export function noteLine(a: Answers) {
  const parts: string[] = []
  if (typeof a.appetite === 'number') parts.push(`식욕 ${a.appetite}`)
  if (typeof a.weight === 'number') parts.push(`체중 ${a.weight}kg`)
  if (typeof a.sleep === 'number') parts.push(`수면 ${a.sleep}시간`)
  if (a.exercise !== undefined && a.exercise !== null) parts.push(a.exercise ? '근력 운동 함' : '근력 운동 못 함')
  if (a.doseQuestion) parts.push('용량 질문 → 원장 전달')
  return parts.join(' · ')
}

/** 버튼으로도 답할 수 있게 (마이크가 안 되거나 말하기 싫을 때) */
export function quickReplies(slot: Slot, prevWeight: number): string[] {
  if (slot === 'weight') return [`${prevWeight}`, '어제랑 비슷해요', '안 쟀어요']
  if (slot === 'appetite') return ['3', '5', '7', '8', '9', '하루 종일 배고팠어요']
  if (slot === 'sleep') return ['5시간', '6시간', '7시간', '8시간']
  if (slot === 'exercise') return ['했어요', '못 했어요']
  return ['없어요', '약을 다시 올려야 할까요?', '밤마다 야식이 당겨요']
}
