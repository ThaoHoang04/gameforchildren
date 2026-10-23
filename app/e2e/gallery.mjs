// Dev helper: unlock everything and screenshot outfits + the collection.
// Usage: node e2e/gallery.mjs <outDir>   (needs `vite preview --port 4173` running)
import { chromium } from '@playwright/test'

const out = process.argv[2]
const b = await chromium.launch({ channel: 'msedge' })
const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await p.goto('http://localhost:4173')

// Read the item list from the running app's bundle-free source of truth: the save parser keeps known ids only.
const looks = [
  ['princess', { hair: 'princess_hair_bun_3', dress: 'princess_dress_ballgown_18', head: 'princess_head_crown_12', lips: 'princess_lips_gloss_23', eyeshadow: 'princess_eyeshadow_shimmer_25', sticker: 'princess_sticker_star_26', shoes: 'princess_shoes_heels_10' }],
  ['princess', { hair: 'princess_hair_long_1', dress: 'princess_dress_aodai_22', head: 'princess_head_flower_14', blush: 'princess_blush_hearts_24', lips: 'princess_lips_gloss_23' }],
  ['princess', { hair: 'princess_hair_pigtails_2', dress: 'princess_dress_tiered_20', head: 'princess_head_bow_13', back: 'princess_back_wings_17', sticker: 'princess_sticker_crown_27' }],
  ['fashion', { hair: 'fashion_hair_ponytail_3', dress: 'fashion_dress_overall_20', shoes: 'fashion_shoes_sneakers_14', lips: 'fashion_lips_gloss_24', blush: 'fashion_blush_round_26', sticker: 'fashion_sticker_heart_28' }],
  ['fashion', { hair: 'fashion_hair_long_2', dress: 'fashion_dress_puff_21', eyeshadow: 'fashion_eyeshadow_soft_27', lips: 'fashion_lips_gloss_25', shoes: 'fashion_shoes_boots_15' }],
  ['chibi', { hair: 'chibi_hair_bun_2', dress: 'chibi_dress_tutu_18', head: 'chibi_head_bunnyears_13', blush: 'chibi_blush_hearts_24', shoes: 'chibi_shoes_sneakers_10' }],
  ['chibi', { hair: 'chibi_hair_pigtails_1', dress: 'chibi_dress_tiered_22', head: 'chibi_head_catears_12', eyeshadow: 'chibi_eyeshadow_shimmer_25', blush: 'chibi_blush_round_23', lips: 'chibi_lips_gloss_26' }],
]

let n = 0
for (const [theme, outfit] of looks) {
  await p.evaluate(
    ([theme, outfit]) =>
      localStorage.setItem('be-dien-xinh-save', JSON.stringify({ version: 1, theme, unlocked: Object.values(outfit), outfits: { [theme]: outfit } })),
    [theme, outfit],
  )
  await p.reload()
  await p.getByTestId('continue').click()
  const worn = await p.evaluate(() => JSON.parse(localStorage.getItem('be-dien-xinh-save')).outfits)
  const missing = Object.values(outfit).filter((id) => !Object.values(worn[theme]).includes(id))
  if (missing.length) console.log('UNKNOWN ids (dropped by save parser):', missing)
  await p.locator('.doll-wrap').screenshot({ path: `${out}/look${++n}.png` })
}

await p.getByTestId('tab-makeup').click()
await p.locator('.wardrobe').screenshot({ path: `${out}/makeup-tab.png` })
await b.close()
