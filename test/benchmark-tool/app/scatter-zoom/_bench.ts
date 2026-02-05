import path from 'path';
import { test, expect } from '@playwright/test';
import { CAPTURE_RENDER_FN, type RenderEvent } from '../../utils/Profiler';
import { generateReport, saveReport } from '../../utils/reporter';

const route = path.dirname(__filename).split('/app').pop()!;

test('benchmark render', async ({ page }) => {
  const renders: RenderEvent[] = [];

  // Expose function for Profiler to call
  await page.exposeFunction(CAPTURE_RENDER_FN, (event: RenderEvent) => {
    renders.push(event);
  });

  await page.goto(route);

  // Wait for chart to be visible
  const svg = page.locator('svg:not([aria-hidden="true"])');
  await expect(svg).toBeVisible();

  // Scroll from the center of the SVG
  const boundingBox = (await svg.boundingBox())!;
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.height / 2;

  await svg.hover({ position: { x: centerX, y: centerY } });

  const deltaY = -1000; // Negative for zooming in
  const steps = 20;

  await page.pause();

  for (let i = 0; i < steps; i += 1) {
    // Scroll in smaller increments to simulate a smoother zoom
    // eslint-disable-next-line no-await-in-loop
    await page.mouse.wheel(0, deltaY / steps);
  }

  await page.pause();

  const report = generateReport(renders);
  saveReport(report, route);
});
