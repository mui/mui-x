import { test, expect } from '@playwright/test';

const DOCS_PATH = '/x/react-charts/lines/';
const BODY_FONT = /^"?IBM Plex Sans"?(?:,|$)/;
const BODY_WEIGHT = '400';
const HYDRATION_TIMEOUT_MS = 15_000;

test('keeps branded body typography before and after hydration', async ({ browser }) => {
  test.skip(!process.env.PLAYWRIGHT_TEST_BASE_URL, 'Set the docs build URL explicitly.');

  await Promise.all(
    ['server', 'hydrated'].map(async (mode) => {
      const context = await browser.newContext({
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL,
        javaScriptEnabled: mode === 'hydrated',
      });
      try {
        const page = await context.newPage();
        await page.goto(DOCS_PATH);
        if (mode === 'hydrated') {
          await expect(
            page.getByRole('toolbar', { name: 'demo source' }).first(),
          ).not.toHaveAttribute('aria-busy', 'true', { timeout: HYDRATION_TIMEOUT_MS });
        }
        const body = page.locator('body');
        await expect(body).toHaveCSS('font-family', BODY_FONT);
        await expect(body).toHaveCSS('font-weight', BODY_WEIGHT);
        await expect(body).toHaveCSS('font-style', 'normal');
      } finally {
        await context.close();
      }
    }),
  );
});
