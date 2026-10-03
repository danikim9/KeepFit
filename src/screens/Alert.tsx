import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { patient, scenarios, visitSlots } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useLink, writeLink } from '../state/link'

export default function Alert() {
  const { scenario, bookedSlot, update } = useAppState()
  const link = useLink()
  const alert = scenarios[scenario].alert
  // A request sent from the clinic dashboard wins over the built-in demo data
  const request = link.visitRequest
  const slots = request?.slots ?? visitSlots
  const message = request?.message ?? alert?.message
  const booked = link.booking?.slot ?? bookedSlot
  const [picked, setPicked] = useState<string | null>(null)
  const grouped = slots.length > 3
  const slot = picked && slots.includes(picked) ? picked : grouped ? slots[0] : (slots[1] ?? slots[0])
  const days = [...new Set(slots.map((s) => s.split('\n')[0]))]
  const day = slot.split('\n')[0]

  if (!request && !alert) {
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

  const book = () => {
    update({ bookedSlot: slot })
    writeLink({ booking: { slot, at: Date.now() } })
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
          {request ? '내원을 요청했어요' : '상태를 확인하고 있어요'}
        </h1>
      </div>

      {(alert || request?.signals) && (
        <section className="card card--warn">
          <b style={{ fontSize: 14 }} className="text-warn-strong">
            이런 신호가 감지됐어요
          </b>
          {alert ? (
            <>
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 14 }}>
                <span>최근 7일 식욕 평균</span>
                <b>{alert.appetiteAvg}</b>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 14 }}>
                <span>2주간 체중 변화</span>
                <b>{alert.weightChange}</b>
              </div>
            </>
          ) : (
            <span style={{ fontSize: 14 }}>{request?.signals}</span>
          )}
        </section>
      )}

      {message && (
        <section className="card" style={{ flexDirection: 'row', gap: 12 }}>
          <div className="avatar" />
          <div className="stack" style={{ gap: 2 }}>
            <span className="small">원장님 메시지</span>
            <span style={{ fontSize: 14, lineHeight: 1.55 }}>{message}</span>
          </div>
        </section>
      )}

      {booked ? (
        <section className="card card--accent" style={{ alignItems: 'center', textAlign: 'center' }}>
          <b style={{ color: 'var(--accent-strong)' }}>예약이 확정됐어요</b>
          <span style={{ fontSize: 15 }}>{booked.replace('\n', ' ')}</span>
          <span className="small">원장님께 지난 2주 리포트가 함께 전달됐어요</span>
        </section>
      ) : request || alert ? (
        <div className="stack" style={{ gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{request ? '원장님이 열어 둔 시간 중에 골라 주세요' : '가능한 시간'}</span>
          {grouped ? (
            <>
              {/* 시간이 많으면 날짜 → 시간 순서로 고르기 */}
              <div className="day-tabs" role="group" aria-label="날짜">
                {days.map((d) => {
                  const [md, dow = ''] = d.split(' ')
                  return (
                    <button
                      key={d}
                      type="button"
                      className="chip day-chip"
                      aria-pressed={d === day}
                      onClick={() => setPicked(slots.find((s) => s.startsWith(d + '\n')) ?? null)}
                    >
                      <b>{md}</b>
                      <span>{dow.replace(/[()]/g, '')}</span>
                    </button>
                  )
                })}
              </div>
              <div className="slots">
                {slots
                  .filter((s) => s.startsWith(day + '\n'))
                  .map((s) => (
                    <button key={s} type="button" className="chip" aria-pressed={slot === s} onClick={() => setPicked(s)}>
                      {s.split('\n')[1]}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <div className="slots">
              {slots.map((s) => (
                <button key={s} type="button" className="chip" aria-pressed={slot === s} onClick={() => setPicked(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="footer">
        {booked ? (
          <Link to="/home" className="btn">
            홈으로
          </Link>
        ) : (
          <button type="button" className="btn" onClick={book}>
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
