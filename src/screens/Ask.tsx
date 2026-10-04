import { useState } from 'react'
import { Screen, TopBar } from '../components/Layout'
import { askKinds, askSuggestions, nextVisit, patient, type AskKind } from '../data/mock'
import { timeAgo, useLink, writeLink } from '../state/link'

// 진료와 진료 사이에 생긴 질문을 남기면 원장님 대시보드의 환자 차트·문의함에 자동으로 올라가요
export default function Ask() {
  const link = useLink()
  const list = link.inquiries ?? []
  const [kind, setKind] = useState<AskKind>('visit')
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const visitDay = (link.booking?.slot ?? nextVisit.slot).replace('\n', ' ')
  const hint = askKinds.find((k) => k.id === kind)!.hint

  const send = () => {
    const t = text.trim()
    if (!t) return
    writeLink({ inquiries: [...list, { id: `q${Date.now()}`, at: Date.now(), kind, text: t }] })
    setText('')
    setSent(true)
  }
  const markSeen = (id: string) =>
    writeLink({ inquiries: list.map((q) => (q.id === id ? { ...q, replySeenAt: Date.now() } : q)) })

  return (
    <Screen>
      <TopBar back="/home" title="원장님께 남기기" />

      <div className="segmented" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {askKinds.map((k) => (
          <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>
      <span className="small" style={{ marginTop: -6 }}>
        {kind === 'visit' ? `다음 진료 ${visitDay} · ${hint}` : hint}
      </span>

      <textarea
        className="textarea"
        placeholder={kind === 'visit' ? '진료 때 물어보고 싶은 걸 적어 두세요' : '궁금한 점을 적어 주세요'}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setSent(false)
        }}
      />
      <div className="chips chips--sm">
        {askSuggestions.map((q) => (
          <button key={q} type="button" className="chip" onClick={() => setText(q)}>
            {q}
          </button>
        ))}
      </div>

      <button type="button" className="btn" disabled={!text.trim()} style={text.trim() ? undefined : { opacity: 0.4 }} onClick={send}>
        {sent ? '원장님 차트에 올라갔어요' : '남기기'}
      </button>

      {list.length > 0 && (
        <>
          <b style={{ fontSize: 15, marginTop: 8 }}>내가 남긴 질문</b>
          {[...list].reverse().map((q) => {
            const isNew = !!q.reply && !q.replySeenAt
            return (
              <section key={q.id} className={`card${isNew ? ' card--new' : ''}`} style={{ gap: 8 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="tag">{q.kind === 'visit' ? '진료 때 물어볼 것' : '문의'}</span>
                  <span className="small">{timeAgo(q.at)}</span>
                </div>
                <span style={{ fontSize: 15, lineHeight: 1.5 }}>{q.text}</span>
                {q.reply ? (
                  <div className="reply">
                    <b>
                      {patient.doctor} 원장님 답변 · {timeAgo(q.reply.at)}
                    </b>
                    {q.reply.lines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                    {isNew && (
                      <button type="button" className="btn btn--small btn--outline" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => markSeen(q.id)}>
                        확인했어요
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="small">{q.kind === 'visit' ? `${visitDay} 진료 때 원장님이 확인해요` : '원장님 답변을 기다리는 중이에요'}</span>
                )}
              </section>
            )
          })}
        </>
      )}
    </Screen>
  )
}
