import { test } from '@playwright/test';
import { goToPage } from '../../utils/goToPage';
import { iterateTest } from '../../utils/iterateTest';

test(
  'Base UI Contained Triggers',
  iterateTest(
    10,
    async ({ page }, _, { renders }) => {
      await goToPage(__filename, page, renders);

      // Wait for the browser to be idle before finishing the iteration
      await page.evaluate(() => {
        return new Promise((resolve) => {
          requestIdleCallback(resolve, { timeout: 5000 });
        });
      });
    },
    { warmupRuns: 5 },
  ),
);
