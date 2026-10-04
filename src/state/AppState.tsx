import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Scenario } from '../data/mock'
import { clearLink, readLink, snapshot, startHeartbeat, writeLink } from './link'

type State = {
  onboarded: boolean
  callTime: string // 기록 알림 시간 (AI 전화도 이 시간에)
  callFallback: boolean // 앱 기록을 2일 놓치면 AI 코치가 전화로 대신 물어봄
  missionsDone: Record<string, boolean>
  scenario: Scenario
  bookedSlot: string | null
  guideChecks: Record<string, boolean> // key: `${guideId}:${actionIndex}`
  lastEntry: { weight: number; appetite: number; sleep: number; stress: number; symptoms: string[]; at: number } | null // 오늘 앱 기록
}

const initial: State = {
  guideChecks: {},
  onboarded: false,
  callTime: '저녁 9:00',
  callFallback: true,
  missionsDone: { protein: true },
  scenario: 'normal',
  bookedSlot: null,
  lastEntry: null,
}

const KEY = 'keepfit-state'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...initial, ...JSON.parse(raw) } : initial
  } catch {
    return initial
  }
}

type Ctx = State & {
  update: (patch: Partial<State>) => void
  reset: () => void
}

const AppStateContext = createContext<Ctx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // storage unavailable (private mode); state stays in memory
    }
  }, [state])

  // Keep the clinic dashboard's view of this patient current
  useEffect(() => {
    const prev = readLink().patient
    // 방금 음성 통화로 기록된 값은 데모 데이터로 덮어쓰지 않아요
    if (prev?.live && prev.scenario === state.scenario) return
    writeLink({ patient: { ...snapshot(state.scenario, prev?.callAt ?? null, prev?.source ?? 'app') } })
  }, [state.scenario])

  useEffect(() => startHeartbeat(), [])

  const value: Ctx = {
    ...state,
    update: (patch) => setState((s) => ({ ...s, ...patch })),
    reset: () => {
      clearLink()
      writeLink({ patient: snapshot(initial.scenario) })
      setState({ ...initial })
    },
  }
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
