// Dev helper: screenshot the studio with a sample outfit. Usage: node e2e/shot.mjs <out.png> [theme]
import { chromium } from '@playwright/test'

const [out, theme = 'princess'] = process.argv.slice(2)
const outfits = {
  princess: { hair: 'princess_hair_long_1', dress: 'princess_dress_princess_4', head: 'princess_head_crown_12', back: 'princess_back_wings_16', shoes: 'princess_shoes_heels_10' },
  fashion: { hair: 'fashion_hair_bob_1', top: 'fashion_top_jacket_6', bottom: 'fashion_bottom_skirt_8', shoes: 'fashion_shoes_sneakers_13', face: 'fashion_face_glasses_18', head: 'fashion_head_hat_16' },
  chibi: { hair: 'chibi_hair_pigtails_1', dress: 'chibi_dress_sundress_9', head: 'chibi_head_catears_12', shoes: 'chibi_shoes_boots_11', back: 'chibi_back_tail_17' },
}
const b = await chromium.launch({ channel: 'msedge' })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } })
await p.goto('http://localhost:4173')
await p.evaluate(
  ([theme, outfit]) =>
    localStorage.setItem(
      'be-dien-xinh-save',
      JSON.stringify({ version: 1, theme, unlocked: Object.values(outfit), outfits: { [theme]: outfit } }),
    ),
  [theme, outfits[theme]],
)
await p.reload()
await p.getByTestId('continue').click()
await p.screenshot({ path: out })
await b.close()
