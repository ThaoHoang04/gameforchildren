import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const questions: { prompt: string; answer: string; choices: string[] }[] = JSON.parse(
  readFileSync('src/data/questions.json', 'utf8'),
)

const byPrompt = (p: string) => questions.find((q) => q.prompt === p)!

async function start(page: Page, theme = 'princess') {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByTestId('play').click()
  await page.getByTestId(`style-${theme}`).click()
  await page.getByTestId('confirm-style').click()
}

const firstLocked = (page: Page, tab: string) =>
  page.getByTestId(`tab-${tab}`).click().then(() => page.locator('[data-locked="true"]').first())

test('wrong answer keeps item locked, correct unlocks and wears it, reload keeps it', async ({ page }) => {
  await start(page)
  const item = await firstLocked(page, 'dress')
  const itemId = await item.getAttribute('data-testid')
  await item.click()

  const modal = page.getByTestId('question-modal')
  await expect(modal).toBeVisible()
  const q = byPrompt((await page.getByTestId('q-prompt').innerText()).trim())

  // Wrong answer
  await modal.getByRole('button', { name: q.choices.find((c) => c !== q.answer)!, exact: true }).click()
  await expect(page.getByTestId('fb-hint')).toBeVisible()
  await modal.getByRole('button', { name: 'Để sau' }).click()
  await expect(page.locator(`[data-testid="${itemId}"]`)).toHaveAttribute('data-locked', 'true')

  // Correct answer
  await page.locator(`[data-testid="${itemId}"]`).click()
  const q2 = byPrompt((await page.getByTestId('q-prompt').innerText()).trim())
  await page.getByTestId('question-modal').getByRole('button', { name: q2.answer, exact: true }).click()
  await expect(page.getByTestId('fb-good')).toBeVisible()
  await page.getByTestId('wear-now').click()
  const cell = page.locator(`[data-testid="${itemId}"]`)
  await expect(cell).toHaveAttribute('data-locked', 'false')
  await expect(cell).toHaveClass(/worn/)

  // Reload keeps progress; owned item toggles without a question
  await page.reload()
  await page.getByTestId('continue').click()
  await page.getByTestId('tab-dress').click()
  const again = page.locator(`[data-testid="${itemId}"]`)
  await expect(again).toHaveAttribute('data-locked', 'false')
  await again.click()
  await expect(page.getByTestId('question-modal')).toHaveCount(0)
})

test('theme switch keeps unlocked items', async ({ page }) => {
  await start(page)
  const item = await firstLocked(page, 'dress')
  await item.click()
  const q = byPrompt((await page.getByTestId('q-prompt').innerText()).trim())
  await page.getByRole('button', { name: q.answer, exact: true }).click()
  await page.getByTestId('wear-now').click()

  await page.getByTestId('change-style').click()
  await page.getByTestId('style-fashion').click()
  await page.getByTestId('confirm-style').click()
  await expect(page.locator('[data-testid^="item-princess"]')).toHaveCount(0)

  await page.getByTestId('open-collection').click()
  await expect(page.getByTestId('count-princess')).toHaveText(/Đã mở 2\//)
})

test('modal fits a small phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await start(page)
  const item = await firstLocked(page, 'dress')
  await item.click()
  const box = await page.getByTestId('question-modal').boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(360)
})

test.describe('touch phone', () => {
  test.use({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true })

  test('can unlock an item by tapping, doll stays visible while browsing', async ({ page }) => {
    await start(page, 'chibi')
    await page.getByTestId('tab-dress').tap()
    const item = page.locator('[data-locked="true"]').first()
    const itemId = await item.getAttribute('data-testid')
    await item.tap()
    const q = byPrompt((await page.getByTestId('q-prompt').innerText()).trim())
    await page.getByRole('button', { name: q.answer, exact: true }).tap()
    await page.getByTestId('wear-now').tap()
    await expect(page.locator(`[data-testid="${itemId}"]`)).toHaveClass(/worn/)
    await expect(page.locator('.doll')).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0)
  })
})
