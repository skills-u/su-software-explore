import { test, expect } from '@playwright/test'

test('opens the detail modal and returns focus to the card on Escape', async ({
  page,
}) => {
  await page.goto('/')
  const card = page.getByRole('button', { name: /view details for/i }).first()
  await card.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(card).toBeFocused()
})
