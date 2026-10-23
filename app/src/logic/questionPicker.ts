import type { Question, Subject } from '../types'

export interface PickerOptions {
  mathRatio: number
  maxSameSubjectStreak: number
  activeStages: string[]
  recentWindow: number
  rng?: () => number
}

/** Session-only history, oldest first. */
export interface PickerHistory {
  ids: string[]
  subjects: Subject[]
}

export const emptyHistory = (): PickerHistory => ({ ids: [], subjects: [] })

function chooseSubject(
  history: PickerHistory,
  opts: PickerOptions,
  available: Record<Subject, boolean>,
  rng: () => number,
): Subject | null {
  const subjects = (['math', 'viet'] as Subject[]).filter((s) => available[s])
  if (subjects.length === 0) return null

  const tail = history.subjects.slice(-opts.maxSameSubjectStreak)
  const streakFull =
    tail.length === opts.maxSameSubjectStreak && tail.every((s) => s === tail[0])
  const allowed = streakFull ? subjects.filter((s) => s !== tail[0]) : subjects
  const pool = allowed.length > 0 ? allowed : subjects // other subject has no questions

  if (pool.length === 1) return pool[0]
  return rng() < opts.mathRatio ? 'math' : 'viet'
}

export function pickQuestion(
  bank: Question[],
  history: PickerHistory,
  opts: PickerOptions,
): Question | null {
  const rng = opts.rng ?? Math.random
  const eligible = bank.filter((q) => opts.activeStages.includes(q.stage))

  const bySubject: Record<Subject, Question[]> = {
    math: eligible.filter((q) => q.subject === 'math'),
    viet: eligible.filter((q) => q.subject === 'viet'),
  }
  const subject = chooseSubject(
    history,
    opts,
    { math: bySubject.math.length > 0, viet: bySubject.viet.length > 0 },
    rng,
  )
  if (!subject) return null

  const pool = bySubject[subject]
  // Avoid recent ids, but never so many that the pool empties.
  const window = Math.min(opts.recentWindow, Math.max(0, pool.length - 1))
  const recent = new Set(window > 0 ? history.ids.slice(-window) : [])
  const fresh = pool.filter((q) => !recent.has(q.id))
  const candidates = fresh.length > 0 ? fresh : pool
  return candidates[Math.floor(rng() * candidates.length)]
}

export function recordPick(history: PickerHistory, q: Question): PickerHistory {
  return { ids: [...history.ids, q.id], subjects: [...history.subjects, q.subject] }
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
