import { useState } from 'react'
import { THEMES } from '../data/config'
import { itemsFor } from '../data/items'
import type { Item, Outfit, SaveData, ThemeId } from '../types'
import { Doll, ItemThumb } from './Doll'

export function Home({
  hasProgress,
  theme,
  outfit,
  onPlay,
  onContinue,
}: {
  hasProgress: boolean
  theme: ThemeId
  outfit: Outfit
  onPlay: () => void
  onContinue: () => void
}) {
  return (
    <main className="screen home">
      <h1 className="logo">
        <span>Bé</span> Diện Xinh
      </h1>
      <p className="sub">Chọn đồ, trả lời câu hỏi, mở khóa trang phục xinh!</p>
      <div className="home-dolls" aria-hidden="true">
        <div className="home-glow" />
        <Doll theme={theme} outfit={outfit} className="mini" />
      </div>
      <div className="stack">
        {hasProgress && (
          <button className="btn btn-primary btn-big" onClick={onContinue} data-testid="continue">
            ▶ Tiếp tục chơi
          </button>
        )}
        <button className={`btn btn-big ${hasProgress ? 'btn-yellow' : 'btn-primary'}`} onClick={onPlay} data-testid="play">
          ✨ Chơi ngay
        </button>
      </div>
    </main>
  )
}

export function StylePicker({
  current,
  onConfirm,
  onBack,
  outfits,
}: {
  current: ThemeId | null
  outfits: SaveData['outfits']
  onConfirm: (t: ThemeId) => void
  onBack?: () => void
}) {
  const [sel, setSel] = useState<ThemeId>(current ?? 'princess')
  return (
    <main className="screen">
      <header className="bar">
        {onBack ? (
          <button className="btn btn-blue" onClick={onBack}>
            ← Quay lại
          </button>
        ) : (
          <span />
        )}
        <h2>Chọn phong cách</h2>
        <span />
      </header>
      <div className="cards" role="radiogroup" aria-label="Phong cách">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={sel === t.id}
            className={`style-card${sel === t.id ? ' selected' : ''}`}
            style={{ background: `linear-gradient(160deg, ${t.bgFrom}, ${t.bgTo})`, ['--accent' as string]: t.accent }}
            onClick={() => setSel(t.id)}
            data-testid={`style-${t.id}`}
          >
            <Doll theme={t.id} outfit={outfits[t.id]} className="card-doll" />
            <strong>
              {t.emoji} {t.name}
            </strong>
            <small>{t.tagline}</small>
            {sel === t.id && <span className="tick">✓ Đã chọn</span>}
          </button>
        ))}
      </div>
      <button className="btn btn-primary btn-big" onClick={() => onConfirm(sel)} data-testid="confirm-style">
        Xác nhận
      </button>
    </main>
  )
}

export function Collection({ save, onBack, onPick }: { save: SaveData; onBack: () => void; onPick: (t: ThemeId) => void }) {
  const owned = new Set(save.unlocked)
  return (
    <main className="screen">
      <header className="bar">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Quay lại
        </button>
        <h2>Bộ sưu tập</h2>
        <span />
      </header>
      {THEMES.map((t) => {
        const list = itemsFor(t.id)
        const have = list.filter((i) => owned.has(i.id)).length
        return (
          <section key={t.id} className="coll-theme" style={{ ['--accent' as string]: t.accent }}>
            <div className="coll-head">
              <Doll theme={t.id} outfit={save.outfits[t.id]} className="coll-doll" />
              <div>
                <h3>
                  {t.emoji} {t.name}
                </h3>
                <p data-testid={`count-${t.id}`}>
                  Đã mở {have}/{list.length}
                </p>
                <button className="btn btn-ghost" onClick={() => onPick(t.id)}>
                  Chơi phong cách này
                </button>
              </div>
            </div>
            <div className="grid">
              {list.map((i: Item) => (
                <div key={i.id} className={`cell${owned.has(i.id) ? '' : ' cell-locked'}`} title={i.name}>
                  <ItemThumb item={i} locked={!owned.has(i.id)} />
                  <span className="cell-name">{owned.has(i.id) ? i.name : '🔒 Chưa mở'}</span>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
