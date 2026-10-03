import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Scenario } from '../data/mock'
import { clearLink, readLink, snapshot, startHeartbeat, writeLink } from './link'

type State = {
  onboarded: boolean
  frequency: string
  callTime: string
  textFallback: boolean
  missionsDone: Record<string, boolean>
  scenario: Scenario
  bookedSlot: string | null
  guideChecks: Record<string, boolean> // key: `${guideId}:${actionIndex}`
}

const initial: State = {
  guideChecks: {},
  onboarded: false,
  frequency: '매일',
  callTime: '저녁 9:00',
  textFallback: true,
  missionsDone: { protein: true },
  scenario: 'normal',
  bookedSlot: null,
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
    writeLink({ patient: { ...snapshot(state.scenario), callAt: prev?.callAt ?? null } })
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
