import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { patient } from '../data/mock'

export default function Invite() {
  const [phone, setPhone] = useState('')
  const [verified, setVerified] = useState(false)

  return (
    <Screen>
      <div className="row" style={{ gap: 10, paddingTop: 28 }}>
        <div className="logo-box">로고</div>
        <b style={{ fontSize: 15 }}>{patient.clinic}</b>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <h1 className="h1" style={{ fontSize: 26 }}>
          {patient.name}님, 감량 치료를
          <br />잘 마치셨어요
        </h1>
        <p className="lead" style={{ fontSize: 15 }}>
          {patient.doctor} 원장님이 6개월 체중 유지 프로그램에 초대했어요. 약을 줄이는 동안 원장님이 계속 지켜볼게요.
        </p>
      </div>

      <section className="card" style={{ padding: 20, gap: 14 }}>
        <span className="eyebrow" style={{ fontWeight: 600 }}>병원에서 넘겨받은 치료 기록</span>
        <div className="tiles">
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">치료 기간</span>
            <span className="tile__value">{patient.treatment.months}개월</span>
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">감량</span>
            <span className="tile__value">-{patient.treatment.lostKg}kg</span>
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">처방</span>
            <span className="tile__value">{patient.treatment.drug}</span>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--line-soft)' }} />
        <span className="eyebrow">
          유지 목표 체중:{' '}
          <b style={{ color: 'var(--text)' }}>
            {patient.targetWeight}kg ± {patient.rangeKg}kg
          </b>
        </span>
      </section>

      <div className="stack" style={{ gap: 10 }}>
        <label htmlFor="phone" style={{ fontSize: 13, fontWeight: 600 }}>
          휴대폰 번호
        </label>
        <div className="field">
          <input
            id="phone"
            className="input"
            type="tel"
            inputMode="tel"
            placeholder={patient.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--secondary"
            style={{ width: 'auto', padding: '0 16px', borderColor: 'var(--text)', fontWeight: 600 }}
            onClick={() => setVerified(true)}
          >
            {verified ? '인증됨' : '인증'}
          </button>
        </div>
        <p className="small">병원에 등록된 번호로 AI 코치가 전화를 걸어요.</p>
      </div>

      <div className="footer">
        <Link to="/program" className="btn">
          초대 수락하고 시작하기
        </Link>
      </div>
    </Screen>
  )
}
