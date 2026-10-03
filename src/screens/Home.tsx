import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { missions, patient, program, scenarios, stages } from '../data/mock'
import { useAppState } from '../state/AppState'
import { timeAgo, useLink, writeLink } from '../state/link'

export default function Home() {
  const { scenario, callTime, missionsDone, bookedSlot, update, reset } = useAppState()
  const link = useLink()
  const data = scenarios[scenario]
  // 방금 AI 코치 체크인(통화·버튼)으로 기록된 값이 있으면 그걸 보여줘요
  const lp = link.patient?.live ? link.patient : null
  const today = lp ? { weight: lp.weight, appetite: lp.appetite, sleep: lp.sleep } : data.today
  const appetiteNote = lp ? (lp.appetite >= 8 ? '주의 기준 초과' : `7일 평균 ${lp.appetiteAvg}`) : data.appetiteNote
  const request = link.visitRequest
  const booked = link.booking?.slot ?? bookedSlot
  const isRisk = scenario === 'risk'
  const showAlert = isRisk || !!request
  const memo = link.memos?.[link.memos.length - 1]
  const memoIsNew = !!memo && memo.at > (link.memoSeenAt ?? 0)
  const memoCard = (
    <section
      className={`card${memoIsNew ? ' card--new' : ' card--dashed'}`}
      style={{ flexDirection: 'row', gap: 12 }}
    >
      <div className="avatar" />
      <div className="stack spacer" style={{ gap: 4 }}>
        <span className="small">
          {patient.doctor} 원장님 · {memo ? timeAgo(memo.at) : '2일 전'}
          {memoIsNew && <b style={{ marginLeft: 6, color: 'var(--accent)' }}>새 메모</b>}
        </span>
        {memo ? (
          memo.lines.map((l) => (
            <span key={l} style={{ fontSize: 14, lineHeight: 1.5 }}>
              {l}
            </span>
          ))
        ) : (
          <span style={{ fontSize: 14, lineHeight: 1.5 }}>
            체중 잘 유지하고 계세요. 다음 주에 0.25mg으로 한 단계 더 줄여볼게요.
          </span>
        )}
        {memoIsNew && (
          <button
            type="button"
            className="btn btn--small btn--outline"
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
            onClick={() => writeLink({ memoSeenAt: Date.now() })}
          >
            확인했어요
          </button>
        )}
      </div>
    </section>
  )
  const inRange = Math.abs(today.weight - patient.targetWeight) <= patient.rangeKg

  return (
    <Screen tabs>
      <header className="row" style={{ justifyContent: 'space-between', minHeight: 44 }}>
        <div className="stack" style={{ gap: 0 }}>
          <span className="eyebrow">{patient.clinic} 유지 프로그램</span>
          <b style={{ fontSize: 20 }}>{patient.name}님, 좋은 저녁이에요</b>
        </div>
        <Link to={showAlert ? '/alert' : '/summary'} className="icon-btn" aria-label="알림" style={{ color: 'var(--text)' }}>
          <Icon name="bell" />
          {((showAlert && !booked) || memoIsNew) && <span className="dot" />}
        </Link>
      </header>

      {showAlert && (
        <Link to="/alert" className="card card--warn" style={{ flexDirection: 'row', alignItems: 'center', textDecoration: 'none', color: 'var(--text)' }}>
          <div className="badge-icon badge-icon--warn">
            <Icon name="alert" size={18} />
          </div>
          <div className="stack spacer" style={{ gap: 2 }}>
            <b style={{ fontSize: 15 }} className="text-warn-strong">
              {booked ? '내원 예약이 확정됐어요' : request ? '원장님이 내원을 요청했어요' : '식욕·체중이 기준을 넘었어요'}
            </b>
            <span className="small">{booked ? booked.replace('\n', ' ') : request ? `가능한 시간 ${request.slots.length}개 중에서 골라 주세요` : '원장님이 확인하고 있어요'}</span>
          </div>
          <Icon name="forward" size={18} />
        </Link>
      )}

      {memoIsNew && memoCard}

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <b style={{ fontSize: 15 }}>
            {program.stage}단계 · {stages[program.stage - 1].title} {program.stageWeek}주차
          </b>
          <span className="eyebrow">
            D+{program.day} / {program.totalDays}
          </span>
        </div>
        <div className="progress">
          <div style={{ width: `${(program.day / program.totalDays) * 100}%` }} />
        </div>
        <span className="eyebrow">식욕이 조금씩 돌아오는 시기예요. 단백질을 먼저 챙겨요.</span>
      </section>

      <section className="card card--dark">
        <div className="badge-icon" style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--accent)', color: '#fff' }}>
          <Icon name="phone" size={20} />
        </div>
        <div className="stack spacer" style={{ gap: 2 }}>
          <span style={{ fontSize: 12, color: '#c9c9c4' }}>다음 AI 코치 전화</span>
          <b style={{ fontSize: 16 }}>오늘 {callTime}</b>
        </div>
        <Link to="/call" className="btn btn--small">
          지금 받기
        </Link>
      </section>
      <Link to="/checkin" className="link-row" style={{ minHeight: 44, marginTop: -8 }}>
        <span>통화가 어려우면 소리 없이 눌러서 답하기 · 20초</span>
        <Icon name="forward" size={16} />
      </Link>

      <div className="section-title" style={{ marginTop: 4 }}>
        <span>{lp ? '방금 체크인으로 기록된 내 상태' : '최근 통화로 기록된 내 상태'}</span>
        <Link to="/summary">요약 보기</Link>
      </div>
      <div className="tiles">
        <div className="tile">
          <span className="tile__label">체중</span>
          <span className="tile__value">
            {today.weight}
            <small>kg</small>
          </span>
          <span className={`small${inRange ? '' : ' text-warn'}`}>{inRange ? '유지 범위 안' : '유지 범위 초과'}</span>
        </div>
        <div className="tile">
          <span className="tile__label">식욕</span>
          <span className="tile__value">
            {today.appetite}
            <small>/10</small>
          </span>
          <span className="small text-warn">{appetiteNote}</span>
        </div>
        <div className="tile">
          <span className="tile__label">수면</span>
          <span className="tile__value">
            {today.sleep}
            <small>시간</small>
          </span>
          <span className="small">목표 7시간</span>
        </div>
      </div>

      <b style={{ fontSize: 15, marginTop: 4 }}>오늘의 미션</b>
      <section className="card list" style={{ padding: '4px 16px' }}>
        {missions.map((m) => {
          const done = !!missionsDone[m.id]
          return (
            <label key={m.id} className={`check-row${done ? ' is-done' : ''}`}>
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => update({ missionsDone: { ...missionsDone, [m.id]: e.target.checked } })}
              />
              <span className="spacer">{m.label}</span>
            </label>
          )
        })}
      </section>

      {!memoIsNew && memoCard}

      <div className="demo-bar" aria-label="데모 조작">
        <span>데모</span>
        <button
          type="button"
          onClick={() => {
            update({ scenario: isRisk ? 'normal' : 'risk', bookedSlot: null })
            writeLink({ visitRequest: null, booking: null })
          }}
        >
          {isRisk ? '정상 시나리오로' : '위험 신호 시나리오로'}
        </button>
        <button type="button" onClick={reset}>
          처음부터
        </button>
      </div>
    </Screen>
  )
}

