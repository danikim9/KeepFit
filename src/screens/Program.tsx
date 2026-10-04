import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { checkups, patient, program, stages } from '../data/mock'

const features: { icon: IconName; title: string; detail: string; warn?: boolean }[] = [
  { icon: 'utensils', title: '식욕 SOS', detail: '먹고 싶을 때 누르면 10분 같이 버텨요' },
  { icon: 'scale', title: '30초 기록', detail: '체중·식욕·스트레스·수면이 원장님 차트에 자동 입력' },
  { icon: 'book', title: '원장님께 질문 남기기', detail: '진료 사이 궁금한 점, 다음 진료 때 물어볼 것' },
  { icon: 'bell', title: '위험 시 내원 요청', detail: '반등 신호가 보이면 원장님이 먼저 연락해요', warn: true },
  { icon: 'list', title: '단약 후 점검 내원', detail: `약을 끊은 뒤에도 ${checkups.length}번, 원장님이 직접 확인` },
]

export default function Program() {
  return (
    <Screen>
      <TopBar back="/invite" step="2 / 3" />

      <div className="stack">
        <span className="eyebrow eyebrow--accent">{patient.clinic} 제공</span>
        <h1 className="h1">
          약을 끊은 뒤 1년,
          <br />
          요요 없이 지켜요
        </h1>
        <p className="lead">GLP-1 치료를 마친 사람은 1년 안에 뺀 체중의 약 2/3가 돌아와요. 그 시기를 원장님과 함께 넘겨요.</p>
      </div>

      <section className="card list" style={{ padding: '4px 16px' }}>
        {features.map((f) => (
          <div className="feature" key={f.title}>
            <span className={`badge-icon badge-icon--sm${f.warn ? ' badge-icon--warn' : ''}`}>
              <Icon name={f.icon} size={15} />
            </span>
            <div>
              <b>{f.title}</b>
              <span>{f.detail}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <div className="section-title">
          <span>프로그램 흐름</span>
          <span className="tag">이용료 {program.patientFee}</span>
        </div>
        {stages.map((s, i) => (
          <div className={`tier${i === 0 ? ' is-current' : ''}`} key={s.title}>
            <b style={{ fontSize: 14 }}>
              {i + 1}. {s.title}
            </b>
            <span className="small" style={{ textAlign: 'right' }}>
              {s.detail.split(' · ')[0]}
            </span>
          </div>
        ))}
        <div style={{ height: 1, background: 'var(--line-soft)' }} />
        <span className="small" style={{ lineHeight: 1.5 }}>
          단약 후 점검 내원: {checkups.map((c) => c.when).join(' · ')}
        </span>
      </section>

      <div className="footer">
        <Link to="/setup" className="btn">
          무료로 시작하기
        </Link>
        <span className="small" style={{ textAlign: 'center', lineHeight: 1.5 }}>
          앱 이용료는 병원이 내요 · 약값·진료비는 기존처럼 병원에 내요
        </span>
      </div>
    </Screen>
  )
}
