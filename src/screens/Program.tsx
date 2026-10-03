import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, pricing } from '../data/mock'

const features: { icon: IconName; title: string; desc: string; warn?: boolean }[] = [
  { icon: 'phone', title: 'AI 코치 전화 체크인', desc: '앱을 열지 않아도 2분 통화로 기록' },
  { icon: 'chart', title: '개인 리포트', desc: '체중·식욕·수면 추이를 원장님과 공유' },
  { icon: 'list', title: '유지 단계 생활습관 안내', desc: '근거 있는 이번 주 행동 가이드' },
  { icon: 'bell', title: '상태가 나빠지면 의료진 확인', desc: '기준을 넘으면 원장님께 바로 전달', warn: true },
]

export default function Program() {
  return (
    <Screen>
      <TopBar back="/invite" step="2 / 3" />

      <div className="stack">
        <span className="eyebrow eyebrow--accent">{patient.clinic} 연동</span>
        <h1 className="h1">체중 유지 프로그램</h1>
        <p className="lead">감량 이후에도 원장님과 연결된 채로 관리해요.</p>
      </div>

      <section className="card list" style={{ padding: '8px 20px' }}>
        {features.map((f) => (
          <div className="feature" key={f.title}>
            <div className={`badge-icon${f.warn ? ' badge-icon--warn' : ''}`}>
              <Icon name={f.icon} size={18} />
            </div>
            <div>
              <b>{f.title}</b>
              <span>{f.desc}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="card price">
        <span className="eyebrow">이용료</span>
        <b className="price__value">월 {pricing.monthly}</b>
        <span className="small">평균 {pricing.avgMonths}개월 이용 · 언제든 해지</span>
      </section>

      <div className="footer">
        <Link to="/setup" className="btn">
          프로그램 시작하기
        </Link>
        <span className="small" style={{ textAlign: 'center' }}>
          약값·진료비는 병원에 별도로 내요 · 약 조절은 원장님이 결정해요
        </span>
      </div>
    </Screen>
  )
}
