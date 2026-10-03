import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, pricing } from '../data/mock'

const features: { icon: IconName; title: string; warn?: boolean }[] = [
  { icon: 'phone', title: 'AI 코치 전화' },
  { icon: 'list', title: '단약 단계별 가이드' },
  { icon: 'chart', title: '원장님 공유 리포트' },
  { icon: 'bell', title: '위험 시 내원 알림', warn: true },
]

export default function Program() {
  return (
    <Screen>
      <TopBar back="/invite" step="2 / 3" />

      <div className="stack">
        <span className="eyebrow eyebrow--accent">{patient.clinic} 연동</span>
        <h1 className="h1">원장님과 함께, 월 {pricing.monthly}</h1>
        <p className="lead">식욕이 돌아오는 시기를 원장님과 함께 넘겨요.</p>
      </div>

      <section className="card feature-grid">
        {features.map((f) => (
          <div className="feature-grid__item" key={f.title}>
            <span className={`badge-icon badge-icon--sm${f.warn ? ' badge-icon--warn' : ''}`}>
              <Icon name={f.icon} size={15} />
            </span>
            {f.title}
          </div>
        ))}
      </section>

      <section className="card">
        <div className="section-title">
          <span>이용료</span>
          <span className="tag">첫 2주 무료</span>
        </div>
        <div className="stack" style={{ gap: 2 }}>
          <b style={{ fontSize: 24 }}>월 {pricing.monthly}</b>
          <span className="small">단계가 바뀌어도 요금은 같아요. 통화 횟수만 줄어요.</span>
        </div>
        {pricing.tiers.map((t, i) => (
          <div className={`tier${i === 0 ? ' is-current' : ''}`} key={t.period}>
            <b style={{ fontSize: 14 }}>
              {t.period} · {t.phase}
            </b>
            <span className="small">{t.calls}</span>
          </div>
        ))}
        <div style={{ height: 1, background: 'var(--line-soft)' }} />
        <span className="small" style={{ lineHeight: 1.5 }}>
          {pricing.refund}
        </span>
      </section>

      <div className="footer">
        <Link to="/setup" className="btn">
          {pricing.trialDays / 7}주 무료로 시작하기
        </Link>
        <span className="small" style={{ textAlign: 'center', lineHeight: 1.5 }}>
          회사 복지포인트 결제 가능 · 언제든 해지
          <br />
          약값·진료비는 병원에 별도로 내요
        </span>
      </div>
    </Screen>
  )
}
