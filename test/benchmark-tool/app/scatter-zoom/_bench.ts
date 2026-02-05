import { test, expect } from '@playwright/test';
import { goToPage } from '../../utils/goToPage';

test('benchmark render', async ({ page }) => {
  const { saveReport, setName } = await goToPage(__filename, page);

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

  await saveReport();
});
