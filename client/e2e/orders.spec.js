import { test, expect } from '@playwright/test'

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
    await page.waitForSelector('table tbody tr')
  })

  test('page loads with data', async ({ page }) => {
    await expect(page.locator('.page-header h2')).toHaveText('Orders')
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('stat cards display non-zero values', async ({ page }) => {
    const cards = page.locator('.stat-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    const firstValue = await cards.first().locator('.stat-value').textContent()
    expect(firstValue.trim()).not.toBe('0')
  })

  test('status filter shows only matching orders', async ({ page }) => {
    await page.locator('.filter-select').nth(3).selectOption('Delivered')
    await page.waitForTimeout(500)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const status = await rows.nth(i).locator('.badge').textContent()
      expect(status.toLowerCase()).toBe('delivered')
    }
  })

  test('warehouse filter propagates from filter bar', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-select').nth(1).selectOption('London')
    await page.waitForTimeout(500)
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
    expect(filteredRows).toBeGreaterThan(0)
  })
})
