// Dev helper: open a Vietnamese (picture) question, screenshot it and report available voices.
// Usage: node e2e/voice-shot.mjs <outDir>   (needs `vite preview --port 4173` running)
import { chromium } from '@playwright/test'

const out = process.argv[2]
const b = await chromium.launch({ channel: 'msedge' })
const p = await b.newPage({ viewport: { width: 420, height: 760 }, reducedMotion: 'reduce' })
await p.addInitScript(() => {
  // Record what the game asks the voice to say.
  window.__said = []
  const orig = window.speechSynthesis?.speak?.bind(window.speechSynthesis)
  if (orig) window.speechSynthesis.speak = (u) => (window.__said.push(u.text), orig(u))
})
await p.goto('http://localhost:4173')
await p.evaluate(() => localStorage.clear())
await p.reload()
await p.getByTestId('play').click()
await p.getByTestId('confirm-style').click()
await p.getByTestId('tab-dress').click()

for (let i = 0; i < 40; i++) {
  await p.locator('[data-locked="true"]').first().click()
  const subject = await p.locator('.chip').innerText()
  if (subject.includes('Tiếng Việt')) break
  await p.getByRole('button', { name: 'Để sau' }).click()
}
await p.waitForTimeout(1200)
const voices = await p.evaluate(() => speechSynthesis.getVoices().map((v) => v.lang + ' ' + v.name).filter((v) => v.toLowerCase().startsWith('vi')))
console.log('vi voices:', voices)
console.log('said:', await p.evaluate(() => window.__said))
console.log('no-voice warning shown:', await p.getByTestId('no-voice').count())
await p.getByTestId('question-modal').screenshot({ path: `${out}/viet-question.png` })
await b.close()
