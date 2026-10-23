import { ITEM_BY_ID } from '../data/items'
import type { Item, Outfit, Slot } from '../types'

/** A dress replaces top+bottom, and wearing a top or bottom removes the dress. */
export function equip(outfit: Outfit, item: Item): Outfit {
  const next: Outfit = { ...outfit, [item.slot]: item.id }
  if (item.slot === 'dress') {
    delete next.top
    delete next.bottom
  } else if (item.slot === 'top' || item.slot === 'bottom') {
    delete next.dress
  }
  return next
}

export function unequip(outfit: Outfit, slot: Slot): Outfit {
  const next = { ...outfit }
  delete next[slot]
  return next
}

/** Drops anything that is not owned or unknown, so a locked item can never render. */
export function sanitizeOutfit(outfit: Outfit, owned: Set<string>): Outfit {
  const next: Outfit = {}
  for (const [slot, id] of Object.entries(outfit) as [Slot, string][]) {
    const item = ITEM_BY_ID[id]
    if (item && item.slot === slot && owned.has(id)) next[slot] = id
  }
  return next
}
