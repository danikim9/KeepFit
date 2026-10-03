// Live link between the patient app and the clinic dashboard (clinic-dashboard/index.html).
// Both pages are served from the same origin, share one localStorage record, and pick up
// each other's writes through the browser's `storage` event. No server involved.
import { useEffect, useState } from 'react'
import { scenarios, type Line, type Scenario } from '../data/mock'

export const LINK_KEY = 'keepfit-link'
export const ALIVE_KEY = 'keepfit-patient-alive'

export type PatientSnapshot = {
  scenario: Scenario
  weight: number
  appetite: number // today
  appetiteAvg: number // 7-day average
  sleep: number
  weekly: { weight: number[]; appetite: number[] }
  said: string
  note: string
  transcript: Line[]
  callAt: number | null // set when a call finishes
  // 실제 음성 통화로 기록된 경우 (src/voice)
  live?: boolean
  duration?: string // "1분 48초"
  summary?: { label: string; value: string; warn?: boolean }[]
  feedback?: string
}

export type Link = {
  patient?: PatientSnapshot
  visitRequest?: { slots: string[]; message: string; signals?: string; at: number } | null
  booking?: { slot: string; at: number } | null
  memos?: { lines: string[]; tags: string[]; at: number }[]
  memoSeenAt?: number // when the patient last tapped 확인했어요 on a memo
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

export function snapshot(scenario: Scenario, callAt: number | null = null): PatientSnapshot {
  const d = scenarios[scenario]
  const said = [...d.transcript].reverse().find((l) => l.who === 'me' && /배고|당겼/.test(l.text))
  return {
    scenario,
    weight: d.weekly.weight[d.weekly.weight.length - 1],
    appetite: d.today.appetite,
    appetiteAvg: d.call.appetiteAvg,
    sleep: d.call.sleep,
    weekly: d.weekly,
    said: said?.text ?? '',
    note: d.call.note,
    transcript: d.transcript,
    callAt,
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
