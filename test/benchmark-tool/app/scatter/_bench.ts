import path from 'path';
import { test, expect } from '@playwright/test';
import { CAPTURE_RENDER_FN, type RenderEvent } from '../../utils/Profiler';

const route = path.dirname(__filename).split('/app').pop()!;

test('benchmark render', async ({ page }) => {
  const renders: RenderEvent[] = [];

  // Expose function for Profiler to call
  await page.exposeFunction(CAPTURE_RENDER_FN, (event: RenderEvent) => {
    renders.push(event);
  });

  await page.goto(route);

  // Wait for chart to be visible
  await expect(page.locator('svg:not([aria-hidden="true"])')).toBeVisible();

  // eslint-disable-next-line no-console
  console.log('Render events:', renders);

  expect(renders.length).toBeGreaterThan(0);
  expect(renders[0].phase).toBe('mount');
});
