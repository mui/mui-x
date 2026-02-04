import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:5002/scatter-bench');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
