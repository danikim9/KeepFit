import { useState } from 'react'
import type { Slot } from '../voice/script'

// 통화 중 질문마다 알맞은 방식으로 누르거나 입력해서 답해요.
// 체중: 후보 + 숫자 입력 · 식욕: 1–10 버튼 · 수면: 태그 · 운동: 두 버튼 · 전할 말: 여러 개 태그
type Props = { slot: Slot; prevWeight: number; onAnswer: (text: string) => void }

const r1 = (n: number) => Math.round(n * 10) / 10

export function AnswerPanel({ slot, prevWeight, onAnswer }: Props) {
  if (slot === 'weight') return <WeightPanel prevWeight={prevWeight} onAnswer={onAnswer} />
  if (slot === 'appetite') return <AppetitePanel onAnswer={onAnswer} />
  if (slot === 'sleep') return <SleepPanel onAnswer={onAnswer} />
  if (slot === 'exercise')
    return (
      <div className="ap ap--two">
        <button type="button" className="ap__big" onClick={() => onAnswer('했어요')}>
          했어요
        </button>
        <button type="button" className="ap__big" onClick={() => onAnswer('못 했어요')}>
          못 했어요
        </button>
      </div>
    )
  return <ExtraPanel onAnswer={onAnswer} />
}

function WeightPanel({ prevWeight, onAnswer }: { prevWeight: number; onAnswer: (t: string) => void }) {
  const [val, setVal] = useState('')
  const num = parseFloat(val.replace(',', '.'))
  const valid = !isNaN(num) && num >= 30 && num <= 200
  const step = (d: number) => setVal(String(r1((valid ? num : prevWeight) + d)))
  const candidates = [0, 0.5, 1, 2.2].map((d) => r1(prevWeight + d))
  return (
    <div className="ap">
      <div className="ap__chips">
        {candidates.map((c) => (
          <button key={c} type="button" onClick={() => onAnswer(`${c}`)}>
            {c}kg
          </button>
        ))}
        <button type="button" onClick={() => onAnswer('안 쟀어요')}>
          안 쟀어요
        </button>
      </div>
      <div className="ap__num">
        <button type="button" className="ap__step" onClick={() => step(-0.1)} aria-label="0.1kg 내리기">
          −
        </button>
        <label className="ap__field">
          <input
            id="weight-input"
            inputMode="decimal"
            placeholder={`${prevWeight}`}
            value={val}
            onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && valid) onAnswer(`${r1(num)}`)
            }}
            aria-label="체중 직접 입력"
          />
          <span>kg</span>
        </label>
        <button type="button" className="ap__step" onClick={() => step(0.1)} aria-label="0.1kg 올리기">
          +
        </button>
        <button type="button" className="ap__send" disabled={!valid} onClick={() => onAnswer(`${r1(num)}`)}>
          보내기
        </button>
      </div>
    </div>
  )
}

function AppetitePanel({ onAnswer }: { onAnswer: (t: string) => void }) {
  return (
    <div className="ap">
      <div className="ap__scale">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" className={n >= 8 ? 'is-high' : undefined} onClick={() => onAnswer(String(n))}>
            {n}
          </button>
        ))}
      </div>
      <div className="ap__legend">
        <span>거의 없음</span>
        <span>보통</span>
        <span>참기 힘듦</span>
      </div>
    </div>
  )
}

function SleepPanel({ onAnswer }: { onAnswer: (t: string) => void }) {
  const [typing, setTyping] = useState(false)
  const [val, setVal] = useState('')
  const num = parseFloat(val.replace(',', '.'))
  const valid = !isNaN(num) && num >= 0 && num <= 14
  return (
    <div className="ap">
      <div className="ap__chips">
        {['4시간 이하', '5시간', '5시간 반', '6시간', '7시간', '8시간 이상'].map((t) => (
          <button key={t} type="button" onClick={() => onAnswer(t)}>
            {t}
          </button>
        ))}
        <button type="button" className="is-ghost" onClick={() => setTyping((v) => !v)}>
          직접 입력
        </button>
      </div>
      {typing && (
        <div className="ap__num">
          <label className="ap__field">
            <input
              id="sleep-input"
              inputMode="decimal"
              placeholder="6.5"
              value={val}
              autoFocus
              onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && valid) onAnswer(`${num}시간`)
              }}
              aria-label="수면 시간 직접 입력"
            />
            <span>시간</span>
          </label>
          <button type="button" className="ap__send" disabled={!valid} onClick={() => onAnswer(`${num}시간`)}>
            보내기
          </button>
        </div>
      )}
    </div>
  )
}

const EXTRA_TAGS = ['야식 먹었어요', '회식·외식 있었어요', '잠을 설쳤어요', '속이 불편해요', '약 관련 질문 있어요']

function ExtraPanel({ onAnswer }: { onAnswer: (t: string) => void }) {
  const [tags, setTags] = useState<string[]>([])
  const toggle = (t: string) => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))
  return (
    <div className="ap">
      <div className="ap__chips">
        {EXTRA_TAGS.map((t) => (
          <button key={t} type="button" aria-pressed={tags.includes(t)} onClick={() => toggle(t)}>
            {t}
          </button>
        ))}
      </div>
      <button type="button" className="ap__send ap__send--wide" onClick={() => onAnswer(tags.length ? tags.join(', ') : '없어요')}>
        {tags.length ? `${tags.length}개 원장님께 보내기` : '없어요'}
      </button>
    </div>
  )
}
