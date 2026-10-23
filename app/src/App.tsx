import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Collection, Home, StylePicker } from './components/Screens'
import { QuestionModal } from './components/QuestionModal'
import { Studio } from './components/Studio'
import questionsJson from './data/questions.json'
import { GAME_CONFIG } from './data/config'
import { equip, unequip } from './logic/outfit'
import { emptyHistory, pickQuestion, recordPick, type PickerHistory } from './logic/questionPicker'
import { loadSave, writeSave } from './logic/save'
import type { Item, Question, SaveData, Slot, ThemeId } from './types'

const BANK = questionsJson as Question[]

type Screen = 'home' | 'style' | 'studio' | 'collection'

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave().save)
  const [screen, setScreen] = useState<Screen>('home')
  const [pending, setPending] = useState<{ item: Item; question: Question } | null>(null)
  const [undo, setUndo] = useState<SaveData['outfits'][ThemeId][]>([])
  const [flash, setFlash] = useState(false)
  const history = useRef<PickerHistory>(emptyHistory())
  const firstRender = useRef(true)

  const theme = save.theme
  const owned = useMemo(() => new Set(save.unlocked), [save.unlocked])

  // Autosave on every change (skip the initial mount).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    writeSave(save)
  }, [save])

  // State changes come from events, so the "saved" toast is triggered there too.
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const update = useCallback((fn: (s: SaveData) => SaveData) => {
    setSave(fn)
    setFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(false), 1200)
  }, [])

  // Each screen starts at the top (otherwise the previous screen's scroll carries over).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const setOutfit = useCallback(
    (fn: (o: SaveData['outfits'][ThemeId]) => SaveData['outfits'][ThemeId], extra?: (s: SaveData) => SaveData) => {
      update((s) => {
        if (!s.theme) return s
        const next = { ...s, outfits: { ...s.outfits, [s.theme]: fn(s.outfits[s.theme]) } }
        return extra ? extra(next) : next
      })
    },
    [update],
  )

  const pushUndo = () => {
    if (theme) setUndo((u) => [...u.slice(-19), save.outfits[theme]])
  }

  const onSelectItem = (item: Item) => {
    if (!theme) return
    if (owned.has(item.id)) {
      pushUndo()
      // Tapping the worn item takes it off; otherwise wear it. No question for owned items.
      setOutfit((o) => (o[item.slot] === item.id ? unequip(o, item.slot) : equip(o, item)))
      return
    }
    const question = pickQuestion(BANK, history.current, GAME_CONFIG)
    if (!question) return
    history.current = recordPick(history.current, question)
    setPending({ item, question })
  }

  const onCorrect = () => {
    if (!pending) return
    const { item } = pending
    pushUndo()
    setOutfit(
      (o) => equip(o, item),
      (s) => (s.unlocked.includes(item.id) ? s : { ...s, unlocked: [...s.unlocked, item.id] }),
    )
  }

  const onClearSlot = (slot: Slot) => {
    pushUndo()
    setOutfit((o) => unequip(o, slot))
  }

  const onUndo = () => {
    const prev = undo[undo.length - 1]
    if (!prev) return
    setUndo((u) => u.slice(0, -1))
    setOutfit(() => prev)
  }

  const chooseTheme = (t: ThemeId) => {
    update((s) => ({ ...s, theme: t }))
    setUndo([])
    setScreen('studio')
  }

  return (
    <>
      {screen === 'home' && (
        <Home
          hasProgress={theme !== null}
          theme={theme ?? 'princess'}
          outfit={save.outfits[theme ?? 'princess']}
          onPlay={() => setScreen('style')}
          onContinue={() => setScreen('studio')}
        />
      )}
      {screen === 'style' && (
        <StylePicker
          current={theme}
          outfits={save.outfits}
          onConfirm={chooseTheme}
          onBack={() => setScreen(theme ? 'studio' : 'home')}
        />
      )}
      {screen === 'studio' && theme && (
        <Studio
          theme={theme}
          outfit={save.outfits[theme]}
          owned={owned}
          savedFlash={flash}
          onSelectItem={onSelectItem}
          onClearSlot={onClearSlot}
          onUndo={onUndo}
          canUndo={undo.length > 0}
          onChangeStyle={() => setScreen('style')}
          onCollection={() => setScreen('collection')}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'collection' && (
        <Collection save={save} onBack={() => setScreen(theme ? 'studio' : 'home')} onPick={chooseTheme} />
      )}
      {pending && (
        <QuestionModal
          key={pending.question.id + pending.item.id}
          question={pending.question}
          item={pending.item}
          onCorrect={onCorrect}
          onClose={() => setPending(null)}
        />
      )}
    </>
  )
}
