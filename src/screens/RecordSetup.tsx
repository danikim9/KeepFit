import { useNavigate } from 'react-router-dom'
import { Screen, TopBar } from '../components/Layout'
import { callTimes, recordItems } from '../data/mock'
import { useAppState } from '../state/AppState'

export default function RecordSetup() {
  const { callTime, callFallback, update } = useAppState()
  const navigate = useNavigate()

  return (
    <Screen>
      <TopBar back="/program" step="3 / 3" />

      <div className="stack">
        <h1 className="h1">
          하루 30초,
          <br />
          언제 기록할까요?
        </h1>
        <p className="lead">정한 시간에 알림이 와요. 기록은 원장님께 자동으로 전달돼요.</p>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>기록 알림 시간</span>
        <div className="chips">
          {callTimes.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={callTime === t} onClick={() => update({ callTime: t })}>
              {t}
            </button>
          ))}
        </div>
        <span className="small">단약 후 3개월까지는 매일, 그 뒤로는 주 3회로 줄어요 (원장님 설정)</span>
      </div>

      <section className="card" style={{ gap: 12 }}>
        <span className="eyebrow" style={{ fontWeight: 600 }}>이것만 기록해요</span>
        <div className="q-grid">
          {recordItems.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </section>

      <label className="toggle-row">
        <span>
          기록을 2일 놓치면
          <br />
          AI 코치가 전화로 대신 물어봐요
        </span>
        <input type="checkbox" checked={callFallback} onChange={(e) => update({ callFallback: e.target.checked })} />
      </label>

      <div className="footer">
        <button
          type="button"
          className="btn"
          onClick={() => {
            update({ onboarded: true })
            navigate('/home')
          }}
        >
          설정 완료
        </button>
      </div>
    </Screen>
  )
}
