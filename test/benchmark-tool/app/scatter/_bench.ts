import { test, expect } from '@playwright/test';
import { goToPage, getRouteFromFilename } from '../../utils/goToPage';
import { iterateTest } from '../../utils/iterateTest';
import { generateReportFromIterations, saveReport } from '../../utils/reporter';

const route = getRouteFromFilename(__filename);

test(
  'benchmark scatter render',
  iterateTest(
    50,
    async ({ page }, _, { renders }) => {
      await goToPage(__filename, page, renders);

      // Wait for chart to be visible
      await expect(page.locator('svg:not([aria-hidden="true"])')).toBeVisible();
    },
    async (iterations) => {
      const report = generateReportFromIterations(iterations);
      await saveReport(report, route);
    },
    { warmupRuns: 10 },
  ),
);
