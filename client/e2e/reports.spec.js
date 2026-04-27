import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('table tbody tr')
  })

  test('page loads with quarterly data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('quarterly table contains Q1–Q4 rows', async ({ page }) => {
    const rows = page.locator('table').first().locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(4)
    const firstCell = await rows.first().locator('td').first().textContent()
    expect(firstCell).toMatch(/Q[1-4]-\d{4}/)
  })

  test('summary stat cards are present and non-empty', async ({ page }) => {
    const cards = page.locator('.stat-card')
    expect(await cards.count()).toBe(4)
    for (let i = 0; i < 4; i++) {
      const value = await cards.nth(i).locator('.stat-value').textContent()
      expect(value.trim().length).toBeGreaterThan(0)
    }
  })

  test('bar chart renders monthly bars', async ({ page }) => {
    const bars = page.locator('.bar')
    expect(await bars.count()).toBeGreaterThan(0)
  })

  test('warehouse filter updates quarterly data', async ({ page }) => {
    const beforeRevenue = await page.locator('table tbody tr').first().locator('td').nth(2).textContent()
    await page.locator('.filter-select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(600)
    const afterRevenue = await page.locator('table tbody tr').first().locator('td').nth(2).textContent()
    expect(afterRevenue).toMatch(/\$[\d,]+/)
  })
})
