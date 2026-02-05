import { test, expect } from '@playwright/test';
import { getRouteFromFilename, goToPage } from '../../../utils/goToPage';
import { generateReportFromIterations, saveReport } from '../../../utils/reporter';
import { iterateTest } from '../../../utils/iterateTest';

const route = getRouteFromFilename(__filename);

test(
  'benchmark render',
  iterateTest(
    10,
    async ({ page }, _, { renders }) => {
      const { setName } = await goToPage(__filename, page, renders);

      // Wait for chart to be visible
      const svg = page.locator('svg:not([aria-hidden="true"])');
      await expect(svg).toBeVisible();

      // Scroll from the center of the SVG
      const boundingBox = (await svg.boundingBox())!;
      const centerX = boundingBox.width / 2;
      const centerY = boundingBox.height / 2;

      setName('Hover');

      await svg.hover({ position: { x: centerX, y: centerY } });

      const deltaY = -1000; // Negative for zooming in
      const steps = 20;

      setName('Zooming in');

      for (let i = 0; i < steps; i += 1) {
        // Scroll in smaller increments to simulate a smoother zoom
        // eslint-disable-next-line no-await-in-loop
        await page.mouse.wheel(0, deltaY / steps);
      }
    },
    async (iterations) => {
      const report = generateReportFromIterations(iterations);
      await saveReport(report, route);
    },
    { warmupRuns: 3 },
  ),
);
