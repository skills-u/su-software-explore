import { test, expect } from '@playwright/test'

test('favorites persist across a full page reload', async ({ page }) => {
  await page.goto('/')

  const addStar = page
    .getByRole('button', { name: /add .+ to favorites/i })
    .first()
  const label = await addStar.getAttribute('aria-label')
  const name = label!.replace(/^Add /, '').replace(/ to favorites$/, '')

  await addStar.click()
  await expect(
    page.getByRole('button', { name: `Remove ${name} from favorites` }),
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByRole('button', { name: `Remove ${name} from favorites` }),
  ).toBeVisible()
})
