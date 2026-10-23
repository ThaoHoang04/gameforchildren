import { useState } from 'react'
import { SLOTS, THEMES } from '../data/config'
import { itemsFor } from '../data/items'
import { isMuted, play, setMuted } from '../logic/sound'
import type { Item, Outfit, Slot, ThemeId } from '../types'
import { Doll, ItemThumb } from './Doll'

interface Props {
  theme: ThemeId
  outfit: Outfit
  owned: Set<string>
  savedFlash: boolean
  onSelectItem: (item: Item) => void
  onClearSlot: (slot: Slot) => void
  onUndo: () => void
  canUndo: boolean
  onChangeStyle: () => void
  onCollection: () => void
  onHome: () => void
}

export function Studio(p: Props) {
  const info = THEMES.find((t) => t.id === p.theme)!
  const slots = SLOTS.filter((s) => itemsFor(p.theme, s.slot).length > 0)
  const [slot, setSlot] = useState<Slot>(slots[0].slot)
  const list = itemsFor(p.theme, slot)
  const [muted, setMutedState] = useState(isMuted)

  return (
    <main
      className="screen studio"
      style={{
        background: `linear-gradient(160deg, ${info.bgFrom}, ${info.bgTo})`,
        ['--accent' as string]: info.accent,
      }}
    >
      <header className="bar">
        <button className="btn btn-ghost" onClick={p.onHome} aria-label="Màn hình chính">
          🏠
        </button>
        <h2>
          {info.emoji} {info.name}
        </h2>
        <div className="bar-actions">
          <button
            className="btn btn-ghost"
            aria-pressed={muted}
            aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            onClick={() => {
              setMuted(!muted)
              setMutedState(!muted)
            }}
            data-testid="mute"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="btn btn-ghost" onClick={p.onChangeStyle} data-testid="change-style" aria-label="Đổi phong cách">
            🎨<span className="hide-sm"> Đổi</span>
          </button>
          <button className="btn btn-ghost" onClick={p.onCollection} data-testid="open-collection" aria-label="Bộ sưu tập">
            📚
          </button>
        </div>
      </header>

      <div className="studio-body">
        <section className="stage" aria-label="Búp bê">
          <Doll theme={p.theme} outfit={p.outfit} className="doll" />
          <div className="stage-actions">
            <button className="btn btn-ghost" onClick={p.onUndo} disabled={!p.canUndo} data-testid="undo">
              ↩ Hoàn tác
            </button>
            <button className="btn btn-ghost" onClick={() => p.onClearSlot(slot)} disabled={!p.outfit[slot]} data-testid="clear-slot">
              ✖ Tháo món này
            </button>
          </div>
          <div className={`saved${p.savedFlash ? ' show' : ''}`} role="status">
            ✓ Đã lưu
          </div>
        </section>

        <section className="wardrobe" aria-label="Tủ đồ">
          <div className="tabs" role="tablist">
            {slots.map((s) => (
              <button
                key={s.slot}
                role="tab"
                aria-selected={slot === s.slot}
                className={`tab${slot === s.slot ? ' active' : ''}`}
                onClick={() => {
                  play('click')
                  setSlot(s.slot)
                }}
                data-testid={`tab-${s.slot}`}
              >
                <span aria-hidden="true">{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
          <div className="grid" role="list">
            {list.map((item) => {
              const has = p.owned.has(item.id)
              const worn = p.outfit[item.slot] === item.id
              return (
                <button
                  key={item.id}
                  role="listitem"
                  className={`cell${has ? '' : ' cell-locked'}${worn ? ' worn' : ''}`}
                  onClick={() => {
                    if (has) play('tap')
                    p.onSelectItem(item)
                  }}
                  aria-label={`${item.name}${has ? (worn ? ' – đang mặc' : '') : ' – đang khóa'}`}
                  data-testid={`item-${item.id}`}
                  data-locked={!has}
                >
                  <ItemThumb item={item} locked={!has} />
                  {!has && (
                    <span className="lock" aria-hidden="true">
                      🔒
                    </span>
                  )}
                  {worn && (
                    <span className="worn-badge" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  <span className="cell-name">{item.name}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
