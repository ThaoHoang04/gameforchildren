import { ITEM_BY_ID, STARTER_IDS } from '../data/items'
import type { Outfit, SaveData, ThemeId } from '../types'
import { sanitizeOutfit } from './outfit'

export const SAVE_KEY = 'be-dien-xinh-save'

const THEME_IDS: ThemeId[] = ['princess', 'fashion', 'chibi']

export function defaultOutfit(theme: ThemeId): Outfit {
  const outfit: Outfit = {}
  for (const id of STARTER_IDS) {
    const item = ITEM_BY_ID[id]
    if (item.theme === theme) outfit[item.slot] = id
  }
  return outfit
}

export function freshSave(): SaveData {
  return {
    version: 1,
    theme: null,
    unlocked: [...STARTER_IDS],
    outfits: {
      princess: defaultOutfit('princess'),
      fashion: defaultOutfit('fashion'),
      chibi: defaultOutfit('chibi'),
    },
  }
}

/** Validates unknown JSON; anything malformed falls back to a fresh save. */
export function parseSave(raw: string | null): SaveData | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw)
    if (data?.version !== 1 || !Array.isArray(data.unlocked)) return null
    const fresh = freshSave()
    const unlocked = new Set<string>([
      ...STARTER_IDS,
      ...data.unlocked.filter((id: unknown) => typeof id === 'string' && id in ITEM_BY_ID),
    ])
    const outfits = { ...fresh.outfits }
    for (const t of THEME_IDS) {
      const o = data.outfits?.[t]
      if (o && typeof o === 'object') outfits[t] = sanitizeOutfit(o, unlocked)
    }
    return {
      version: 1,
      theme: THEME_IDS.includes(data.theme) ? data.theme : null,
      unlocked: [...unlocked],
      outfits,
    }
  } catch {
    return null
  }
}

export function loadSave(): { save: SaveData; existed: boolean } {
  try {
    const parsed = parseSave(localStorage.getItem(SAVE_KEY))
    if (parsed) return { save: parsed, existed: true }
  } catch {
    /* storage unavailable */
  }
  return { save: freshSave(), existed: false }
}

export function writeSave(save: SaveData): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
    return true
  } catch {
    return false
  }
}
