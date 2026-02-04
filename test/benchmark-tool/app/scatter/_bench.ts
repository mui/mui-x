import path from 'path';
import { test, expect } from '@playwright/test';

const route = path.dirname(__filename).split('/app').pop()!;

test('has title', async ({ page }) => {
  await page.goto(route);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/MUI X Benchmark Tool/);
});
