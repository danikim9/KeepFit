import { useEffect, useState } from 'react'

// Demo link between the clinic dashboard (clinic-dashboard/index.html) and this app.
// Both pages are served from the same origin, so they share localStorage and the
// `storage` event updates the other tab right away. In production this is the server.

export type ClinicMemo = { tags: string[]; lines: string[]; at: number }
export type ClinicVisit = { slots: string[]; message: string; sentAt: number }
export type ClinicLink = {
  visit: ClinicVisit | null // 원장님 내원 요청 (제안한 시간 포함)
  booked: string | null // 환자가 고른 시간
  memos: ClinicMemo[] // 원장님 태그 메모
  memoSeenAt: number // 환자가 마지막으로 메모를 확인한 시각
}

export const LINK_KEY = 'keepfit-clinic-link'
const EVENT = 'keepfit-clinic-link'
const empty: ClinicLink = { visit: null, booked: null, memos: [], memoSeenAt: 0 }

export function readLink(): ClinicLink {
  try {
    const raw = localStorage.getItem(LINK_KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

export function writeLink(patch: Partial<ClinicLink>) {
  const next = { ...readLink(), ...patch }
  try {
    localStorage.setItem(LINK_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable; the link only works within a shared origin anyway
  }
  window.dispatchEvent(new Event(EVENT))
}

export function clearLink() {
  try {
    localStorage.removeItem(LINK_KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useClinicLink() {
  const [link, setLink] = useState<ClinicLink>(readLink)
  useEffect(() => {
    const sync = (e: Event) => {
      if (e instanceof StorageEvent && e.key !== null && e.key !== LINK_KEY) return
      setLink(readLink())
    }
    window.addEventListener('storage', sync)
    window.addEventListener(EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(EVENT, sync)
    }
  }, [])
  return link
}

export function timeAgo(at: number) {
  const min = Math.round((Date.now() - at) / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const h = Math.round(min / 60)
  return h < 24 ? `${h}시간 전` : `${Math.round(h / 24)}일 전`
}
