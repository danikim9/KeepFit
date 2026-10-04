import { useNavigate } from 'react-router-dom'
import { Screen, TopBar } from '../components/Layout'
import { callTimes, recordItems } from '../data/mock'
import { useAppState } from '../state/AppState'

export default function RecordSetup() {
  const { callTime, aiCall, update } = useAppState()
  const navigate = useNavigate()

  return (
    <Screen>
      <TopBar back="/program" step="3 / 3" />

      <div className="stack">
        <h1 className="h1">
          AI 코치가 언제
          <br />
          전화하면 좋을까요?
        </h1>
        <p className="lead">통화로 답하면 기록이 끝나요. 통화가 어려우면 눌러서 답하거나 앱에서 30초 기록해도 돼요. 모두 원장님 차트에 자동으로 들어가요.</p>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>전화 시간</span>
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
        <span className="eyebrow" style={{ fontWeight: 600 }}>약 2분 통화, 이런 걸 물어봐요</span>
        <div className="q-grid">
          {recordItems.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </section>

      <label className="toggle-row">
        <span>
          AI 코치 전화 받기
          <br />
          <span className="small">끄면 앱 알림으로만 기록해요</span>
        </span>
        <input type="checkbox" checked={aiCall} onChange={(e) => update({ aiCall: e.target.checked })} />
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
