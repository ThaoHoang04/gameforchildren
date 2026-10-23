import type { Slot, ThemeId } from '../types'

export const GAME_CONFIG = {
  /** Probability that the next question is Math (rest is Vietnamese). */
  mathRatio: 0.5,
  /** Max consecutive questions of the same subject. */
  maxSameSubjectStreak: 2,
  /** Stages the child has learned; questions outside this list are never asked. */
  activeStages: [
    'number_range_5',
    'number_range_10',
    'number_range_20',
    'letters',
    'rhymes',
    'words',
  ],
  /** How many recent question ids are avoided. */
  recentWindow: 10,
}

export interface ThemeInfo {
  id: ThemeId
  name: string
  tagline: string
  skin: string
  bgFrom: string
  bgTo: string
  accent: string
  emoji: string
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'princess',
    name: 'Công chúa pastel',
    tagline: 'Váy xinh, vương miện lấp lánh',
    skin: '#ffe0cf',
    bgFrom: '#ffe3f1',
    bgTo: '#e5d9ff',
    accent: '#c06ce0',
    emoji: '👑',
  },
  {
    id: 'fashion',
    name: 'Fashion hiện đại',
    tagline: 'Phối đồ sành điệu như người mẫu',
    skin: '#f6cfb0',
    bgFrom: '#fff3df',
    bgTo: '#cdf3e4',
    accent: '#ff8a6b',
    emoji: '👗',
  },
  {
    id: 'chibi',
    name: 'Chibi ngộ nghĩnh',
    tagline: 'Màu kẹo, tai mèo, tai thỏ',
    skin: '#ffe6d6',
    bgFrom: '#d9f1ff',
    bgTo: '#ffe0f0',
    accent: '#3ab8f0',
    emoji: '🐱',
  },
]

export const SLOTS: { slot: Slot; label: string; emoji: string }[] = [
  { slot: 'hair', label: 'Tóc', emoji: '💇' },
  { slot: 'top', label: 'Áo', emoji: '👚' },
  { slot: 'bottom', label: 'Quần/Váy', emoji: '👖' },
  { slot: 'dress', label: 'Đầm', emoji: '👗' },
  { slot: 'shoes', label: 'Giày', emoji: '👟' },
  { slot: 'head', label: 'Mũ/Nơ', emoji: '🎀' },
  { slot: 'face', label: 'Kính', emoji: '👓' },
  { slot: 'back', label: 'Cánh/Balo', emoji: '🎒' },
]
