import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForSelector('table tbody tr')
  })

  test('page loads with data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inventory', exact: true })).toBeVisible()
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table shows expected columns', async ({ page }) => {
    const headers = page.locator('thead th')
    const texts = await headers.allTextContents()
    const upper = texts.map(t => t.toUpperCase())
    expect(upper.some(t => t.includes('SKU'))).toBeTruthy()
    expect(upper.some(t => t.includes('NAME') || t.includes('ITEM'))).toBeTruthy()
    expect(upper.some(t => t.includes('CATEGORY'))).toBeTruthy()
    expect(upper.some(t => t.includes('LOCATION') || t.includes('WAREHOUSE'))).toBeTruthy()
  })

  test('warehouse filter reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-select').nth(1).selectOption('San Francisco')
    await page.waitForTimeout(500)
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThan(allRows)
    expect(filteredRows).toBeGreaterThan(0)
  })

  test('category filter reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-select').nth(2).selectOption('Sensors')
    await page.waitForTimeout(500)
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThan(allRows)
    expect(filteredRows).toBeGreaterThan(0)
  })

  test('search by item name filters the table', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('sensor')
    await page.waitForTimeout(300)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const text = await rows.nth(i).textContent()
      expect(text.toLowerCase()).toContain('sensor')
    }
  })
})
