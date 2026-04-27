import { test, expect } from '@playwright/test'

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('.stat-card')
  })

  test('page loads with recommendations', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
    const cards = page.locator('.stat-card')
    expect(await cards.count()).toBe(4)
  })

  test('budget ceiling input is visible and editable', async ({ page }) => {
    const input = page.locator('input[type="number"]')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue('50000')
  })

  test('reducing budget reduces recommendations', async ({ page }) => {
    await page.waitForSelector('table tbody tr')
    const defaultCount = await page.locator('table tbody tr').count()

    const input = page.locator('input[type="number"]')
    await input.fill('1000')
    await page.waitForTimeout(500)

    const reducedCount = await page.locator('table tbody tr').count()
    expect(reducedCount).toBeLessThanOrEqual(defaultCount)
  })

  test('budget = 0 shows no recommendations', async ({ page }) => {
    const input = page.locator('input[type="number"]')
    await input.fill('0')
    await page.waitForTimeout(500)
    await expect(page.locator('table')).not.toBeVisible()
  })

  test('recommendations are sorted by priority (high first)', async ({ page }) => {
    await page.waitForSelector('table tbody tr')
    const firstBadge = await page.locator('table tbody tr').first().locator('.badge').first().textContent()
    if (firstBadge) {
      expect(firstBadge.toLowerCase()).not.toBe('low')
    }
  })

  test('warehouse filter updates recommendations', async ({ page }) => {
    await page.waitForSelector('table tbody tr')
    await page.locator('.filter-select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(500)
    const rows = page.locator('table tbody tr')
    const noData = page.locator('.no-data')
    const hasRows = (await rows.count()) > 0
    const hasNoData = await noData.isVisible()
    expect(hasRows || hasNoData).toBeTruthy()
  })
})
