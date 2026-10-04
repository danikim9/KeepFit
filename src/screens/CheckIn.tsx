import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, scenarios, symptomOptions } from '../data/mock'
import { useAppState } from '../state/AppState'
import { snapshot, writeLink } from '../state/link'

const APPETITE_ALERT = 8

// 하루 30초 앱 기록 (AI 코치 전화 대신 직접 기록) → 원장님 대시보드의 환자 차트에 자동 입력
export default function CheckIn() {
  const { scenario, lastEntry, update } = useAppState()
  const data = scenarios[scenario]
  const [weight, setWeight] = useState(lastEntry?.weight ?? data.today.weight)
  const [appetite, setAppetite] = useState<number | null>(lastEntry?.appetite ?? null)
  const [sleep, setSleep] = useState(lastEntry?.sleep ?? data.today.sleep)
  const [stress, setStress] = useState<number | null>(lastEntry?.stress ?? null)
  const [symptoms, setSymptoms] = useState<string[]>(lastEntry?.symptoms ?? data.today.symptoms)
  const toggleSymptom = (x: string) =>
    setSymptoms((cur) => (x === '없음' ? ['없음'] : cur.includes(x) ? cur.filter((y) => y !== x) : [...cur.filter((y) => y !== '없음'), x]))
  const ready = appetite != null && stress != null
  const [done, setDone] = useState(false)

  const round = (n: number) => Math.round(n * 10) / 10
  const over = Math.abs(weight - patient.targetWeight) > patient.rangeKg
  const flagged = over || (appetite ?? 0) >= APPETITE_ALERT || (stress ?? 0) >= 9

  const save = () => {
    if (appetite == null || stress == null) return
    const entry = { weight, appetite, sleep, stress, symptoms: symptoms.length ? symptoms : ['없음'] }
    update({ lastEntry: { ...entry, at: Date.now() } })
    writeLink({ patient: snapshot(scenario, Date.now(), 'app', entry) })
    setDone(true)
  }

  if (done) {
    return (
      <Screen>
        <TopBar back="/home" title="오늘 기록" />
        <div className="stack" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className={`badge-icon badge-icon--lg${flagged ? ' badge-icon--warn' : ''}`}>
            <Icon name={flagged ? 'alert' : 'check'} size={26} />
          </div>
          <h1 className="h1">
            기록했어요
            <br />
            {flagged ? '원장님께 바로 알렸어요' : '원장님 차트에 들어갔어요'}
          </h1>
        </div>
        <section className="card list" style={{ padding: '6px 16px' }}>
          <div className="list__row">
            <span>체중</span>
            <b className={over ? 'text-warn' : undefined}>
              {weight}kg {over ? '· 유지 범위 초과' : '· 유지 범위 안'}
            </b>
          </div>
          <div className="list__row">
            <span>식욕</span>
            <b className={(appetite ?? 0) >= APPETITE_ALERT ? 'text-warn' : undefined}>{appetite} / 10</b>
          </div>
          <div className="list__row">
            <span>스트레스</span>
            <b className={(stress ?? 0) >= 8 ? 'text-warn' : undefined}>{stress} / 10</b>
          </div>
          <div className="list__row">
            <span>수면</span>
            <b>{sleep}시간</b>
          </div>
          <div className="list__row">
            <span>불편한 증상</span>
            <b>{symptoms.join(', ') || '없음'}</b>
          </div>
        </section>
        <span className="small">다음 진료 때 체중 재기와 기본 문진을 이 기록으로 대신할 수 있어요.</span>
        <section className="card card--accent" style={{ gap: 4 }}>
          <b style={{ fontSize: 14, color: 'var(--accent-strong)' }}>오늘의 한마디</b>
          <span style={{ fontSize: 14, lineHeight: 1.55 }}>{data.feedback}</span>
        </section>
        <div className="footer">
          <Link to={flagged && scenario === 'risk' ? '/alert' : '/home'} className="btn">
            확인했어요
          </Link>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar back="/home" title="오늘 기록 · 30초" />

      <section className="card">
        <div className="section-title">
          <span>오늘 아침 체중</span>
          <span className="eyebrow" style={{ fontWeight: 400 }}>
            유지 범위 {patient.targetWeight - patient.rangeKg}–{patient.targetWeight + patient.rangeKg}kg
          </span>
        </div>
        <div className="stepper">
          <button type="button" aria-label="0.1kg 빼기" onClick={() => setWeight((w) => round(w - 0.1))}>
            −
          </button>
          <b className={over ? 'text-warn' : undefined}>
            {weight.toFixed(1)}
            <small>kg</small>
          </b>
          <button type="button" aria-label="0.1kg 더하기" onClick={() => setWeight((w) => round(w + 0.1))}>
            +
          </button>
        </div>
      </section>

      <section className="card">
        <span className="section-title">오늘 식욕은 어느 정도였어요?</span>
        <div className="scale10" role="group" aria-label="식욕 1–10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`chip${n >= APPETITE_ALERT ? ' is-high' : ''}`}
              aria-pressed={appetite === n}
              onClick={() => setAppetite(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="scale-ends">
          <span>1 · 거의 없음</span>
          <span>10 · 참기 힘듦</span>
        </div>
      </section>

      <section className="card">
        <span className="section-title">오늘 스트레스는요?</span>
        <div className="scale10" role="group" aria-label="스트레스 1–10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={`chip${n >= 8 ? ' is-high' : ''}`} aria-pressed={stress === n} onClick={() => setStress(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="scale-ends">
          <span>1 · 편안함</span>
          <span>10 · 매우 심함</span>
        </div>
      </section>

      <section className="card">
        <span className="section-title">어젯밤 잠은요?</span>
        <div className="stepper">
          <button type="button" aria-label="30분 빼기" onClick={() => setSleep((s) => Math.max(0, s - 0.5))}>
            −
          </button>
          <b>
            {sleep}
            <small>시간</small>
          </b>
          <button type="button" aria-label="30분 더하기" onClick={() => setSleep((s) => Math.min(12, s + 0.5))}>
            +
          </button>
        </div>
      </section>

      <section className="card">
        <span className="section-title">불편한 증상이 있었나요?</span>
        <div className="chips">
          {symptomOptions.map((x) => (
            <button key={x} type="button" className="chip" aria-pressed={symptoms.includes(x)} onClick={() => toggleSymptom(x)}>
              {x}
            </button>
          ))}
        </div>
      </section>

      <div className="footer">
        <button type="button" className="btn" disabled={!ready} style={ready ? undefined : { opacity: 0.4 }} onClick={save}>
          {appetite == null ? '식욕을 골라 주세요' : stress == null ? '스트레스를 골라 주세요' : '기록하고 원장님 차트에 보내기'}
        </button>
        <Link to="/call" className="link-btn" style={{ textAlign: 'center' }}>
          AI 코치 전화로 답하기
        </Link>
      </div>
    </Screen>
  )
}
