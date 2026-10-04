// Live link between the patient app and the clinic dashboard (clinic-dashboard/index.html).
// Both pages are served from the same origin, share one localStorage record, and pick up
// each other's writes through the browser's `storage` event. No server involved.
import { useEffect, useState } from 'react'
import { scenarios, type AskKind, type Line, type Scenario, type SosOutcome } from '../data/mock'

export const LINK_KEY = 'keepfit-link'
export const ALIVE_KEY = 'keepfit-patient-alive'

export type PatientSnapshot = {
  scenario: Scenario
  weight: number
  appetite: number // today
  appetiteAvg: number // 7-day average
  sleep: number
  stress: number // today
  stressAvg: number // 7-day average
  symptoms: string[]
  weekly: { weight: number[]; appetite: number[]; stress: number[] }
  said: string
  note: string
  transcript: Line[]
  callAt: number | null // set when the patient records (app check-in or AI call)
  source: 'app' | 'call' // how the latest record came in
  sos: { count: number; resisted: number } // 이번 주 식욕 SOS (앱에서 쓴 것은 sosLog로 따로 옴)
  // 실제 음성 통화로 기록된 경우 (src/voice)
  live?: boolean
  duration?: string // "1분 48초"
  summary?: { label: string; value: string; warn?: boolean }[]
  feedback?: string
}

// 환자가 진료 사이에 남긴 질문. 원장님 차트·문의함에 자동으로 올라가요
export type Inquiry = {
  id: string
  at: number
  kind: AskKind // visit: 다음 진료 때 물어볼 것 · ask: 지금 답변 받고 싶은 것
  text: string
  reply?: { lines: string[]; tags: string[]; at: number }
  replySeenAt?: number
}

export type SosEntry = { at: number; intensity: number; kind: string; outcome: SosOutcome }

export type Link = {
  patient?: PatientSnapshot
  visitRequest?: { slots: string[]; message: string; signals?: string; at: number } | null
  booking?: { slot: string; at: number } | null
  memos?: { lines: string[]; tags: string[]; at: number }[]
  memoSeenAt?: number // when the patient last tapped 확인했어요 on a memo
  sosLog?: SosEntry[] // 식욕 SOS uses from the patient app
  inquiries?: Inquiry[]
  callRequest?: { at: number } | null // 대시보드에서 "지금 AI 전화 걸기" → 환자 앱에 전화가 울려요
}

export function readLink(): Link {
  try {
    return JSON.parse(localStorage.getItem(LINK_KEY) || '{}')
  } catch {
    return {}
  }
}

export function writeLink(patch: Partial<Link>) {
  try {
    localStorage.setItem(LINK_KEY, JSON.stringify({ ...readLink(), ...patch }))
  } catch {
    // storage unavailable; the dashboard just won't see this change
  }
  // `storage` only fires in other tabs, so tell this tab too
  window.dispatchEvent(new Event('keepfit-link'))
}

export function clearLink() {
  try {
    localStorage.removeItem(LINK_KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('keepfit-link'))
}

export function useLink(): Link {
  const [link, setLink] = useState<Link>(readLink)
  useEffect(() => {
    const sync = () => setLink(readLink())
    const onStorage = (e: StorageEvent) => {
      if (e.key === LINK_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('keepfit-link', sync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('keepfit-link', sync)
    }
  }, [])
  return link
}

type Entry = { weight: number; appetite: number; sleep: number; stress: number; symptoms: string[] }

export function snapshot(
  scenario: Scenario,
  callAt: number | null = null,
  source: 'app' | 'call' = 'call',
  entry?: Entry, // values the patient typed in the app check-in
): PatientSnapshot {
  const d = scenarios[scenario]
  const said = [...d.transcript].reverse().find((l) => l.who === 'me' && /배고|당겼/.test(l.text))
  const weight = [...d.weekly.weight]
  const appetite = [...d.weekly.appetite]
  const stress = [...d.weekly.stress]
  if (entry) {
    weight[weight.length - 1] = entry.weight
    appetite[appetite.length - 1] = entry.appetite
    stress[stress.length - 1] = entry.stress
  }
  const mean = (xs: number[]) => Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10
  const avg = entry ? mean(appetite) : d.call.appetiteAvg
  return {
    scenario,
    weight: weight[weight.length - 1],
    appetite: entry?.appetite ?? d.today.appetite,
    appetiteAvg: avg,
    sleep: entry?.sleep ?? d.call.sleep,
    stress: entry?.stress ?? d.today.stress,
    stressAvg: mean(stress),
    symptoms: entry?.symptoms ?? d.today.symptoms,
    weekly: { weight, appetite, stress },
    said: said?.text ?? '',
    note: entry ? `앱 기록 · 식욕 ${entry.appetite} · 스트레스 ${entry.stress} · 수면 ${entry.sleep}시간` : d.call.note,
    transcript: d.transcript,
    callAt,
    source,
    sos: { count: d.sos.count, resisted: d.sos.resisted },
  }
}

// Lets the dashboard know a patient app tab is open (so it waits for a real booking).
export function startHeartbeat() {
  const beat = () => {
    try {
      localStorage.setItem(ALIVE_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
  }
  beat()
  const id = setInterval(beat, 2000)
  return () => clearInterval(id)
}

export function timeAgo(at: number) {
  const min = Math.round((Date.now() - at) / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const h = Math.round(min / 60)
  return h < 24 ? `${h}시간 전` : `${Math.round(h / 24)}일 전`
}
