import { test, expect } from '@playwright/test';
import { goToPage } from '../../utils/goToPage';
import { iterateTest } from '../../utils/iterateTest';

test(
  'benchmark scatter render',
  iterateTest(
    50,
    async ({ page }, _, { renders }) => {
      await goToPage(__filename, page, renders);

      // Wait for chart to be visible
      await expect(page.locator('svg:not([aria-hidden="true"])')).toBeVisible();
    },
    { warmupRuns: 10 },
  ),
);
