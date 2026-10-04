import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { guides, reboundArticle } from '../data/guides'
import { checkups, program, stages } from '../data/mock'

export default function Guide() {
  const focus = guides.filter((g) => g.focus)
  const more = guides.filter((g) => !g.focus)

  return (
    <Screen tabs>
      <header className="row" style={{ minHeight: 44 }}>
        <b style={{ fontSize: 20 }}>단약 로드맵</b>
      </header>

      <section className="card roadmap" style={{ padding: 18, gap: 0 }}>
        {stages.map((s, i) => {
          const n = i + 1
          const status = n < program.stage ? 'done' : n === program.stage ? 'current' : 'upcoming'
          const last = i === stages.length - 1
          return (
            <div className="step" key={s.title}>
              <div className="step__rail">
                <div className={`step__dot is-${status}`}>{status === 'done' && <Icon name="check" size={12} stroke={3} />}</div>
                {!last && <div className={`step__line${status === 'done' ? ' is-done' : ''}`} />}
              </div>
              <div className={`step__body is-${status}`}>
                <b>
                  {n}단계 · {s.title}
                  {status === 'current' && ' (진행 중)'}
                </b>
                <span className="small">{s.detail}</span>
                {status === 'current' && (
                  <span className="small">
                    {program.stageWeek}주차 / {program.stageWeeks}주
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <div className="stack" style={{ gap: 4, marginTop: 4 }}>
        <b style={{ fontSize: 15 }}>약을 끊은 뒤 점검 내원</b>
        <span className="eyebrow">약을 끊어도 혼자가 아니에요. 원장님이 직접 확인해요</span>
      </div>
      <section className="card list" style={{ padding: '4px 16px' }}>
        {checkups.map((c) => (
          <div className="list__row" key={c.when}>
            <span className="stack" style={{ gap: 0 }}>
              <b style={{ color: 'var(--text)', fontSize: 14 }}>{c.when}</b>
              <span className="small">{c.what}</span>
            </span>
            <span className="small">{c.date}</span>
          </div>
        ))}
      </section>

      <div className="stack" style={{ gap: 4, marginTop: 4 }}>
        <b style={{ fontSize: 15 }}>이번 주 집중할 것</b>
        <span className="eyebrow">용량이 줄면 식욕이 돌아오고, 근육이 빠지기 쉬워요</span>
      </div>

      <div className="guide-grid">
        {focus.map((g) => (
          <Link to={`/guide/${g.id}`} className="card guide-card" key={g.id}>
            <span className="badge-icon">
              <Icon name={g.icon} size={18} />
            </span>
            <b style={{ fontSize: 15 }}>{g.title}</b>
            <span className="small" style={{ lineHeight: 1.45 }}>{g.cardStat}</span>
            <span className="guide-card__more">
              자세히 <Icon name="forward" size={14} />
            </span>
          </Link>
        ))}
      </div>

      <b style={{ fontSize: 15, marginTop: 4 }}>더 알아보기</b>
      <div className="stack" style={{ gap: 8 }}>
        {[...more, reboundArticle].map((g) => (
          <Link to={`/guide/${g.id}`} className="link-row" key={g.id}>
            <span className="row" style={{ gap: 10 }}>
              <span className="badge-icon badge-icon--sm">
                <Icon name={g.icon} size={15} />
              </span>
              <span className="stack" style={{ gap: 0 }}>
                <span>{g.title}</span>
                {g.cardStat && <span className="small">{g.cardStat}</span>}
              </span>
            </span>
            <span className="row" style={{ gap: 4, flexShrink: 0 }}>
              <span className="small">{g.readMin}분</span>
              <Icon name="forward" size={18} />
            </span>
          </Link>
        ))}
      </div>
    </Screen>
  )
}
