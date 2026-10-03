import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient } from '../data/mock'

const features: { icon: IconName; title: string; desc: string; warn?: boolean }[] = [
  { icon: 'phone', title: 'AI 코치 전화 체크인', desc: '앱을 열 필요 없이 2분 통화로 기록' },
  { icon: 'list', title: '단약 단계별 맞춤 가이드', desc: '용량 감량부터 자립 유지까지 주차별 미션' },
  { icon: 'chart', title: '주간 리포트', desc: '체중·식욕·수면 추이를 원장님과 공유' },
  { icon: 'bell', title: '위험 신호 시 내원 알림', desc: '식욕·체중이 기준을 넘으면 원장님이 호출', warn: true },
]

export default function Program() {
  return (
    <Screen>
      <TopBar back="/invite" step="2 / 3" />

      <div className="stack">
        <span className="eyebrow eyebrow--accent">{patient.clinic} 전용</span>
        <h1 className="h1">6개월 체중 유지 프로그램</h1>
        <p className="lead">
          단약 후 1년 안에 감량분의 약 2/3가 돌아온다고 해요. 식욕이 돌아오는 시기를 원장님과 함께 넘겨요.
        </p>
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

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px' }}>
        <span className="eyebrow" style={{ fontSize: 14 }}>6개월 패키지</span>
        <b style={{ fontSize: 22 }}>{patient.packagePrice}원</b>
      </div>

      <div className="footer">
        <Link to="/setup" className="btn">
          결제하고 프로그램 시작
        </Link>
        <span className="small" style={{ textAlign: 'center' }}>
          병원 원무과에서 이미 결제했다면 결제 없이 시작돼요
        </span>
      </div>
    </Screen>
  )
}
