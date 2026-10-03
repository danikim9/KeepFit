import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, scenarios, visitSlots } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useClinicLink, writeLink } from '../state/clinicLink'

export default function Alert() {
  const { scenario, bookedSlot: localBooked, update } = useAppState()
  const link = useClinicLink()
  const visit = link.visit // 병원 대시보드에서 보낸 내원 요청
  const alert = scenarios[scenario].alert ?? (visit ? scenarios.risk.alert : undefined)
  const slots = visit?.slots.length ? visit.slots : visitSlots
  const bookedSlot = visit ? link.booked : localBooked
  const [picked, setSlot] = useState<string | null>(null)
  const slot = picked && slots.includes(picked) ? picked : (bookedSlot ?? slots[0])

  if (!alert) {
    return (
      <Screen>
        <TopBar back="/home" title="병원 알림" />
        <div className="card" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
          <b>새 알림이 없어요</b>
          <span className="small">식욕이나 체중이 기준을 넘으면 원장님이 여기로 연락드려요.</span>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar back="/home" title="병원 알림" />

      <div className="stack" style={{ gap: 12, alignItems: 'flex-start' }}>
        <div className="badge-icon badge-icon--warn badge-icon--lg">
          <Icon name="alert" size={26} />
        </div>
        <h1 className="h1">
          {patient.doctor} 원장님이
          <br />
          내원을 요청했어요
        </h1>
      </div>

      <section className="card card--warn">
        <b style={{ fontSize: 14 }} className="text-warn-strong">
          이런 신호가 감지됐어요
        </b>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 14 }}>
          <span>최근 7일 식욕 평균</span>
          <b>{alert.appetiteAvg}</b>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 14 }}>
          <span>2주간 체중 변화</span>
          <b>{alert.weightChange}</b>
        </div>
      </section>

      <section className="card" style={{ flexDirection: 'row', gap: 12 }}>
        <div className="avatar" />
        <div className="stack" style={{ gap: 2 }}>
          <span className="small">원장님 메시지</span>
          <span style={{ fontSize: 14, lineHeight: 1.55 }}>{visit?.message ?? alert.message}</span>
        </div>
      </section>

      {bookedSlot ? (
        <section className="card card--accent" style={{ alignItems: 'center', textAlign: 'center' }}>
          <b style={{ color: 'var(--accent-strong)' }}>예약이 확정됐어요</b>
          <span style={{ fontSize: 15 }}>{bookedSlot.replace('\n', ' ')}</span>
          <span className="small">원장님께 지난 2주 리포트가 함께 전달됐어요</span>
        </section>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{visit ? '원장님이 제안한 시간' : '가능한 시간'}</span>
          <div className="slots">
            {slots.map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={slot === s} onClick={() => setSlot(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="footer">
        {bookedSlot ? (
          <Link to="/home" className="btn">
            홈으로
          </Link>
        ) : (
          <button type="button" className="btn" onClick={() => {
              if (visit) writeLink({ booked: slot })
              update({ bookedSlot: slot })
            }}>
            {slot.replace('\n', ' ')} 예약하기
          </button>
        )}
        <a href="tel:0000000000" className="btn btn--secondary">
          병원에 전화하기
        </a>
      </div>
    </Screen>
  )
}
