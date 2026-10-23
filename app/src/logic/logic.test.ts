import { describe, expect, it } from 'vitest'
import questions from '../data/questions.json'
import { GAME_CONFIG } from '../data/config'
import { ITEMS, ITEM_BY_ID, itemsFor } from '../data/items'
import type { Question, Subject } from '../types'
import { equip, sanitizeOutfit, unequip } from './outfit'
import { emptyHistory, pickQuestion, recordPick } from './questionPicker'
import { freshSave, parseSave } from './save'

const bank = questions as Question[]
const opts = { ...GAME_CONFIG }

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

describe('question bank', () => {
  it('has 30 math + 30 viet with valid answers', () => {
    expect(bank.filter((q) => q.subject === 'math')).toHaveLength(30)
    expect(bank.filter((q) => q.subject === 'viet')).toHaveLength(30)
    for (const q of bank) {
      expect(q.choices).toContain(q.answer)
      expect(new Set(q.choices).size).toBe(q.choices.length)
      expect(q.hint.length).toBeGreaterThan(0)
    }
    expect(new Set(bank.map((q) => q.id)).size).toBe(bank.length)
  })
})

describe('pickQuestion', () => {
  it('never asks the same subject more than twice in a row', () => {
    const rng = seeded(1)
    let h = emptyHistory()
    for (let i = 0; i < 300; i++) {
      const q = pickQuestion(bank, h, { ...opts, rng })!
      h = recordPick(h, q)
    }
    const s = h.subjects
    for (let i = 2; i < s.length; i++) {
      expect(s[i] === s[i - 1] && s[i] === s[i - 2]).toBe(false)
    }
  })

  it('is roughly 50/50 by default', () => {
    const rng = seeded(7)
    let h = emptyHistory()
    let math = 0
    for (let i = 0; i < 400; i++) {
      const q = pickQuestion(bank, h, { ...opts, rng })!
      if (q.subject === 'math') math++
      h = recordPick(h, q)
    }
    expect(math / 400).toBeGreaterThan(0.4)
    expect(math / 400).toBeLessThan(0.6)
  })

  it('does not repeat the previous question', () => {
    const rng = seeded(3)
    let h = emptyHistory()
    let prev = ''
    for (let i = 0; i < 200; i++) {
      const q = pickQuestion(bank, h, { ...opts, rng })!
      expect(q.id).not.toBe(prev)
      prev = q.id
      h = recordPick(h, q)
    }
  })

  it('only uses active stages', () => {
    const rng = seeded(5)
    const onlyEasy = { ...opts, activeStages: ['number_range_5', 'letters'], rng }
    let h = emptyHistory()
    for (let i = 0; i < 100; i++) {
      const q = pickQuestion(bank, h, onlyEasy)!
      expect(['number_range_5', 'letters']).toContain(q.stage)
      h = recordPick(h, q)
    }
  })

  it('falls back to the other subject when one has no questions', () => {
    const mathOnly = bank.filter((q) => q.subject === 'math')
    let h = emptyHistory()
    const subjects = new Set<Subject>()
    for (let i = 0; i < 10; i++) {
      const q = pickQuestion(mathOnly, h, opts)!
      subjects.add(q.subject)
      h = recordPick(h, q)
    }
    expect([...subjects]).toEqual(['math'])
  })
})

describe('outfit', () => {
  const dress = ITEMS.find((i) => i.slot === 'dress')!
  const top = ITEMS.find((i) => i.slot === 'top')!

  it('dress replaces top and bottom, and vice versa', () => {
    const o1 = equip({ top: top.id, bottom: 'x' }, dress)
    expect(o1.top).toBeUndefined()
    expect(o1.bottom).toBeUndefined()
    expect(o1.dress).toBe(dress.id)
    const o2 = equip(o1, top)
    expect(o2.dress).toBeUndefined()
    expect(o2.top).toBe(top.id)
  })

  it('unequip removes the slot', () => {
    expect(unequip({ top: top.id }, 'top')).toEqual({})
  })

  it('sanitizeOutfit drops locked items', () => {
    expect(sanitizeOutfit({ dress: dress.id }, new Set())).toEqual({})
    expect(sanitizeOutfit({ dress: dress.id }, new Set([dress.id]))).toEqual({ dress: dress.id })
  })
})

describe('items & save', () => {
  it('each theme has 15-30 items and a starter hair', () => {
    for (const t of ['princess', 'fashion', 'chibi'] as const) {
      const list = itemsFor(t)
      expect(list.length).toBeGreaterThanOrEqual(15)
      expect(list.length).toBeLessThanOrEqual(30)
      expect(list.some((i) => i.starter && i.slot === 'hair')).toBe(true)
    }
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length)
  })

  it('each theme has plenty of dresses and makeup', () => {
    for (const t of ['princess', 'fashion', 'chibi'] as const) {
      expect(itemsFor(t, 'dress').length).toBeGreaterThanOrEqual(6)
      expect(itemsFor(t, ['lips', 'blush', 'eyeshadow', 'sticker']).length).toBeGreaterThanOrEqual(4)
    }
  })

  it('makeup slots stack: lipstick does not remove blush', () => {
    const lips = ITEMS.find((i) => i.slot === 'lips')!
    const blush = ITEMS.find((i) => i.slot === 'blush')!
    expect(equip(equip({}, blush), lips)).toEqual({ blush: blush.id, lips: lips.id })
  })

  it('round-trips a save and keeps unlocked items', () => {
    const save = freshSave()
    const id = ITEMS.find((i) => !i.starter)!.id
    save.unlocked.push(id)
    save.theme = 'fashion'
    const back = parseSave(JSON.stringify(save))!
    expect(back.unlocked).toContain(id)
    expect(back.theme).toBe('fashion')
  })

  it('rejects bad data and strips unknown / locked ids', () => {
    expect(parseSave(null)).toBeNull()
    expect(parseSave('{oops')).toBeNull()
    expect(parseSave(JSON.stringify({ version: 99 }))).toBeNull()
    const locked = ITEMS.find((i) => !i.starter)!
    const back = parseSave(
      JSON.stringify({
        version: 1,
        theme: 'nope',
        unlocked: ['ghost'],
        outfits: { [locked.theme]: { [locked.slot]: locked.id } },
      }),
    )!
    expect(back.theme).toBeNull()
    expect(back.unlocked).not.toContain('ghost')
    expect(back.outfits[locked.theme][locked.slot]).not.toBe(locked.id)
    expect(ITEM_BY_ID[locked.id]).toBeDefined()
  })
})
