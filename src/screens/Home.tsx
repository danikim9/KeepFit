import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { checkups, missions, nextVisit, patient, program, scenarios, stages } from '../data/mock'
import { useAppState } from '../state/AppState'
import { timeAgo, useLink, writeLink } from '../state/link'

export default function Home() {
  const { scenario, callTime, callFallback, missionsDone, bookedSlot, lastEntry, update, reset } = useAppState()
  const link = useLink()
  const data = scenarios[scenario]
  // 방금 AI 코치 체크인(통화·버튼)으로 기록된 값이 있으면 그걸 보여줘요
  const lp = link.patient?.live ? link.patient : null
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
  // 오늘 앱에서 기록했으면 그 값, 아니면 최근 기록(데모 데이터)
  const recordedToday = !!lastEntry && new Date(lastEntry.at).toDateString() === new Date().toDateString()
  // 방금 AI 코치 통화로 기록됐으면 그 값, 오늘 앱에서 기록했으면 그 값, 아니면 최근 기록(데모 데이터)
  const today = lp
    ? { weight: lp.weight, appetite: lp.appetite, sleep: lp.sleep, stress: lp.stress, symptoms: lp.symptoms }
    : recordedToday && lastEntry
      ? lastEntry
      : data.today
  const inRange = Math.abs(today.weight - patient.targetWeight) <= patient.rangeKg
  const inquiries = link.inquiries ?? []
  const newReply = inquiries.find((q) => q.reply && !q.replySeenAt)
  const visitQs = inquiries.filter((q) => q.kind === 'visit' && !q.reply).length
  const visitDay = (booked ?? nextVisit.slot).replace('\n', ' ')
  const sosLog = link.sosLog ?? []
  const sosCount = data.sos.count + sosLog.length
  const sosResisted = data.sos.resisted + sosLog.filter((e) => e.outcome !== 'ate').length

  return (
    <Screen tabs>
      <header className="row" style={{ justifyContent: 'space-between', minHeight: 44 }}>
        <div className="stack" style={{ gap: 0 }}>
          <span className="eyebrow">{patient.clinic} 유지 프로그램</span>
          <b style={{ fontSize: 20 }}>{patient.name}님, 좋은 저녁이에요</b>
        </div>
        <Link to="/alert" className="icon-btn" aria-label="알림" style={{ color: 'var(--text)' }}>
          <Icon name="bell" />
          {((showAlert && !booked) || memoIsNew || !!newReply) && <span className="dot" />}
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

      {newReply && (
        <Link to="/ask" className="card card--new" style={{ flexDirection: 'row', alignItems: 'center', textDecoration: 'none', color: 'var(--text)' }}>
          <div className="avatar" />
          <div className="stack spacer" style={{ gap: 2 }}>
            <b style={{ fontSize: 15 }}>원장님 답변이 왔어요</b>
            <span className="small">“{newReply.text}”</span>
          </div>
          <Icon name="forward" size={18} />
        </Link>
      )}

      {memoIsNew && memoCard}

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">다음 진료</span>
            <b style={{ fontSize: 16 }}>
              {visitDay} · {booked ? '내원 요청 진료' : nextVisit.purpose}
            </b>
          </div>
          <Link to="/ask" className="btn btn--small btn--outline" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
            질문 남기기
          </Link>
        </div>
        <span className="small" style={{ lineHeight: 1.5 }}>
          {recordedToday ? '오늘 기록이 원장님 차트에 들어갔어요 · 병원에서 체중 재기와 기본 문진을 건너뛰어요' : '진료 전에 기록하면 병원에서 체중 재고 기다리는 시간이 줄어요'}
          {visitQs > 0 && <b style={{ color: 'var(--accent-strong)' }}> · 진료 때 물어볼 것 {visitQs}개</b>}
        </span>
      </section>

      <section className="card card--dark">
        <div className="badge-icon" style={{ width: 44, height: 44, borderRadius: 22, background: recordedToday ? '#3a3a3a' : 'var(--accent)', color: '#fff' }}>
          <Icon name={recordedToday ? 'check' : 'scale'} size={20} />
        </div>
        <div className="stack spacer" style={{ gap: 2 }}>
          <span style={{ fontSize: 12, color: '#c9c9c4' }}>{recordedToday ? '오늘 기록 완료 · 원장님께 전달됨' : `오늘 기록 · 알림 ${callTime}`}</span>
          <b style={{ fontSize: 16 }}>{recordedToday ? '내일도 30초면 돼요' : '체중·식욕·수면 30초'}</b>
        </div>
        <Link to="/checkin" className="btn btn--small">
          {recordedToday ? '수정' : '기록하기'}
        </Link>
      </section>
      <Link to="/sos" className="card sos-card">
        <div className="badge-icon">
          <Icon name="utensils" size={20} />
        </div>
        <div className="stack spacer" style={{ gap: 2 }}>
          <b style={{ fontSize: 16 }}>식욕 SOS · 지금 먹고 싶어요</b>
          <span className="small">
            이번 주 {sosCount}번 중 {sosResisted}번 넘겼어요
          </span>
        </div>
        <Icon name="forward" size={18} />
      </Link>

      {callFallback && (
        <Link to="/call" className="small" style={{ textAlign: 'center', marginTop: -4 }}>
          기록을 2일 놓치면 AI 코치가 전화해요 · 지금 전화로 기록하기
        </Link>
      )}

      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <b style={{ fontSize: 15 }}>
            {program.stage}단계 · {stages[program.stage - 1].title} {program.stageWeek}주차
          </b>
          <span className="eyebrow">
            {program.stageWeek} / {program.stageWeeks}주
          </span>
        </div>
        <div className="progress">
          <div style={{ width: `${(program.stageWeek / program.stageWeeks) * 100}%` }} />
        </div>
        <span className="eyebrow">
          다음 점검 내원 · {checkups[0].when} ({checkups[0].date.replace(' 예정', '')})
        </span>
      </section>

      <div className="section-title" style={{ marginTop: 4 }}>
        <span>{lp ? '방금 AI 통화로 기록된 내 상태' : recordedToday ? '오늘 기록한 내 상태' : '최근 기록된 내 상태'}</span>
        <Link to="/report">리포트 보기</Link>
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
          <span className={`small${today.appetite >= 7 ? ' text-warn' : ''}`}>{lp || recordedToday ? (today.appetite >= 8 ? '주의 기준 8 이상' : '오늘 기록') : data.appetiteNote}</span>
        </div>
        <div className="tile">
          <span className="tile__label">스트레스</span>
          <span className="tile__value">
            {today.stress ?? data.today.stress}
            <small>/10</small>
          </span>
          <span className={`small${(today.stress ?? 0) >= 8 ? ' text-warn' : ''}`}>수면 {today.sleep}시간</span>
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
            update({ scenario: isRisk ? 'normal' : 'risk', bookedSlot: null, lastEntry: null })
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

