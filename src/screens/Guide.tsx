import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { program, stages } from '../data/mock'

export default function Guide() {
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
        <b style={{ fontSize: 15 }}>이번 주 집중할 것</b>
        <span className="eyebrow">용량이 줄면 식욕이 돌아오고, 근육이 빠지기 쉬워요</span>
      </div>

      <div className="guide-grid">
        <article className="card" style={{ padding: 14, gap: 8 }}>
          <div className="img-ph">이미지</div>
          <b style={{ fontSize: 14 }}>근육 지키기</b>
          <span className="small" style={{ lineHeight: 1.5 }}>맨몸 근력 운동 주 3회 · 영상 5편</span>
        </article>
        <article className="card" style={{ padding: 14, gap: 8 }}>
          <div className="img-ph">이미지</div>
          <b style={{ fontSize: 14 }}>식욕 다루기</b>
          <span className="small" style={{ lineHeight: 1.5 }}>단백질 먼저 먹는 식사 순서 · 편의점 조합</span>
        </article>
      </div>

      <a href="#/guide" className="link-row">
        <span>단약 후 요요는 왜 올까? (3분 읽기)</span>
        <Icon name="forward" size={18} />
      </a>
    </Screen>
  )
}
