import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { patient } from '../data/mock'
import { readLink, writeLink } from '../state/link'

// 데모용 휴대폰 바탕화면. 저녁 9시가 되면 유지케어 알림이 내려오고,
// 바로 전화로 받거나 버튼으로 답할 수 있어요.
const APPS = ['메시지', '전화', '캘린더', '사진', '카메라', '지도', '날씨', '설정']
const APP_COLORS = ['#34a853', '#2f9e57', '#e8eaed', '#f4b400', '#5f6368', '#4285f4', '#5aa9e6', '#8e8e93']

export default function PhoneHome() {
  const navigate = useNavigate()
  const [note, setNote] = useState(false)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (note) setSeen(true)
  }, [note])

  // 들어오면 잠시 뒤 알림 (대시보드 "지금 전화 걸기"로도 바로 와요)
  useEffect(() => {
    const t = setTimeout(() => setNote(true), 2200)
    const onStorage = (e: StorageEvent) => {
      if ((e.key === 'keepfit-link' || e.key === null) && readLink().callRequest) setNote(true)
    }
    window.addEventListener('storage', onStorage)
    return () => {
      clearTimeout(t)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const answerCall = () => {
    writeLink({ callRequest: null })
    navigate('/call')
  }
  const tags = () => {
    writeLink({ callRequest: null })
    navigate('/call', { state: { silent: true } })
  }

  return (
    <div className="os">
      <div className="os__status">
        <span>9:00</span>
        <span>●●● ▮</span>
      </div>

      {note && (
        <div className="os__note" role="alert">
          <button type="button" className="os__note-body" onClick={() => navigate('/call', { state: { ring: true } })}>
            <span className="os__app-icon os__app-icon--sm">유</span>
            <span className="os__note-text">
              <span className="os__note-head">
                <b>유지케어</b>
                <small>지금</small>
              </span>
              <b>AI 코치 · 오늘의 체크인 전화</b>
              <span>지은님, 오늘 상태를 2분만 여쭤볼게요. 통화가 어려우면 눌러서 답해도 돼요.</span>
            </span>
          </button>
          <div className="os__note-actions">
            <button type="button" className="os__btn os__btn--call" onClick={answerCall}>
              <Icon name="phone" size={16} />
              전화로 답하기
            </button>
            <button type="button" className="os__btn" onClick={tags}>
              소리 없이 답하기
            </button>
          </div>
        </div>
      )}

      <div className="os__clock">
        <b>9:00</b>
        <span>10월 3일 토요일</span>
      </div>

      <div className="os__grid">
        {APPS.map((a, i) => (
          <div key={a} className="os__app">
            <span className="os__app-icon" style={{ background: APP_COLORS[i] }} aria-hidden="true" />
            <span>{a}</span>
          </div>
        ))}
        <button type="button" className="os__app" onClick={() => navigate('/home')}>
          <span className="os__app-icon">유</span>
          <span>유지케어</span>
        </button>
      </div>

      <div className="os__foot">
        {!note && !seen && <span>잠시 뒤 {patient.clinic}에서 체크인 알림이 와요</span>}
        {!note && seen && (
          <button type="button" className="os__replay" onClick={() => setNote(true)}>
            알림 다시 보기
          </button>
        )}
        {note && (
          <button type="button" className="os__replay" onClick={() => setNote(false)}>
            알림 닫기
          </button>
        )}
      </div>
    </div>
  )
}
