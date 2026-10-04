// 통화든 버튼 응답이든, 체크인 결과를 대시보드로 보내는 형식은 같아요.
import { scenarios, type Line, type Scenario } from '../data/mock'
import type { PatientSnapshot } from '../state/link'
import { feedback, isRisk, noteLine, summaryRows, type Answers } from './script'

export function buildSnapshot(
  a: Answers,
  scenario: Scenario,
  transcript: Line[],
  seconds: number,
  method: 'call' | 'tags',
): PatientSnapshot {
  const sc: Scenario = isRisk(a) ? 'risk' : scenario
  const base = scenarios[sc]
  const weekly = { weight: [...base.weekly.weight], appetite: [...base.weekly.appetite], stress: [...base.weekly.stress] }
  if (typeof a.weight === 'number') weekly.weight[weekly.weight.length - 1] = a.weight
  if (typeof a.appetite === 'number') weekly.appetite[weekly.appetite.length - 1] = a.appetite
  const avg = Math.round((weekly.appetite.reduce((x, y) => x + y, 0) / weekly.appetite.length) * 10) / 10
  const s = Math.max(1, Math.round(seconds))
  const time = `${Math.floor(s / 60)}분 ${String(s % 60).padStart(2, '0')}초`
  return {
    scenario: sc,
    weight: weekly.weight[weekly.weight.length - 1],
    appetite: typeof a.appetite === 'number' ? a.appetite : base.today.appetite,
    appetiteAvg: avg,
    sleep: typeof a.sleep === 'number' ? a.sleep : base.call.sleep,
    // 통화에서는 스트레스·증상을 묻지 않아서 최근 기록값을 그대로 보내요
    stress: base.today.stress,
    stressAvg: Math.round((weekly.stress.reduce((x, y) => x + y, 0) / weekly.stress.length) * 10) / 10,
    symptoms: base.today.symptoms,
    weekly,
    said: a.doseQuestion ?? a.appetiteWords ?? a.extra ?? '',
    note: noteLine(a),
    transcript,
    callAt: Date.now(),
    source: 'call',
    sos: { count: base.sos.count, resisted: base.sos.resisted },
    live: true,
    duration: method === 'call' ? time : `버튼 응답 · ${time}`,
    summary: summaryRows(a, avg),
    feedback: feedback(a),
  }
}
