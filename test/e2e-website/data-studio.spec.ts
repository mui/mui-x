import { test as base, expect } from '@playwright/test';
import { TestFixture } from './playwright.config';

const test = base.extend<TestFixture>({});

const COFFEE = '/x/react-data-studio/coffee-beans';

async function waitForDatasetTabs(page: import('@playwright/test').Page) {
  // The tab bar is rendered immediately, but dataset tabs only appear once
  // `createDataStudioDatasetsFromAPI` resolves. Wait for the Customers tab
  // (first dataset) to be visible so the rest of the test can interact.
  await page.locator('.MuiDataStudio-tabBar button', { hasText: 'Customers' }).waitFor({
    state: 'visible',
    timeout: 30_000,
  });
}

function tabButton(page: import('@playwright/test').Page, name: string) {
  return page.locator('.MuiDataStudio-tabBar button', { hasText: name });
}

test.describe('DataStudio routing', () => {
  test('preserves the initial ?dataset= query on page load', async ({ page }) => {
    await page.goto(`${COFFEE}?dataset=products`);

    // URL stays put (modulo Next.js trailing slash) — we never clamp a valid id.
    await expect(page).toHaveURL(/[?&]dataset=products(?:&|$)/);

    await waitForDatasetTabs(page);

    // The active tab carries the dataset label.
    await expect(page.locator('.MuiDataStudio-tabBar')).toContainText('Products');
  });

  test('clicking a different dataset tab pushes a new history entry', async ({ page }) => {
    await page.goto(`${COFFEE}?dataset=customers`);
    await waitForDatasetTabs(page);

    await tabButton(page, 'Products').click();

    await expect(page).toHaveURL(/[?&]dataset=products(?:&|$)/);
  });

  test('browser back returns to the previously visited dataset (no A->B->C loop)', async ({
    page,
  }) => {
    await page.goto(`${COFFEE}?dataset=customers`);
    await waitForDatasetTabs(page);

    // A -> B
    await tabButton(page, 'Products').click();
    await expect(page).toHaveURL(/[?&]dataset=products(?:&|$)/);

    // B -> C
    await tabButton(page, 'Orders').click();
    await expect(page).toHaveURL(/[?&]dataset=orders(?:&|$)/);

    // Back: C -> B (must NOT bounce back to C).
    await page.goBack();
    await expect(page).toHaveURL(/[?&]dataset=products(?:&|$)/);

    // Back: B -> A.
    await page.goBack();
    await expect(page).toHaveURL(/[?&]dataset=customers(?:&|$)/);
  });

  test('silently clamps an unknown ?dataset= to the first valid dataset', async ({ page }) => {
    await page.goto(`${COFFEE}?dataset=ghost`);
    await waitForDatasetTabs(page);

    // The first dataset on the schema is `customers`; the studio falls back
    // to it and rewrites the URL via `replace` (no extra history entry).
    await expect(page).toHaveURL(/[?&]dataset=customers(?:&|$)/);
  });
});
