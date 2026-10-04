import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnswerPanel } from '../components/AnswerPanel'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { patient, scenarios, type Line } from '../data/mock'
import { useAppState } from '../state/AppState'
import { readLink, writeLink } from '../state/link'
import {
  ack,
  CLOSING,
  DOSE_LINE,
  extractExtra,
  extraAck,
  feedback,
  GREETING,
  isDoseQuestion,
  parseSlot,
  QUESTION,
  REPROMPT,
  SKIP_LINE,
  SLOTS,
  type Answers,
  type Slot,
} from '../voice/script'
import { buildSnapshot } from '../voice/result'
import { canListen, listen, speak, stopSpeaking } from '../voice/speech'

// AI 코치 전화. 환자는 받고, 평소 말투로 대답만 하면 돼요.
// 마이크가 안 되거나 말하기 싫으면 아래 버튼으로도 답할 수 있어요.
export default function LiveCall() {
  const { scenario, update } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const nav = (location.state as { ring?: boolean; silent?: boolean } | null) ?? {}
  const ringing = nav.ring === true
  // 소리 없이 누르기: 말 대신 화면에서 답해요 (지하철·회의 중 등 통화가 어려울 때)
  const [silent, setSilent] = useState(nav.silent === true || location.pathname === '/call/tap')
  const silentRef = useRef(silent)
  const usedVoice = useRef(false)
  const [qn, setQn] = useState(0)
  const [phase, setPhase] = useState<'ring' | 'talk' | 'end'>(ringing ? 'ring' : 'talk')
  const [lines, setLines] = useState<Line[]>([])
  const [slot, setSlot] = useState<Slot | null>(null)
  const [interim, setInterim] = useState('')
  const [listening, setListening] = useState(false)
  const [micOk, setMicOk] = useState(canListen())
  const [seconds, setSeconds] = useState(0)

  const logRef = useRef<HTMLDivElement>(null)
  const alive = useRef(true)
  const micRef = useRef(micOk)
  const answerRef = useRef<((text: string | null) => void) | null>(null)
  const cancelHear = useRef<() => void>(() => {})
  const answers = useRef<Answers>({})
  const transcript = useRef<Line[]>([])
  const startedAt = useRef(0)
  const started = useRef(false)
  const finished = useRef(false)

  const prevWeight = scenarios[scenario].today.weight

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      cancelHear.current()
      stopSpeaking()
    }
  }, [])

  useEffect(() => {
    if (phase !== 'talk') return
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [phase])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines, interim])

  // 사용자가 직접 "지금 받기"를 눌러 들어왔으면 바로 통화 시작
  useEffect(() => {
    if (!ringing) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const push = (l: Line) => {
    transcript.current.push(l)
    setLines([...transcript.current])
  }

  const say = async (text: string) => {
    if (!alive.current) return
    push({ who: 'ai', text })
    if (silentRef.current) await new Promise((r) => setTimeout(r, 450))
    else await speak(text)
  }

  const toggleSilent = () => {
    const next = !silentRef.current
    silentRef.current = next
    setSilent(next)
    if (next) {
      stopSpeaking()
      cancelHear.current() // 듣기만 멈추고, 화면에서 답할 때까지 기다려요
    }
  }

  const micBlocked = () => {
    micRef.current = false
    setMicOk(false)
  }

  // 말 또는 버튼, 먼저 온 쪽을 답으로 받아요
  const hear = (s: Slot): Promise<string | null> =>
    new Promise((resolve) => {
      if (!alive.current) return resolve(null)
      setSlot(s)
      setQn((n) => n + 1)
      setInterim('')
      setListening(true)
      let done = false
      const done_ = (text: string | null) => {
        if (done) return
        done = true
        answerRef.current = null
        cancelHear.current()
        setListening(false)
        setInterim('')
        setSlot(null)
        if (text) push({ who: 'me', text })
        resolve(text)
      }
      answerRef.current = done_
      if (micRef.current && !silentRef.current) {
        const h = listen(setInterim, micBlocked)
        cancelHear.current = h.cancel
        h.result.then((t) => {
          if (t) {
            usedVoice.current = true
            done_(t)
          } else if (!silentRef.current) {
            // 아무 말이 없으면 화면으로 답할 시간을 조금 더 줘요
            setTimeout(() => done_(null), micRef.current ? 6000 : 30000)
          }
        })
      } else {
        // 소리 없이 답하는 중엔 누를 때까지 기다려요
        cancelHear.current = () => {}
      }
    })

  const ask = async (s: Slot, prefix = '') => {
    await say(prefix ? `${prefix} ${QUESTION[s]}` : QUESTION[s])
    let text = await hear(s)
    let v = text ? parseSlot(s, text, { weight: prevWeight }) : undefined
    if (v === undefined && alive.current) {
      await say(REPROMPT[s])
      text = await hear(s)
      v = text ? parseSlot(s, text, { weight: prevWeight }) : undefined
    }
    const a = answers.current
    const newDose = !!text && isDoseQuestion(text) && !a.doseQuestion
    if (text && newDose) a.doseQuestion = text
    const before = { ...a }
    if (text) extractExtra(text, a)
    const also = extraAck(before, a)
    if (v === undefined) {
      await say(newDose ? DOSE_LINE : SKIP_LINE)
      return
    }
    if (s === 'weight') a.weight = v as number | null
    if (s === 'appetite') {
      a.appetite = v as number
      if (text && !/^\s*\d+\s*(요|점)?\s*[?.]?\s*$/.test(text)) a.appetiteWords = text
    }
    if (s === 'sleep') a.sleep = v as number
    if (s === 'exercise') a.exercise = v as boolean
    // 용량 질문은 '원장님께 전달'로 따로 보여요
    if (s === 'extra') a.extra = newDose ? (text ?? '').replace(/,?\s*약\s*관련\s*질문\s*있어요/, '').trim() || null : (v as string | null)
    await say(newDose ? DOSE_LINE : `${ack(s, v as never)}${also ? ' ' + also : ''}`)
  }

  async function run() {
    if (started.current) return
    started.current = true
    setPhase('talk')
    startedAt.current = Date.now()
    let first = true
    for (const s of SLOTS) {
      if (!alive.current) return
      if (answers.current[s as keyof Answers] !== undefined) continue // 같이 말해 준 건 다시 안 물어요
      await ask(s, first ? GREETING : '')
      first = false
    }
    if (!alive.current) return
    await say(`${feedback(answers.current)} ${CLOSING}`)
    finish()
  }

  // 통화 결과를 대시보드로 보내고 요약 화면으로
  function finish() {
    if (finished.current) return
    finished.current = true
    alive.current = false
    cancelHear.current()
    stopSpeaking()
    setPhase('end')
    const snap = buildSnapshot(answers.current, scenario, transcript.current, (Date.now() - (startedAt.current || Date.now())) / 1000, usedVoice.current ? 'call' : 'tags')
    const sc = snap.scenario
    writeLink({ callRequest: null, patient: snap })
    if (sc !== scenario) update({ scenario: sc })
    setTimeout(() => navigate('/summary'), 900)
  }

  const decline = () => {
    writeLink({ callRequest: null })
    navigate('/home')
  }
  const answerSilently = () => {
    silentRef.current = true
    setSilent(true)
    run()
  }

  if (phase === 'ring') {
    return (
      <Screen dark>
        <div className="call call--ring">
          <span className="call__meta">{patient.clinic} · 오늘의 체크인</span>
          <div className="call__avatar">
            <Icon name="phone" size={40} />
          </div>
          <b style={{ fontSize: 26 }}>AI 코치</b>
          <span className="call__meta">2분이면 끝나요 · 대답만 하시면 돼요</span>

          <div className="ring__actions">
            <div className="ring__col">
              <button type="button" className="ring__btn ring__btn--no" onClick={decline} aria-label="거절">
                <Icon name="phone" size={28} />
              </button>
              <span>거절</span>
            </div>
            <div className="ring__col">
              <button type="button" className="ring__btn ring__btn--yes" onClick={() => run()} aria-label="받기">
                <Icon name="phone" size={28} />
              </button>
              <span>받기</span>
            </div>
          </div>
          <button type="button" className="ring__silent" onClick={answerSilently}>
            통화가 어려우면 · 소리 없이 눌러서 답하기
          </button>
        </div>
      </Screen>
    )
  }

  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <Screen dark>
      <div className={`call${slot ? ' has-panel' : ''}`}>
        <div className={`call__avatar${listening ? ' is-listening' : ''}`}>
          <Icon name="phone" size={40} />
        </div>
        <b style={{ fontSize: 22 }}>AI 코치</b>
        <span className="call__meta">{phase === 'end' ? '통화 종료 · 원장님께 전달했어요' : `${silent ? '소리 없이 답하는 중' : '통화 중'} · ${mm}:${ss}`}</span>
        {phase === 'talk' && (
          <button type="button" className="call__mode" onClick={toggleSilent}>
            {silent ? '말로 답하기로 바꾸기' : '소리 없이 눌러서 답하기'}
          </button>
        )}

        <div className="call__log" ref={logRef} aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={`bubble bubble--${l.who}`}>
              {l.text}
            </div>
          ))}
          {listening && (
            <div className="bubble bubble--me bubble--interim">
              {interim || (micOk && !silent ? '듣고 있어요… 말하거나 아래에서 눌러 주세요' : '아래에서 골라 주세요')}
            </div>
          )}
        </div>

        {slot && <AnswerPanel key={qn} slot={slot} prevWeight={prevWeight} onAnswer={(t) => answerRef.current?.(t)} />}
        {!micOk && !silent && phase === 'talk' && <span className="call__hint">마이크를 쓸 수 없어서 화면으로 답해요</span>}

        <button type="button" className="call__end" aria-label="통화 종료" onClick={finish}>
          <Icon name="phone" size={28} />
        </button>
      </div>
    </Screen>
  )
}

// 대시보드에서 "지금 AI 전화 걸기"를 누르면 어느 화면에 있든 전화가 울려요
export function IncomingCall() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const check = () => {
      const req = readLink().callRequest
      if (!req || ['/call', '/call/tap', '/os', '/checkin'].includes(location.pathname)) return
      let handled = 0
      try {
        handled = Number(sessionStorage.getItem('keepfit-call-handled') || 0)
      } catch {
        /* ignore */
      }
      if (req.at <= handled) return
      try {
        sessionStorage.setItem('keepfit-call-handled', String(req.at))
      } catch {
        /* ignore */
      }
      navigate('/call', { state: { ring: true } })
    }
    check()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'keepfit-link' || e.key === null) check()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [navigate, location.pathname])
  return null
}
