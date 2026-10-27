/**
 * Text-to-speech for first graders who cannot read yet.
 * Uses the browser's Web Speech API with a Vietnamese voice. Voice is part of the game
 * (not a sound effect), so it ignores the sound-effects mute button.
 */

const NUM = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']

export function numberToVi(n: number): string {
  if (n <= 10) return NUM[n]
  if (n < 20) return `mười ${n === 15 ? 'lăm' : NUM[n - 10]}`
  if (n === 20) return 'hai mươi'
  return String(n)
}

/** Turns on-screen text such as "5 + 3 = ?" into something a voice can say. */
export function toSpeech(text: string): string {
  return text
    .replace(/\.\.\./g, ' ')
    .replace(/\+/g, ' cộng ')
    .replace(/\s-\s/g, ' trừ ')
    .replace(/=/g, ' bằng ')
    .replace(/>/g, ' lớn hơn ')
    .replace(/</g, ' bé hơn ')
    .replace(/\?/g, ' mấy ')
    .replace(/\d+/g, (d) => ` ${numberToVi(Number(d))} `)
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!])/g, '$1')
    .trim()
}

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = synth()?.getVoices() ?? []
  const vi = voices.filter((v) => v.lang.toLowerCase().startsWith('vi'))
  // Prefer a local/natural voice when several are installed.
  return vi.find((v) => v.localService) ?? vi[0]
}

/** Resolves true when a Vietnamese voice is installed (voices can load a moment after page load). */
export function hasVietnameseVoice(): Promise<boolean> {
  const s = synth()
  if (!s) return Promise.resolve(false)
  if (pickVoice()) return Promise.resolve(true)
  return new Promise((resolve) => {
    const done = () => {
      s.removeEventListener('voiceschanged', done)
      resolve(Boolean(pickVoice()))
    }
    s.addEventListener('voiceschanged', done)
    setTimeout(done, 1500)
  })
}

export function stopSpeaking() {
  synth()?.cancel()
}

export function speak(text: string) {
  const s = synth()
  if (!s || !text) return
  try {
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice()
    u.lang = voice?.lang ?? 'vi-VN'
    if (voice) u.voice = voice
    u.rate = 0.85 // a little slower for children
    u.pitch = 1.1
    s.speak(u)
  } catch {
    /* speech unavailable */
  }
}
