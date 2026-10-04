import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Layout'
import { scenarios } from '../data/mock'
import { useAppState } from '../state/AppState'
import { snapshot, writeLink } from '../state/link'

// Simulated call for the demo. The voice agent calls only when the patient misses app check-ins.
export default function LiveCall() {
  const { scenario } = useAppState()
  const lines = scenarios[scenario].transcript
  const [shown, setShown] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const navigate = useNavigate()
  const logRef = useRef<HTMLDivElement>(null)

  // Hang up: send what the call recorded to the clinic dashboard, then show the summary
  const finish = () => {
    writeLink({ patient: snapshot(scenario, Date.now(), 'call') })
    navigate('/summary')
  }

  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (shown >= lines.length) {
      const done = setTimeout(finish, 1800)
      return () => clearTimeout(done)
    }
    const next = setTimeout(() => setShown((n) => n + 1), 1400)
    return () => clearTimeout(next)
  }, [shown, lines.length])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [shown])

  const mm = String(Math.floor(seconds / 60)).padStart(1, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <Screen dark>
      <div className="call">
        <div className="call__avatar">
          <Icon name="phone" size={40} />
        </div>
        <b style={{ fontSize: 22 }}>AI 코치</b>
        <span className="call__meta">
          통화 중 · {mm}:{ss}
        </span>

        <div className="call__log" ref={logRef} aria-live="polite">
          {lines.slice(0, shown).map((l, i) => (
            <div key={i} className={`bubble bubble--${l.who}`}>
              {l.text}
            </div>
          ))}
        </div>

        <button type="button" className="call__end" aria-label="통화 종료" onClick={finish}>
          <Icon name="phone" size={28} />
        </button>
      </div>
    </Screen>
  )
}
