// Dev helper: close-up of every shoe on a bare-legged doll. Usage: node e2e/shoes.mjs <outDir>
import { chromium } from '@playwright/test'

const out = process.argv[2]
const shoes = [
  ['princess', 'princess_shoes_heels_10'],
  ['princess', 'princess_shoes_heels_11'],
  ['princess', 'princess_shoes_ballet_28'],
  ['fashion', 'fashion_shoes_sneakers_13'],
  ['fashion', 'fashion_shoes_sneakers_14'],
  ['fashion', 'fashion_shoes_boots_15'],
  ['fashion', 'fashion_shoes_maryjane_29'],
  ['chibi', 'chibi_shoes_sneakers_10'],
  ['chibi', 'chibi_shoes_boots_11'],
  ['chibi', 'chibi_shoes_maryjane_27'],
]
const starter = { princess: 'princess_hair_long_1', fashion: 'fashion_hair_bob_1', chibi: 'chibi_hair_pigtails_1' }

const b = await chromium.launch({ channel: 'msedge' })
const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await p.goto('http://localhost:4173')
let n = 0
for (const [theme, id] of shoes) {
  const outfit = { hair: starter[theme], shoes: id }
  await p.evaluate(
    ([theme, outfit]) =>
      localStorage.setItem('be-dien-xinh-save', JSON.stringify({ version: 1, theme, unlocked: Object.values(outfit), outfits: { [theme]: outfit } })),
    [theme, outfit],
  )
  await p.reload()
  await p.getByTestId('continue').click()
  const ok = await p.evaluate(() => JSON.parse(localStorage.getItem('be-dien-xinh-save')).outfits)
  if (!Object.values(ok[theme]).includes(id)) console.log('UNKNOWN id:', id)
  const box = await p.locator('.doll').boundingBox()
  await p.screenshot({
    path: `${out}/shoe${String(++n).padStart(2, '0')}.png`,
    clip: { x: box.x + box.width * 0.18, y: box.y + box.height * 0.66, width: box.width * 0.64, height: box.height * 0.34 },
  })
}
await b.close()
