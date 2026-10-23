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
  const all = itemsFor(p.theme)
  const have = all.filter((i) => p.owned.has(i.id)).length
  // Changes whenever the outfit changes, so the doll "pops" when something is worn.
  const outfitKey = Object.values(p.outfit).join('|')

  return (
    <main
      className={`screen studio theme-${p.theme}`}
      style={
        {
          ['--accent' as string]: info.accent,
          ['--bg-from' as string]: info.bgFrom,
          ['--bg-to' as string]: info.bgTo,
        } as React.CSSProperties
      }
    >
      <header className="hud">
        <button className="round-btn" onClick={p.onHome} aria-label="Màn hình chính">
          🏠
        </button>
        <div className="hud-title">
          <span className="hud-theme">
            {info.emoji} {info.name}
          </span>
          <div className="progress" role="img" aria-label={`Đã mở ${have} trên ${all.length} món`}>
            <div className="progress-fill" style={{ width: `${(have / all.length) * 100}%` }} />
            <span className="progress-text">
              ⭐ {have}/{all.length}
            </span>
          </div>
        </div>
        <div className="hud-actions">
          <button
            className="round-btn"
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
          <button className="round-btn" onClick={p.onChangeStyle} data-testid="change-style" aria-label="Đổi phong cách">
            🎨
          </button>
          <button className="round-btn" onClick={p.onCollection} data-testid="open-collection" aria-label="Bộ sưu tập">
            📚
          </button>
        </div>
      </header>

      <div className="studio-body">
        <section className="stage" aria-label="Búp bê">
          <div className="scene" aria-hidden="true">
            <span>✨</span>
            <span>⭐</span>
            <span>💖</span>
            <span>✨</span>
            <span>⭐</span>
          </div>
          <div className="spot" aria-hidden="true" />
          <div key={outfitKey} className="doll-wrap">
            <Doll theme={p.theme} outfit={p.outfit} className="doll" />
          </div>
          <div className="floor" aria-hidden="true" />
          <div className="stage-actions">
            <button className="btn btn-blue" onClick={p.onUndo} disabled={!p.canUndo} data-testid="undo">
              ↩ Hoàn tác
            </button>
            <button className="btn btn-yellow" onClick={() => p.onClearSlot(slot)} disabled={!p.outfit[slot]} data-testid="clear-slot">
              ✖ Tháo
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
                <span className="tab-ico" aria-hidden="true">
                  {s.emoji}
                </span>
                <span className="tab-label">{s.label}</span>
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
