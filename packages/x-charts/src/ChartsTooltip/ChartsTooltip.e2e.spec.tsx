import { test, expect } from '@playwright/experimental-ct-react';
import { BarChartTest } from './ChartsTooltip.e2e.stories';

test.use({ viewport: { width: 500, height: 500 } });

test.describe('<ChartsTooltip/>', () => {
  test('should display tooltip on item hover', async ({ mount, page }) => {
    const component = await mount(<BarChartTest />);

    await component.getByText('100').hover({ force: true });

    expect(await page.getByRole('tooltip').isVisible()).toBe(true);
    expect(await page.getByRole('tooltip').textContent()).toBe('100');
  });

  test('should display tooltip when dragging over multiple items with touch', async ({
    mount,
    page,
    hasTouch,
  }) => {
    test.skip(!hasTouch, 'Test touch only on touch devices');

    const component = await mount(<BarChartTest />);

    const first = (await component.getByText('100').boundingBox())!;
    const second = (await component.getByText('200').boundingBox())!;

    const getCenter = (box: { x: number; y: number; width: number; height: number }) => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    });

    // Wait for playwright v1.46.0 to land
    // https://github.com/microsoft/playwright/pull/31457
    await page.touchscreen.touch('touchstart', [{ x: 0, y: 0 }]);

    expect(await page.getByRole('tooltip').isVisible()).toBe(false);

    await page.touchscreen.touch('touchmove', [getCenter(first)]);

    expect(await page.getByRole('tooltip').isVisible()).toBe(true);
    expect(await page.getByRole('tooltip').textContent()).toBe('100');

    await page.touchscreen.touch('touchmove', [getCenter(second)]);

    expect(await page.getByRole('tooltip').isVisible()).toBe(true);
    expect(await page.getByRole('tooltip').textContent()).toBe('200');

    await page.touchscreen.touch('touchend', [getCenter(second)]);

    expect(await page.getByRole('tooltip').isVisible()).toBe(false);
  });
});
