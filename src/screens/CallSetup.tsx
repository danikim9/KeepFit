import { useNavigate } from 'react-router-dom'
import { Screen, TopBar } from '../components/Layout'
import { callQuestions, callTimes, frequencies } from '../data/mock'
import { useAppState } from '../state/AppState'

export default function CallSetup() {
  const { frequency, callTime, textFallback, update } = useAppState()
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
        <p className="lead">기록은 통화로 끝나요. 따로 앱에 입력할 필요 없어요.</p>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>전화 빈도</span>
        <div className="segmented" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {frequencies.map((f) => (
            <button key={f} type="button" aria-pressed={frequency === f} onClick={() => update({ frequency: f })}>
              {f}
            </button>
          ))}
        </div>
        <span className="small">단약 초기 4주는 매일을 권장해요 (원장님 설정)</span>
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
      </div>

      <section className="card" style={{ gap: 12 }}>
        <span className="eyebrow" style={{ fontWeight: 600 }}>약 2분 통화, 이런 걸 물어봐요</span>
        <div className="q-grid">
          {callQuestions.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </section>

      <label className="toggle-row">
        <span>못 받으면 문자로 대신 답할게요</span>
        <input type="checkbox" checked={textFallback} onChange={(e) => update({ textFallback: e.target.checked })} />
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
