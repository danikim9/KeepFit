import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { scenarios } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useLink } from '../state/link'

export default function CallSummary() {
  const { scenario } = useAppState()
  const data = scenarios[scenario]
  // 방금 음성 통화로 기록된 값이 있으면 그걸 보여줘요
  const live = useLink().patient
  const isLive = !!live?.live && !!live.summary
  const rows = isLive ? live!.summary! : data.summary
  const lines = isLive ? live!.transcript : data.transcript
  const tip = isLive ? live!.feedback! : data.feedback
  const when = isLive && live!.callAt
    ? `오늘 ${new Date(live!.callAt).getHours()}:${String(new Date(live!.callAt).getMinutes()).padStart(2, '0')} · ${live!.duration}`
    : '10월 3일 저녁 9:02 · 2분 14초'
  const [playing, setPlaying] = useState(false)
  // Show the two lines around the appetite question as the excerpt
  const qIndex = Math.max(0, lines.findIndex((l) => l.text.includes('식욕')))
  const excerpt = lines.slice(qIndex, qIndex + 2)

  return (
    <Screen>
      <TopBar back="/home" title="오늘 통화 요약" />

      <section className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <button
          type="button"
          className="badge-icon"
          aria-label={playing ? '녹음 일시정지' : '통화 녹음 재생'}
          style={{ width: 44, height: 44, borderRadius: 22, border: 0, background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
          onClick={() => setPlaying((p) => !p)}
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} stroke={playing ? 2.5 : 1.8} />
        </button>
        <div className="stack spacer">
          <span className="eyebrow">{when}</span>
          <div style={{ height: 24, borderRadius: 4, background: 'repeating-linear-gradient(90deg, var(--muted-fill) 0 3px, transparent 3px 6px)' }} />
        </div>
      </section>

      <section className="card list" style={{ padding: '6px 16px' }}>
        {rows.map((r) => (
          <div className="list__row" key={r.label}>
            <span>{r.label}</span>
            <b className={r.warn ? 'text-warn' : undefined}>{r.value}</b>
          </div>
        ))}
      </section>

      <div className="stack" style={{ gap: 8 }}>
        <span className="eyebrow" style={{ fontWeight: 600 }}>대화 일부</span>
        {excerpt.map((l, i) => (
          <div key={i} className={`bubble bubble--${l.who}`}>
            {l.text}
          </div>
        ))}
      </div>

      <section className="card card--accent" style={{ gap: 4 }}>
        <b style={{ fontSize: 14, color: 'var(--accent-strong)' }}>AI 코치 피드백</b>
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>{tip}</span>
      </section>

      <div className="footer" style={{ alignItems: 'center' }}>
        <Link to={scenario === 'risk' ? '/alert' : '/home'} className="btn">
          확인했어요
        </Link>
        <button type="button" className="link-btn">
          잘못 기록된 값 수정하기
        </button>
      </div>
    </Screen>
  )
}
