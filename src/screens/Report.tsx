import { useState } from 'react'
import { Screen } from '../components/Layout'
import { patient, scenarios } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useLink } from '../state/link'

const APPETITE_ALERT = 8

function WeightChart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 320
  const H = 120
  const lo = patient.targetWeight - patient.rangeKg - 1.5
  const hi = patient.targetWeight + patient.rangeKg + 1.5
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H
  const x = (i: number) => 10 + (i * (W - 20)) / (values.length - 1)
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const last = values[values.length - 1]
  const out = Math.abs(last - patient.targetWeight) > patient.rangeKg

  return (
    <>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`체중 추이, 최근 ${last}kg`}>
        <rect x="0" y={y(patient.targetWeight + patient.rangeKg)} width={W} height={y(patient.targetWeight - patient.rangeKg) - y(patient.targetWeight + patient.rangeKg)} fill="var(--accent-soft)" />
        <line x1="0" x2={W} y1={y(patient.targetWeight)} y2={y(patient.targetWeight)} stroke="#9AAEE6" strokeDasharray="4 4" />
        <polyline points={points} fill="none" stroke={out ? 'var(--warn)' : 'var(--accent)'} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <circle cx={x(values.length - 1)} cy={y(last)} r="4" fill={out ? 'var(--warn)' : 'var(--accent)'} />
      </svg>
      <div className="days">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </>
  )
}

function AppetiteBars({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <>
      <div className="bars" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        <div className="bars__threshold" style={{ bottom: `${APPETITE_ALERT * 10}%` }} aria-hidden="true" />
        {values.map((v, i) => (
          <div key={i} className={`bars__bar${v >= 7 ? ' is-high' : ''}`} style={{ height: `${v * 10}%` }} title={`${labels[i]} ${v}`} />
        ))}
      </div>
      <div className="days">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </>
  )
}

export default function Report() {
  const { scenario } = useAppState()
  const data = scenarios[scenario]
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly')
  // 주간 그래프 마지막 날은 방금 체크인한 값으로
  const live = useLink().patient
  const series = range === 'weekly' && live?.live ? live.weekly : data[range]
  const labels = range === 'weekly' ? ['월', '화', '수', '목', '금', '토', '일'] : ['1주', '2주', '3주', '4주']
  const delta = series.weight[series.weight.length - 1] - series.weight[0]
  const appetiteMax = Math.max(...series.appetite)

  return (
    <Screen tabs>
      <header className="row" style={{ justifyContent: 'space-between', minHeight: 44 }}>
        <b style={{ fontSize: 20 }}>내 리포트</b>
        <span className="pill">원장님과 공유 중</span>
      </header>

      <div className="segmented" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <button type="button" aria-pressed={range === 'weekly'} onClick={() => setRange('weekly')}>
          주간
        </button>
        <button type="button" aria-pressed={range === 'monthly'} onClick={() => setRange('monthly')}>
          월간
        </button>
      </div>

      <section className="card">
        <div className="section-title">
          <span>체중</span>
          <span className="eyebrow" style={{ fontWeight: 400 }}>
            {range === 'weekly' ? '이번 주' : '이번 달'} {delta >= 0 ? '+' : ''}
            {delta.toFixed(1)}kg
          </span>
        </div>
        <WeightChart values={series.weight} labels={labels} />
        <span className="small">
          파란 영역 = 유지 범위 ({patient.targetWeight}kg ± {patient.rangeKg}kg)
        </span>
      </section>

      <section className="card">
        <div className="section-title">
          <span>식욕</span>
          <span className="text-warn" style={{ fontSize: 13, fontWeight: 400 }}>
            {appetiteMax >= APPETITE_ALERT ? `주의 기준 ${APPETITE_ALERT} 초과` : `주의 기준 ${APPETITE_ALERT} 근접`}
          </span>
        </div>
        <AppetiteBars values={series.appetite} labels={labels} />
      </section>

      <div className="tiles">
        <div className="tile">
          <span className="tile__label">통화 응답</span>
          <span className="tile__value">{data.stats.answered}</span>
        </div>
        <div className="tile">
          <span className="tile__label">미션 달성</span>
          <span className="tile__value">{data.stats.missions}</span>
        </div>
        <div className="tile">
          <span className="tile__label">평균 수면</span>
          <span className="tile__value">{data.stats.sleep}</span>
        </div>
      </div>
    </Screen>
  )
}
