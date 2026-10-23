const MUTE_KEY = 'be-dien-xinh-muted'

let ctx: AudioContext | null = null

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMuted(m: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, m ? '1' : '0')
  } catch {
    /* storage unavailable */
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = ctx.currentTime + start
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export type Sfx = 'correct' | 'wrong' | 'tap' | 'click'

/** Kenney UI Pack sounds (CC0), see public/sfx/KENNEY_LICENSE.txt. */
const SAMPLES: Partial<Record<Sfx, string>> = {
  tap: 'sfx/tap-a.ogg',
  click: 'sfx/click-a.ogg',
}

function playSample(src: string): boolean {
  try {
    const a = new Audio(`${import.meta.env.BASE_URL}${src}`)
    a.volume = 0.6
    void a.play().catch(() => {})
    return a.canPlayType('audio/ogg') !== ''
  } catch {
    return false
  }
}

export function play(sfx: Sfx) {
  if (isMuted()) return
  const sample = SAMPLES[sfx]
  if (sample && playSample(sample)) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    if (sfx === 'correct') {
      ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle'))
    } else if (sfx === 'wrong') {
      tone(300, 0, 0.18, 'sine', 0.1) // soft, short: gentle rather than punishing
      tone(250, 0.14, 0.22, 'sine', 0.1)
    } else {
      tone(660, 0, 0.08, 'sine', 0.08)
    }
  } catch {
    /* audio unavailable */
  }
}
