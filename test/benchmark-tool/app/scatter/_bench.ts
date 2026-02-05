import { test, expect } from '@playwright/test';
import { goToPage } from '../../utils/goToPage';

test('benchmark render', async ({ page }) => {
  const { saveReport } = await goToPage(__filename, page);

  // Wait for chart to be visible
  await expect(page.locator('svg:not([aria-hidden="true"])')).toBeVisible();

  saveReport();
});
