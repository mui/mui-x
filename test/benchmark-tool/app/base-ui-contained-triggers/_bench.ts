import { test } from '@playwright/test';
import { goToPage } from '../../utils/goToPage';

test('Base UI Contained Triggers', async ({ page }) => {
  const { saveReport } = await goToPage(__filename, page);

  // Wait for the browser to be idle before saving the report
  await page.evaluate(() => {
    return new Promise((resolve) => {
      requestIdleCallback(resolve, { timeout: 5000 });
    });
  });

  await saveReport();
});
