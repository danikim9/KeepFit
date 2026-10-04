import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { patient, program } from '../data/mock'

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
        <span className="eyebrow eyebrow--accent">첫 진료 때 원장님이 안내한 프로그램</span>
        <h1 className="h1" style={{ fontSize: 26 }}>
          {patient.name}님, 약을 끊은 뒤에도
          <br />
          원장님이 함께해요
        </h1>
        <p className="lead" style={{ fontSize: 15 }}>
          {patient.doctor} 원장님이 {patient.treatment.drug} 치료와 함께 체중 유지 프로그램에 등록했어요. 투약 중에도, 약을 줄이거나 끊은 뒤에도 내 기록이 원장님께 전달돼요.
        </p>
      </div>

      <section className="card" style={{ padding: 20, gap: 14 }}>
        <div className="section-title">
          <span className="eyebrow" style={{ fontWeight: 600 }}>병원에서 넘겨받은 치료 정보</span>
          <span className="tag">이용료 {program.patientFee}</span>
        </div>
        <div className="tiles">
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">처방</span>
            <span className="tile__value">{patient.treatment.drug}</span>
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">시작 체중</span>
            <span className="tile__value">{patient.treatment.startWeight}kg</span>
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <span className="tile__label">목표 체중</span>
            <span className="tile__value">{patient.targetWeight}kg</span>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--line-soft)' }} />
        <span className="eyebrow">
          약을 끊은 뒤 유지 범위:{' '}
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
        <p className="small">병원에 등록된 번호와 맞으면 원장님 차트와 연결돼요.</p>
      </div>

      <div className="footer">
        <Link to="/program" className="btn">
          시작하기
        </Link>
      </div>
    </Screen>
  )
}
