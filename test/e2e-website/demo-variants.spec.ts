import { test, expect } from '@playwright/test';
import type { Locator } from '@playwright/test';

const MAX_OFFSET_PX = 1;

async function expectColors(demo: Locator) {
  await expect(async () => {
    const keyword = demo.locator('pre code .pl-k').first();
    const string = demo.locator('pre code .pl-s').first();

    await expect(keyword).toBeVisible();
    await expect(string).toBeVisible();

    const keywordColor = await keyword.evaluate((node) => getComputedStyle(node).color);
    const stringColor = await string.evaluate((node) => getComputedStyle(node).color);

    expect(keywordColor).not.toBe(stringColor);
  }).toPass({ timeout: 10_000 });
}

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

  test('colors source tokens before editor activation', async ({ page }) => {
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');

    await demo.getByRole('button', { name: 'Show code', exact: true }).click();
    await expect(demo.locator('textarea')).toHaveCount(1);
    await expect(demo.locator('textarea')).not.toBeFocused();

    await expectColors(demo);
  });

  test('keeps switched files colored after editing without focusing them', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');

    await demo.getByRole('button', { name: 'Show code', exact: true }).click();
    await demo.getByRole('group', { name: 'Editable code' }).first().click();

    const editor = demo.locator('textarea:visible');

    await editor.focus();
    await expect(editor).toBeFocused();
    const source = await editor.inputValue();

    await editor.fill(source.replace('Focus chart', 'Edited focus chart'));
    await expect(
      demo.getByRole('button', { name: 'Edited focus chart', exact: true }),
    ).toBeVisible();

    async function checkFile(file: RegExp) {
      await demo.getByRole('tab', { name: file }).click();
      await expectColors(demo);
      await expect(demo.locator('textarea:focus')).toHaveCount(0);
    }

    async function checkLanguage(language: 'JavaScript' | 'TypeScript') {
      await demo.getByRole('button', { name: `Show ${language} source`, exact: true }).click();
      await checkFile(/KeyboardNavigation\.(?:tsx|jsx)$/);
      await checkFile(/randomData\.(?:ts|js)$/);
    }

    await checkLanguage('JavaScript');
    await checkLanguage('TypeScript');
  });

  test('hides chart source after switching languages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');

    await demo.getByRole('button', { name: 'Show code', exact: true }).click();
    await demo.getByRole('group', { name: 'Editable code' }).first().click();
    await demo.locator('textarea:visible').focus();
    await expect(demo.locator('textarea:visible')).toBeFocused();
    await demo.getByRole('button', { name: 'Hide code', exact: true }).click();
    await expect(demo.locator('pre:visible, textarea:visible')).toHaveCount(0);

    async function hideLanguage(language: 'JavaScript' | 'TypeScript') {
      await demo.getByRole('button', { name: 'Show code', exact: true }).click();
      await demo.getByRole('button', { name: `Show ${language} source`, exact: true }).click();
      await expect(demo.getByRole('button', { name: 'Hide code', exact: true })).toBeVisible();
      await expect(demo.locator('pre').first()).toBeVisible();

      await demo.getByRole('button', { name: 'Hide code', exact: true }).click();

      await expect(demo.getByRole('button', { name: 'Show code', exact: true })).toBeVisible();
      await expect(demo.locator('pre:visible, textarea:visible')).toHaveCount(0);
      await expect(demo.getByRole('button', { name: 'Show JavaScript source' })).toBeHidden();
      await expect(demo.getByRole('button', { name: 'Show TypeScript source' })).toBeHidden();
    }

    await hideLanguage('JavaScript');
    await hideLanguage('TypeScript');
  });

  for (const source of ['edited', 'helper'] as const) {
    test(`hides ${source} chart source when the viewer closes`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('/x/react-charts/accessibility/#keyboard-support');

      const demo = page.locator('#KeyboardNavigation').locator('..');

      await demo.getByRole('button', { name: 'Show code', exact: true }).click();

      if (source === 'edited') {
        await demo.getByRole('group', { name: 'Editable code' }).first().click();
        const editor = demo.locator('textarea:visible');

        await editor.focus();
        const initialSource = await editor.inputValue();

        await editor.fill(initialSource.replace('Focus chart', 'Edited focus chart'));
        await expect(
          demo.getByRole('button', { name: 'Edited focus chart', exact: true }),
        ).toBeVisible();
      } else {
        await demo.getByRole('tab', { name: /randomData\.(?:ts|js)$/ }).click();
        await expect(demo.locator('pre').first()).toBeVisible();
      }

      const preview = await demo.getByRole('img').first().elementHandle();

      await demo.getByRole('button', { name: 'Hide code', exact: true }).click();

      await expect(demo.getByRole('button', { name: 'Show code', exact: true })).toBeVisible();
      await expect(demo.locator('pre:visible, textarea:visible')).toHaveCount(0);
      expect(await preview!.evaluate((node) => node.isConnected)).toBe(true);

      await demo.getByRole('button', { name: 'Show code', exact: true }).click();

      if (source === 'edited') {
        await demo.getByRole('group', { name: 'Editable code' }).first().click();
        const editor = demo.locator('textarea:visible');

        await editor.focus();
        await expect(editor).toHaveValue(/Edited focus chart/);
      } else {
        await expect(demo.getByRole('tab', { name: /randomData\.(?:ts|js)$/ })).toHaveAttribute(
          'aria-selected',
          'true',
        );
      }

      expect(await preview!.evaluate((node) => node.isConnected)).toBe(true);
    });
  }

  test('preserves chart state and DOM across source toggles', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');
    const type = demo.getByRole('combobox', { name: 'Chart Type' });

    await type.click();
    await page.getByRole('option', { name: 'Bar', exact: true }).click();
    await expect(type).toHaveText('Bar');

    const plot = await demo.getByRole('img').first().elementHandle();

    async function toggle(name: 'Show code' | 'Hide code') {
      await demo.getByRole('button', { name, exact: true }).click();
      await expect(type).toHaveText('Bar');
      expect(await plot!.evaluate((node) => node.isConnected)).toBe(true);
    }

    await toggle('Show code');
    await toggle('Hide code');
    await toggle('Show code');
    await toggle('Hide code');

    await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
    await expect(type).toHaveText('Line');
  });

  test('preserves the chart when the editor activates before an edit', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');
    const type = demo.getByRole('combobox', { name: 'Chart Type' });

    await type.click();
    await page.getByRole('option', { name: 'Bar', exact: true }).click();
    await demo.getByRole('button', { name: 'Show code', exact: true }).click();

    const plot = await demo.getByRole('img').first().elementHandle();

    await demo.getByRole('group', { name: 'Editable code' }).first().click();

    const editor = demo.locator('textarea:visible');

    await expect(editor).toBeFocused();
    await expect(type).toHaveText('Bar');
    expect(await plot!.evaluate((node) => node.isConnected)).toBe(true);

    const source = await editor.inputValue();

    expect(source).toContain('Focus chart');
    await editor.fill(source.replace('Focus chart', 'Edited focus chart'));
    await expect(
      demo.getByRole('button', { name: 'Edited focus chart', exact: true }),
    ).toBeVisible();
  });

  test('preserves grid selection and DOM across source toggles', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/x/react-data-grid/');

    const demo = page.locator('#DataGridDemo').locator('..');
    const checkbox = demo.getByRole('checkbox').nth(1);

    await checkbox.check();
    const grid = await demo.getByRole('grid').elementHandle();

    async function toggle(name: 'Show code' | 'Hide code') {
      await demo.getByRole('button', { name, exact: true }).click();
      await expect(checkbox).toBeChecked();
      expect(await grid!.evaluate((node) => node.isConnected)).toBe(true);
    }

    await toggle('Show code');
    await toggle('Hide code');
    await toggle('Show code');
    await toggle('Hide code');
  });

  test('positions keyboard tooltips beside the focused chart item', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/x/react-charts/accessibility/#keyboard-support');

    const demo = page.locator('#KeyboardNavigation').locator('..');
    const focus = demo.getByRole('button', { name: 'Focus chart', exact: true });

    await focus.scrollIntoViewIfNeeded();
    await focus.click();
    await page.keyboard.press('ArrowDown');

    const tooltip = page.getByRole('tooltip');
    const mark = demo.locator('svg rect[fill="none"][stroke-width="2"]');

    await expect(tooltip).toBeVisible();
    await expect(mark).toHaveCount(1);
    await expect(async () => {
      const tooltipBox = await tooltip.boundingBox();
      const markBox = await mark.boundingBox();

      expect(tooltipBox).not.toBeNull();
      expect(markBox).not.toBeNull();
      expect(
        Math.abs(tooltipBox!.x + tooltipBox!.width / 2 - markBox!.x - markBox!.width / 2),
      ).toBeLessThan(MAX_OFFSET_PX);
      expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(markBox!.y);
    }).toPass({ timeout: 15_000 });
  });

  test('hides the source toolbar below the small breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 599, height: 800 });
    await page.goto('/x/react-data-grid/');
    const demo = page.locator('#DataGridDemo').locator('..');
    await expect(demo.getByRole('grid')).toBeVisible();
    await expect(demo.getByRole('toolbar', { name: 'demo source' })).toBeHidden();
  });
});
