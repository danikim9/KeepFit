import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, scenarios, SOS_MINUTES, sosActions, sosKinds, sosOutcomes, type SosOutcome } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useLink, writeLink } from '../state/link'

type Step = 'rate' | 'wait' | 'result' | 'done'

// 식욕 SOS: 먹고 싶을 때 누르면 → 지금 식욕 점수 → 10분 같이 기다리기 → 결과 기록 (원장님 리포트로)
export default function Sos() {
  const { scenario } = useAppState()
  const link = useLink()
  const base = scenarios[scenario].sos
  const log = link.sosLog ?? []
  const [step, setStep] = useState<Step>('rate')
  const [intensity, setIntensity] = useState<number | null>(null)
  const [kind, setKind] = useState<string | null>(null)
  const [tried, setTried] = useState<string[]>([])
  const [left, setLeft] = useState(SOS_MINUTES * 60)
  const [outcome, setOutcome] = useState<SosOutcome | null>(null)
  const memo = link.memos?.[link.memos.length - 1]?.lines[0] ?? '끼니마다 단백질부터 먼저 드세요.'

  useEffect(() => {
    if (step !== 'wait') return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [step])

  const save = (o: SosOutcome) => {
    setOutcome(o)
    writeLink({ sosLog: [...log, { at: Date.now(), intensity: intensity ?? 0, kind: kind ?? '', outcome: o }] })
    setStep('done')
  }

  const count = base.count + log.length
  const resisted = base.resisted + log.filter((e) => e.outcome !== 'ate').length

  if (step === 'rate') {
    return (
      <Screen>
        <TopBar back="/home" title="식욕 SOS" />
        <div className="stack">
          <h1 className="h1">
            지금 얼마나
            <br />
            먹고 싶어요?
          </h1>
          <p className="lead">바로 먹지 말고, 먼저 점수부터 매겨 봐요.</p>
        </div>
        <section className="card">
          <div className="scale10" role="group" aria-label="지금 식욕 1–10">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={`chip${n >= 8 ? ' is-high' : ''}`} aria-pressed={intensity === n} onClick={() => setIntensity(n)}>
                {n}
              </button>
            ))}
          </div>
          <div className="scale-ends">
            <span>1 · 조금</span>
            <span>10 · 참기 힘듦</span>
          </div>
        </section>
        <div className="stack" style={{ gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>어떤 배고픔에 가까워요?</span>
          <div className="chips">
            {sosKinds.map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" disabled={intensity == null} style={intensity == null ? { opacity: 0.4 } : undefined} onClick={() => setStep('wait')}>
            {intensity == null ? '점수를 골라 주세요' : `${SOS_MINUTES}분만 같이 기다려 볼게요`}
          </button>
        </div>
      </Screen>
    )
  }

  if (step === 'wait') {
    const mm = Math.floor(left / 60)
    const ss = String(left % 60).padStart(2, '0')
    return (
      <Screen>
        <TopBar back="/home" title="식욕 SOS" />
        <div className="breath" aria-live="polite">
          <div className="breath__ring">
            <b>
              {mm}:{ss}
            </b>
            <span>{left ? '천천히 숨 쉬어요' : '10분 지났어요'}</span>
          </div>
          <span className="lead" style={{ textAlign: 'center' }}>
            식욕 {intensity}점 · 바로 먹지 말고 {SOS_MINUTES}분만 기다려 봐요.
            <br />
            그동안 하나만 해 봐요.
          </span>
        </div>
        <div className="chips" style={{ justifyContent: 'center' }}>
          {sosActions.map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              aria-pressed={tried.includes(a)}
              onClick={() => setTried((t) => (t.includes(a) ? t.filter((x) => x !== a) : [...t, a]))}
            >
              {a}
            </button>
          ))}
        </div>
        <section className="card" style={{ flexDirection: 'row', gap: 12 }}>
          <div className="avatar" />
          <div className="stack" style={{ gap: 2 }}>
            <span className="small">{patient.doctor} 원장님 메모</span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{memo}</span>
          </div>
        </section>
        <div className="footer">
          <button type="button" className="btn" onClick={() => setStep('result')}>
            {left ? '지금 어떤지 기록하기' : '다 기다렸어요'}
          </button>
        </div>
      </Screen>
    )
  }

  if (step === 'result') {
    return (
      <Screen>
        <TopBar back="/home" title="식욕 SOS" />
        <div className="stack">
          <h1 className="h1">지금은 어때요?</h1>
          <p className="lead">어떤 답이든 괜찮아요. 원장님이 패턴을 보는 데 쓰여요.</p>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          {sosOutcomes.map((o) => (
            <button key={o.id} type="button" className="btn btn--secondary" onClick={() => save(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar back="/home" title="식욕 SOS" />
      <div className="stack" style={{ gap: 12, alignItems: 'flex-start' }}>
        <div className="badge-icon badge-icon--lg">
          <Icon name="check" size={26} />
        </div>
        <h1 className="h1">
          {outcome === 'resisted' ? '잘 넘겼어요' : outcome === 'protein' ? '좋은 선택이에요' : '괜찮아요, 기록한 것만으로 충분해요'}
        </h1>
        <p className="lead">
          {outcome === 'ate'
            ? '다음엔 단백질부터 먼저 먹어 봐요. 자주 반복되면 원장님이 먼저 연락드려요.'
            : '식욕이 올라오는 시간대와 이유가 쌓이면 원장님이 처방과 식단을 맞춰 줘요.'}
        </p>
      </div>
      <section className="card list" style={{ padding: '6px 16px' }}>
        <div className="list__row">
          <span>이번 주 식욕 SOS</span>
          <b>{count}번</b>
        </div>
        <div className="list__row">
          <span>먹지 않거나 단백질로 넘김</span>
          <b>{resisted}번</b>
        </div>
        <div className="list__row">
          <span>자주 오는 시간</span>
          <b>{scenarios[scenario].sos.peak}</b>
        </div>
      </section>
      <span className="small">원장님 대시보드에 함께 기록돼요.</span>
      <div className="footer">
        <Link to="/home" className="btn">
          홈으로
        </Link>
      </div>
    </Screen>
  )
}
