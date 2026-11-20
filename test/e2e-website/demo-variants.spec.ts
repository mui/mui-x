import { test, expect } from '@playwright/test';

test.describe('Demo source variants', () => {
  test.skip(!process.env.PLAYWRIGHT_TEST_BASE_URL, 'Set the migrated docs build URL explicitly.');

  for (const { path, name } of [
    { path: '/x/react-charts/lines/', name: 'InterpolationDemo' },
    { path: '/x/react-date-pickers/base-concepts/', name: 'BasicDatePicker' },
  ]) {
    test(`omits source tools for ${name} with hideToolbar`, async ({ page }) => {
      await page.goto(path);
      const demo = page.locator(`#${name}`).locator('..');
      await demo.scrollIntoViewIfNeeded();
      await expect(demo).toBeVisible();
      await expect(demo.getByRole('toolbar', { name: 'demo source' })).toHaveCount(0);
      await expect(demo.locator('textarea')).toHaveCount(0);
      await expect(demo.locator('[id^="demoSource-"]')).toHaveCount(0);
    });
  }

  test('renders an interactive iframe demo with source tools outside the frame', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-data-grid/components/toolbar/#GridToolbarCustom.tsx');
    const demo = page.locator('#GridToolbarCustom').locator('..');
    const frame = demo.locator('iframe').contentFrame();
    await expect(frame.getByRole('grid')).toBeVisible();
    await frame.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(frame.getByRole('searchbox', { name: 'Search', exact: true })).toBeVisible();
    await expect(demo.getByRole('toolbar', { name: 'demo source' })).not.toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(demo.locator('pre code')).toContainText('export default function');
  });

  test('hides the source toolbar below the small breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 599, height: 800 });
    await page.goto('/x/react-data-grid/');
    const demo = page.locator('#DataGridDemo').locator('..');
    await expect(demo.getByRole('grid')).toBeVisible();
    await expect(demo.getByRole('toolbar', { name: 'demo source' })).toBeHidden();
  });
});
