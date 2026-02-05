import { test } from '@playwright/test';
import { getRouteFromFilename, goToPage } from '../../../utils/goToPage';
import { iterateTest } from '../../../utils/iterateTest';
import { generateReportFromIterations, saveReport } from '../../../utils/reporter';

const route = getRouteFromFilename(__filename);

test(
  'Base UI Contained Triggers',
  iterateTest(
    10,
    async ({ page }) => {
      await goToPage(__filename, page);

      // Wait for the browser to be idle before finishing the iteration
      await page.evaluate(() => {
        return new Promise((resolve) => {
          requestIdleCallback(resolve, { timeout: 5000 });
        });
      });
    },
    async (iterations) => {
      const report = generateReportFromIterations(iterations);
      await saveReport(report, route);
    },
    { warmupRuns: 5 },
  ),
);
