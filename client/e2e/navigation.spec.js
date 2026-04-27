import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('all nav links are present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('.nav-tabs')
    await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Inventory' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Orders' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Finance' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Demand Forecast' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Restocking' })).toBeVisible()
  })

  test('each nav link navigates to the correct page', async ({ page }) => {
    const routes = [
      { name: 'Inventory', path: '/inventory', heading: 'Inventory' },
      { name: 'Orders', path: '/orders', heading: 'Orders' },
      { name: 'Reports', path: '/reports', heading: 'Performance Reports' },
      { name: 'Restocking', path: '/restocking', heading: 'Restocking Recommendations' }
    ]

    for (const route of routes) {
      await page.goto('/')
      await page.locator('.nav-tabs').getByRole('link', { name: route.name }).click()
      await expect(page).toHaveURL(route.path)
      await expect(page.getByRole('heading', { name: route.heading })).toBeVisible()
    }
  })

  test('active nav link is highlighted', async ({ page }) => {
    await page.goto('/inventory')
    const inventoryLink = page.locator('.nav-tabs').getByRole('link', { name: 'Inventory' })
    await expect(inventoryLink).toHaveClass(/active/)
  })
})
