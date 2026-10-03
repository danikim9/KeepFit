import { Navigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen, TopBar } from '../components/Layout'
import { allGuides, refs } from '../data/guides'
import { useAppState } from '../state/AppState'

export default function GuideDetail() {
  const { id } = useParams()
  const { guideChecks, update } = useAppState()
  const guide = allGuides.find((g) => g.id === id)
  if (!guide) return <Navigate to="/guide" replace />

  // Number refs in the order the guide lists them
  const refNo = (rid: string) => guide.refs.indexOf(rid) + 1

  return (
    <Screen>
      <TopBar back="/guide" />

      <div className="stack" style={{ gap: 8 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="badge-icon badge-icon--sm">
            <Icon name={guide.icon} size={16} />
          </span>
          <span className="eyebrow eyebrow--accent">
            {guide.focus ? '이번 주 집중' : '읽을거리'} · {guide.readMin}분
          </span>
        </div>
        <h1 className="h1">{guide.title}</h1>
        <p className="lead">{guide.summary}</p>
      </div>

      <section className="stack" style={{ gap: 10 }}>
        <b style={{ fontSize: 15 }}>연구에서 밝혀진 것</b>
        {guide.facts.map((f) => (
          <div className="card fact" key={f.stat}>
            <span className="fact__stat">{f.stat}</span>
            <p className="fact__text">
              {f.text}
              {f.refs.map((r) => (
                <a key={r} href={`#ref-${guide.id}-${r}`} className="fact__ref" onClick={(e) => { e.preventDefault(); document.getElementById(`ref-${guide.id}-${r}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
                  [{refNo(r)}]
                </a>
              ))}
            </p>
          </div>
        ))}
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <b style={{ fontSize: 15 }}>{guide.actionsTitle}</b>
        <div className="card list" style={{ padding: '4px 16px' }}>
          {guide.actions.map((a, i) => {
            const key = `${guide.id}:${i}`
            const done = !!guideChecks[key]
            return (
              <label key={key} className={`check-row${done ? ' is-done' : ''}`}>
                <input type="checkbox" checked={done} onChange={(e) => update({ guideChecks: { ...guideChecks, [key]: e.target.checked } })} />
                <span className="spacer">{a}</span>
              </label>
            )
          })}
        </div>
      </section>

      {guide.table && (
        <section className="stack" style={{ gap: 10 }}>
          <b style={{ fontSize: 15 }}>{guide.table.title}</b>
          <div className="card list" style={{ padding: '4px 16px' }}>
            {guide.table.rows.map(([k, v]) => (
              <div className="list__row" key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
          {guide.table.note && <span className="small">{guide.table.note}</span>}
        </section>
      )}

      {guide.tips && (
        <section className="card card--accent" style={{ gap: 6 }}>
          <b style={{ fontSize: 14, color: 'var(--accent-strong)' }}>{guide.tips.title}</b>
          <ul className="tips">
            {guide.tips.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="stack" style={{ gap: 8 }}>
        <b style={{ fontSize: 15 }}>근거 논문</b>
        <ol className="refs">
          {guide.refs.map((rid) => (
            <li key={rid} id={`ref-${guide.id}-${rid}`}>
              <a href={refs[rid].url} target="_blank" rel="noreferrer">
                {refs[rid].cite}
                <Icon name="external" size={12} />
              </a>
            </li>
          ))}
        </ol>
        <p className="small" style={{ lineHeight: 1.5 }}>
          연구 결과를 쉽게 풀어 쓴 데모용 요약이에요. 약 조절과 식단·운동 강도는 담당 원장님과 상의하세요.
        </p>
      </section>
    </Screen>
  )
}
