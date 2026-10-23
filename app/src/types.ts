export type ThemeId = 'princess' | 'fashion' | 'chibi'
export type Subject = 'math' | 'viet'
export type Slot =
  | 'hair'
  | 'top'
  | 'bottom'
  | 'dress'
  | 'shoes'
  | 'head'
  | 'face'
  | 'back'
  | 'lips'
  | 'blush'
  | 'eyeshadow'
  | 'sticker'

export type Pattern = 'stars' | 'dots' | 'hearts' | 'flowers' | 'stripes'

export interface Question {
  id: string
  subject: Subject
  stage: string
  type: 'multiple_choice'
  emoji?: string
  prompt: string
  choices: string[]
  answer: string
  hint: string
  explanation: string
}

export interface Item {
  id: string
  theme: ThemeId
  slot: Slot
  shape: string
  color: string
  name: string
  pattern?: Pattern
  /** Starter items are owned from the start (so the doll is never bald). */
  starter?: boolean
}

export type Outfit = Partial<Record<Slot, string>>

export interface SaveData {
  version: 1
  theme: ThemeId | null
  unlocked: string[]
  outfits: Record<ThemeId, Outfit>
}
