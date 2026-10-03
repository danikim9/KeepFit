// 브라우저 음성: 말하기(speechSynthesis) + 알아듣기(SpeechRecognition, 크롬).
// 실제 전화로 옮길 때는 이 파일만 전화 서비스 연결로 바꾸면 돼요.

type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

const RecognitionCtor = (): (new () => Recognition) | null => {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const canListen = () => typeof window !== 'undefined' && RecognitionCtor() !== null
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

let voice: SpeechSynthesisVoice | null = null
function pickVoice() {
  const voices = speechSynthesis.getVoices()
  voice =
    voices.find((v) => v.lang === 'ko-KR' && /Google|Yuna|Sora|Neural|Natural/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('ko')) ??
    null
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  speechSynthesis.onvoiceschanged = pickVoice
}

/** 한 문장을 말하고, 다 말하면 끝나요. 음성이 없는 브라우저에선 읽는 시간만큼 기다려요. */
export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        resolve()
      }
    }
    // 음성 엔진이 멈춰도 대화가 이어지게
    setTimeout(finish, 1500 + text.length * 170)
    if (!canSpeak()) return
    speechSynthesis.cancel()
    if (!voice) pickVoice()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ko-KR'
    if (voice) u.voice = voice
    u.rate = 1.05
    u.onend = finish
    u.onerror = finish
    speechSynthesis.speak(u)
  })
}

export function stopSpeaking() {
  if (canSpeak()) speechSynthesis.cancel()
}

export type Hearing = { result: Promise<string | null>; cancel: () => void }

/** 한 번 듣기. 말이 끝나면 문장을, 조용하거나 마이크가 막히면 null을 돌려줘요. */
export function listen(onInterim: (text: string) => void, onBlocked: () => void, timeoutMs = 9000): Hearing {
  const Ctor = RecognitionCtor()
  if (!Ctor) return { result: Promise.resolve(null), cancel: () => {} }
  const rec = new Ctor()
  rec.lang = 'ko-KR'
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 1
  let finalText = ''
  let interim = ''
  let settled = false
  let resolveFn: (v: string | null) => void = () => {}
  const result = new Promise<string | null>((r) => (resolveFn = r))
  const settle = (v: string | null) => {
    if (settled) return
    settled = true
    clearTimeout(timer)
    resolveFn(v)
  }
  rec.onresult = (e) => {
    finalText = ''
    interim = ''
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) finalText += r[0].transcript
      else interim += r[0].transcript
    }
    onInterim((finalText + interim).trim())
  }
  rec.onerror = (e) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') onBlocked()
  }
  rec.onend = () => settle((finalText || interim).trim() || null)
  const timer = setTimeout(() => {
    try {
      rec.stop()
    } catch {
      settle(null)
    }
  }, timeoutMs)
  try {
    rec.start()
  } catch {
    onBlocked()
    settle(null)
  }
  return {
    result,
    cancel: () => {
      try {
        rec.abort()
      } catch {
        /* ignore */
      }
      settle(null)
    },
  }
}
